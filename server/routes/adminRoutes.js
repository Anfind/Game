import express from 'express';
import Game from '../models/Game.js';
import Player from '../models/Player.js';

const router = express.Router();

// Get all games
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find({})
      .sort({ createdAt: -1 })
      .limit(100); // Limit to last 100 games for performance
    
    res.json({ games });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Failed to fetch games' });
  }
});

// Get all players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find({})
      .sort({ createdAt: -1 })
      .limit(200); // Limit to last 200 players for performance
    
    res.json({ players });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Failed to fetch players' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalGames, completedGames, failedGames, totalPlayers, activePlayers] = await Promise.all([
      Game.countDocuments({}),
      Game.countDocuments({ status: 'completed' }),
      Game.countDocuments({ status: 'failed' }),
      Player.countDocuments({}),
      Player.countDocuments({ isWaiting: false, pairId: { $exists: true } })
    ]);

    const stats = {
      totalGames,
      completedGames,
      failedGames,
      totalPlayers,
      activePlayers
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Delete a game
router.delete('/games/:pairId', async (req, res) => {
  try {
    const { pairId } = req.params;
    
    // Delete game
    await Game.deleteOne({ pairId });
    
    // Delete associated players
    await Player.deleteMany({ pairId });
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Failed to delete game' });
  }
});

// Delete a player
router.delete('/players/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    await Player.deleteOne({ playerId });
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Failed to delete player' });
  }
});

// Clear all data (dangerous operation)
router.delete('/clear-all', async (req, res) => {
  try {
    await Game.deleteMany({});
    await Player.deleteMany({});
    
    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ message: 'Failed to clear data' });
  }
});

// Get detailed game information
router.get('/games/:pairId', async (req, res) => {
  try {
    const { pairId } = req.params;
    const game = await Game.findOne({ pairId });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Get associated players
    const players = await Player.find({ pairId });
    
    res.json({ game, players });
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Failed to fetch game details' });
  }
});

export default router;