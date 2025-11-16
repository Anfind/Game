import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { toast } from 'react-toastify';

const responseOptions = [
  { 
    value: 'too_low', 
    label: 'Too Low', 
    description: 'That is too low for me, counteroffer',
    color: 'from-orange-400 to-orange-600',
    icon: '👎'
  },
  { 
    value: 'accept', 
    label: 'Accept', 
    description: 'The offer is accepted, end of game',
    color: 'from-green-400 to-green-600',
    icon: '✅'
  },
  { 
    value: 'better_offer', 
    label: 'Better Offer', 
    description: 'I have a better offer outside the negotiation',
    color: 'from-blue-400 to-blue-600',
    icon: '💼'
  },
  { 
    value: 'not_accept', 
    label: 'Not Accept', 
    description: 'Negotiation is terminated, end of game',
    color: 'from-red-400 to-red-600',
    icon: '❌'
  },
];

const NegotiationScreen = () => {
  const navigate = useNavigate();
  const {
    socket,
    playerId,
    role,
    pairId,
    batna,
    currentTurn,
    setCurrentTurn,
    currentRound,
    setCurrentRound,
    rounds,
    setRounds,
    setGameResult,
    setGameStatus
  } = useGame();

  const [offerA, setOfferA] = useState(500);
  const [offerB, setOfferB] = useState(500);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [pendingOffer, setPendingOffer] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const isMyTurn = role === currentTurn;
  const maxRounds = 10;

  useEffect(() => {
    if (!socket || !playerId || !role || !pairId) {
      navigate('/select-group');
      return;
    }

    // Listen for offer received (when opponent makes offer)
    socket.on('offer_received', (data) => {
      console.log('Offer received:', data);
      setPendingOffer(data);
      setShowResponseModal(true);
      toast.info(`Person ${data.proposer} made an offer!`);
    });

    // Listen for offer sent confirmation
    socket.on('offer_sent', (data) => {
      console.log('Offer sent:', data);
      setIsWaitingResponse(true);
      toast.success('Offer sent! Waiting for response...');
    });

    // Listen for turn updates
    socket.on('turn_updated', (data) => {
      console.log('Turn updated:', data);
      setCurrentTurn(data.currentTurn);
      setCurrentRound(data.currentRound);
      
      // Add to rounds history
      setRounds((prev) => [
        ...prev,
        {
          round: data.currentRound - 1,
          proposer: data.currentTurn === 'A' ? 'B' : 'A',
          offerA: data.lastOffer.offerA,
          offerB: data.lastOffer.offerB,
          response: data.lastResponse
        }
      ]);

      setIsWaitingResponse(false);
      setShowResponseModal(false);
      setPendingOffer(null);

      if (data.currentTurn === role) {
        toast.info("It's your turn now!");
      }
    });

    // Listen for game ended
    socket.on('game_ended', (data) => {
      console.log('Game ended:', data);
      
      // Add final round
      if (data.rounds && data.rounds.length > 0) {
        setRounds(data.rounds);
      }
      
      setGameResult(data);
      setGameStatus('completed');
      
      // Navigate to result screen
      setTimeout(() => {
        navigate('/result');
      }, 1500);
    });

    // Listen for opponent disconnected
    socket.on('opponent_disconnected', (data) => {
      toast.error(data.message);
      setTimeout(() => {
        navigate('/select-group');
      }, 3000);
    });

    return () => {
      socket.off('offer_received');
      socket.off('offer_sent');
      socket.off('turn_updated');
      socket.off('game_ended');
      socket.off('opponent_disconnected');
    };
  }, [socket, playerId, role, pairId, navigate]);

  const handleOfferChange = (isPersonA, value) => {
    const numValue = parseInt(value) || 0;
    if (isPersonA) {
      setOfferA(numValue);
      setOfferB(1000 - numValue);
    } else {
      setOfferB(numValue);
      setOfferA(1000 - numValue);
    }
  };

  const handleSubmitOffer = () => {
    if (offerA + offerB !== 1000) {
      toast.error('Offers must sum to €1,000');
      return;
    }

    if (offerA < 0 || offerB < 0) {
      toast.error('Offers cannot be negative');
      return;
    }

    // Emit offer via socket
    socket.emit('submit_offer', {
      pairId,
      playerId,
      offerA,
      offerB
    });
  };

  const handleSubmitResponse = (responseValue) => {
    if (!pendingOffer) return;

    // Emit response via socket
    socket.emit('submit_response', {
      pairId,
      playerId,
      response: responseValue,
      offerA: pendingOffer.offerA,
      offerB: pendingOffer.offerB
    });

    setShowResponseModal(false);
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Negotiation in Progress
          </h1>
          <p className="text-gray-600">Pair ID: {pairId}</p>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Your Role</p>
              <p className="text-2xl font-bold text-blue-600">Person {role}</p>
              <p className="text-xs text-gray-500 mt-1">Alternative: €{batna}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Round</p>
              <p className="text-2xl font-bold text-purple-600">{currentRound} / {maxRounds}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentRound / maxRounds) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Turn</p>
              <p className="text-2xl font-bold text-green-600">Person {currentTurn}</p>
              {isMyTurn ? (
                <motion.p
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-xs text-green-600 font-semibold mt-1"
                >
                  YOUR TURN
                </motion.p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Waiting...</p>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Offer Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isMyTurn ? 'Make Your Offer' : 'Waiting for Opponent...'}
              </h2>

              {/* Offer Inputs */}
              <div className="space-y-6 mb-8">
                {/* Person A Offer */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-blue-700 mb-3">
                    Person A receives (€)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={offerA}
                    onChange={(e) => handleOfferChange(true, e.target.value)}
                    disabled={!isMyTurn || isWaitingResponse}
                    className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <input
                      type="number"
                      value={offerA}
                      onChange={(e) => handleOfferChange(true, e.target.value)}
                      disabled={!isMyTurn || isWaitingResponse}
                      className="w-32 px-4 py-2 border-2 border-blue-300 rounded-lg text-xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-3xl font-bold text-blue-600">€{offerA}</span>
                  </div>
                </div>

                {/* Person B Offer */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-purple-700 mb-3">
                    Person B receives (€)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={offerB}
                    onChange={(e) => handleOfferChange(false, e.target.value)}
                    disabled={!isMyTurn || isWaitingResponse}
                    className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <input
                      type="number"
                      value={offerB}
                      onChange={(e) => handleOfferChange(false, e.target.value)}
                      disabled={!isMyTurn || isWaitingResponse}
                      className="w-32 px-4 py-2 border-2 border-purple-300 rounded-lg text-xl font-bold text-center focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <span className="text-3xl font-bold text-purple-600">€{offerB}</span>
                  </div>
                </div>

                {/* Total */}
                <div className={`text-center p-4 rounded-xl ${offerA + offerB === 1000 ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className={`text-3xl font-bold ${offerA + offerB === 1000 ? 'text-green-600' : 'text-red-600'}`}>
                    €{offerA + offerB}
                  </p>
                  {offerA + offerB !== 1000 && (
                    <p className="text-xs text-red-600 mt-1">Must equal €1,000</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              {isMyTurn && !isWaitingResponse && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitOffer}
                  disabled={offerA + offerB !== 1000}
                  className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Offer
                </motion.button>
              )}

              {isWaitingResponse && (
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-gray-600">Waiting for opponent's response...</p>
                </div>
              )}

              {!isMyTurn && !showResponseModal && (
                <div className="text-center text-gray-500">
                  <div className="text-5xl mb-3">⏳</div>
                  <p>Waiting for Person {currentTurn} to make an offer...</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: History */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-effect rounded-2xl p-6 sticky top-4"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📜</span>
                Negotiation History
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rounds.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No rounds yet
                  </p>
                ) : (
                  rounds.map((round, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/70 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-500">Round {round.roundNumber || round.round}</span>
                        <span className="text-xs font-semibold text-blue-600">Person {round.proposer}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>A: <span className="font-bold">€{round.offerA}</span></p>
                        <p>B: <span className="font-bold">€{round.offerB}</span></p>
                        <p className="text-xs text-gray-600 mt-2">
                          Response: <span className="font-semibold">{formatResponse(round.response)}</span>
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {showResponseModal && pendingOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowResponseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Offer Received!
              </h2>

              {/* Offer Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Person {pendingOffer.proposer} proposes:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Person A</p>
                    <p className="text-3xl font-bold text-blue-600">€{pendingOffer.offerA}</p>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Person B</p>
                    <p className="text-3xl font-bold text-purple-600">€{pendingOffer.offerB}</p>
                  </div>
                </div>
              </div>

              {/* Response Options */}
              <p className="text-center text-gray-600 mb-4 font-semibold">Choose your response:</p>
              <div className="grid grid-cols-2 gap-4">
                {responseOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubmitResponse(option.value)}
                    className={`bg-gradient-to-r ${option.color} text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div className="text-lg mb-1">{option.label}</div>
                    <div className="text-xs opacity-90">{option.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function formatResponse(response) {
  const map = {
    'too_low': 'Too Low',
    'accept': 'Accept',
    'better_offer': 'Better Offer',
    'not_accept': 'Not Accept'
  };
  return map[response] || response;
}

export default NegotiationScreen;
