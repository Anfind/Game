import Player from '../models/Player.js';
import Game from '../models/Game.js';
import { findPair } from '../controllers/gameController.js';

export const setupSocketHandlers = (io) => {
  // Store active connections
  const activeConnections = new Map();

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Player joins and requests pairing
    socket.on('join_game', async (data) => {
      try {
        const { playerId } = data;
        
        activeConnections.set(playerId, socket.id);
        
        // Try to find a pair
        const pairResult = await findPair(playerId);
        
        if (pairResult) {
          const { pairId, players, game } = pairResult;
          
          // Notify both players
          Object.values(players).forEach((player) => {
            const playerSocket = activeConnections.get(player.playerId);
            if (playerSocket) {
              io.to(playerSocket).emit('pair_found', {
                pairId,
                playerId: player.playerId,
                role: player.role,
                batna: player.batna,
                opponentRole: player.role === 'A' ? 'B' : 'A',
                groupNumber: game.groupNumber,
                currentTurn: game.currentTurn
              });
            }
          });
          
          console.log(`🎯 Pair created: ${pairId}`);
        } else {
          // No pair found, player is waiting
          socket.emit('waiting_for_pair', {
            message: 'Waiting for another player...'
          });
        }
      } catch (error) {
        console.error('Error in join_game:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Player submits an offer
    socket.on('submit_offer', async (data) => {
      try {
        const { pairId, playerId, offerA, offerB } = data;
        
        const game = await Game.findOne({ pairId });
        const player = await Player.findOne({ playerId });
        
        if (!game || !player) {
          socket.emit('error', { message: 'Game or player not found' });
          return;
        }

        // Validate turn
        if (player.role !== game.currentTurn) {
          socket.emit('error', { message: 'Not your turn' });
          return;
        }

        // Validate offer sum
        if (offerA + offerB !== 1000) {
          socket.emit('error', { message: 'Offers must sum to €1,000' });
          return;
        }

        // Get opponent
        const opponentId = player.role === 'A' ? game.playerB.playerId : game.playerA.playerId;
        const opponentSocketId = activeConnections.get(opponentId);
        
        // Notify opponent to respond
        if (opponentSocketId) {
          io.to(opponentSocketId).emit('offer_received', {
            offerA,
            offerB,
            proposer: player.role,
            roundNumber: game.currentRound
          });
        }
        
        // Confirm to proposer
        socket.emit('offer_sent', {
          offerA,
          offerB,
          waitingForResponse: true
        });
        
      } catch (error) {
        console.error('Error in submit_offer:', error);
        socket.emit('error', { message: 'Failed to submit offer' });
      }
    });

    // Player submits response
    socket.on('submit_response', async (data) => {
      try {
        const { pairId, playerId, response, offerA, offerB } = data;
        
        const game = await Game.findOne({ pairId });
        const player = await Player.findOne({ playerId });
        
        if (!game || !player) {
          socket.emit('error', { message: 'Game or player not found' });
          return;
        }

        // Add round to history
        game.rounds.push({
          roundNumber: game.currentRound,
          proposer: game.currentTurn,
          offerA,
          offerB,
          response
        });

        let gameEnded = false;
        let gameResult = null;

        // Handle response
        if (response === 'accept') {
          game.status = 'completed';
          gameResult = {
            type: 'success',
            finalOfferA: offerA,
            finalOfferB: offerB,
            payoutA: offerA,
            payoutB: offerB,
            reason: 'Offer accepted'
          };
          game.result = gameResult;
          game.completedAt = new Date();
          gameEnded = true;
        } else if (response === 'not_accept') {
          game.status = 'failed';
          gameResult = {
            type: 'failed',
            payoutA: 0,
            payoutB: game.playerB.batna,
            reason: 'Negotiation terminated'
          };
          game.result = gameResult;
          game.completedAt = new Date();
          gameEnded = true;
        } else {
          // Continue negotiation
          game.currentRound += 1;
          
          if (game.currentRound > 10) {
            // Max rounds reached
            game.status = 'failed';
            gameResult = {
              type: 'failed',
              payoutA: 0,
              payoutB: game.playerB.batna,
              reason: 'Maximum rounds reached'
            };
            game.result = gameResult;
            game.completedAt = new Date();
            gameEnded = true;
          } else {
            // Switch turn
            game.currentTurn = game.currentTurn === 'A' ? 'B' : 'A';
          }
        }

        await game.save();

        // Notify both players
        const playerAId = game.playerA.playerId;
        const playerBId = game.playerB.playerId;
        const playerASocketId = activeConnections.get(playerAId);
        const playerBSocketId = activeConnections.get(playerBId);

        if (gameEnded) {
          // Game ended - send result to both
          const resultData = {
            ...gameResult,
            pairId: game.pairId,
            rounds: game.rounds,
            groupNumber: game.groupNumber
          };

          if (playerASocketId) {
            io.to(playerASocketId).emit('game_ended', resultData);
          }
          if (playerBSocketId) {
            io.to(playerBSocketId).emit('game_ended', resultData);
          }

          console.log(`🏁 Game ended: ${pairId} - ${gameResult.type}`);
        } else {
          // Game continues - notify turn change
          const updateData = {
            currentTurn: game.currentTurn,
            currentRound: game.currentRound,
            lastResponse: response,
            lastOffer: { offerA, offerB }
          };

          if (playerASocketId) {
            io.to(playerASocketId).emit('turn_updated', updateData);
          }
          if (playerBSocketId) {
            io.to(playerBSocketId).emit('turn_updated', updateData);
          }
        }

      } catch (error) {
        console.error('Error in submit_response:', error);
        socket.emit('error', { message: 'Failed to submit response' });
      }
    });

    // Get opponent BATNA
    socket.on('get_opponent_batna', async (data) => {
      try {
        const { pairId, playerId } = data;
        
        const game = await Game.findOne({ pairId });
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        const player = await Player.findOne({ playerId });
        if (!player) {
          socket.emit('error', { message: 'Player not found' });
          return;
        }

        // Get opponent's BATNA
        const opponentBatna = player.role === 'A' ? game.playerB.batna : game.playerA.batna;
        
        socket.emit('opponent_batna', {
          batna: opponentBatna
        });
      } catch (error) {
        console.error('Error getting opponent BATNA:', error);
        socket.emit('error', { message: 'Failed to get opponent BATNA' });
      }
    });

    // Handle reconnection
    socket.on('reconnect_player', async (data) => {
      try {
        const { playerId } = data;
        const player = await Player.findOne({ playerId });
        
        if (player) {
          // Update socket ID
          player.socketId = socket.id;
          await player.save();
          activeConnections.set(playerId, socket.id);
          
          // If player has a pair, rejoin the game
          if (player.pairId) {
            const game = await Game.findOne({ pairId: player.pairId });
            if (game && game.status === 'active') {
              socket.emit('reconnected', {
                pairId: player.pairId,
                role: player.role,
                batna: player.role === 'A' ? game.playerA.batna : game.playerB.batna,
                currentTurn: game.currentTurn,
                currentRound: game.currentRound,
                groupNumber: game.groupNumber
              });
              console.log(`🔄 Player reconnected: ${playerId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error in reconnect_player:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      
      // Find and remove player from active connections
      for (const [playerId, socketId] of activeConnections.entries()) {
        if (socketId === socket.id) {
          activeConnections.delete(playerId);
          
          try {
            const player = await Player.findOne({ playerId });
            if (player) {
              if (player.pairId) {
                // Player has a pair - notify opponent
                const game = await Game.findOne({ pairId: player.pairId });
                if (game && game.status === 'active') {
                  const opponentId = player.role === 'A' ? game.playerB.playerId : game.playerA.playerId;
                  const opponentSocketId = activeConnections.get(opponentId);
                  
                  if (opponentSocketId) {
                    io.to(opponentSocketId).emit('opponent_disconnected', {
                      message: 'Your opponent has disconnected'
                    });
                  }
                }
              } else if (player.isWaiting) {
                // Player was waiting but never paired - delete from DB
                await Player.deleteOne({ playerId });
                console.log(`🗑️  Removed waiting player: ${playerId}`);
              }
            }
          } catch (error) {
            console.error('Error handling disconnect:', error);
          }
          
          break;
        }
      }
    });
  });
};
