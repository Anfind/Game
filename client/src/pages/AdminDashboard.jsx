import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDetail, setShowGameDetail] = useState(false);
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    failedGames: 0,
    totalPlayers: 0,
    activePlayers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Check admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin');
      return;
    }
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const baseURL = API_BASE ? `${API_BASE.replace(/\/+$/, '')}/api/admin` : '/api/admin';
      
      const [gamesRes, playersRes, statsRes] = await Promise.all([
        axios.get(`${baseURL}/games`),
        axios.get(`${baseURL}/players`),
        axios.get(`${baseURL}/stats`)
      ]);

      setGames(gamesRes.data.games || []);
      setPlayers(playersRes.data.players || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const fetchGameDetail = async (pairId) => {
    try {
      console.log('Fetching game detail for pairId:', pairId);
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const baseURL = API_BASE ? `${API_BASE.replace(/\/+$/, '')}/api/admin` : '/api/admin';
      const url = `${baseURL}/games/${pairId}`;
      console.log('API URL:', url);
      
      const response = await axios.get(url);
      console.log('Game detail response:', response.data);
      setSelectedGame(response.data);
      setShowGameDetail(true);
    } catch (error) {
      console.error('Error fetching game detail:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to load game details');
    }
  };

  const deleteGame = async (pairId) => {
    if (!confirm('Are you sure you want to delete this game?')) return;
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const baseURL = API_BASE ? `${API_BASE.replace(/\/+$/, '')}/api/admin` : '/api/admin';
      
      await axios.delete(`${baseURL}/games/${pairId}`);
      toast.success('Game deleted successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">⚡ Admin Dashboard</h1>
              <p className="text-gray-600">Bicycle Negotiation Game Management</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAdminData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                ↻ Refresh
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                ← Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
            <div className="text-sm text-gray-600">Total Games</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completedGames}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-red-600">{stats.failedGames}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPlayers}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.activePlayers}</div>
            <div className="text-sm text-gray-600">Active Players</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', count: games.length },
                { id: 'games', name: 'Games', count: games.length },
                { id: 'players', name: 'Players', count: players.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
                
                {/* Recent Games */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Games</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {games.slice(0, 5).map((game) => (
                      <div key={game.pairId} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                        <div>
                          <span className="font-medium">{game.pairId}</span>
                          <span className="ml-2 text-sm text-gray-600">Group {game.groupNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            game.status === 'completed' ? 'bg-green-100 text-green-800' :
                            game.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {game.status}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(game.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Group Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Group Distribution</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((group) => {
                      const groupGames = games.filter(g => g.groupNumber === group);
                      return (
                        <div key={group} className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xl font-bold text-blue-600">{groupGames.length}</div>
                          <div className="text-sm text-gray-600">Group {group} Games</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Games Tab */}
            {activeTab === 'games' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Games</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rounds</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {games.map((game) => (
                        <tr key={game.pairId} className="hover:bg-gray-50">
                          <td 
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                            onClick={() => fetchGameDetail(game.pairId)}
                          >
                            {game.pairId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.groupNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              game.status === 'completed' ? 'bg-green-100 text-green-800' :
                              game.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {game.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{game.rounds?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {game.result ? (
                              <span>A: €{game.result.payoutA || 0}, B: €{game.result.payoutB || 0}</span>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(game.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteGame(game.pairId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Players Tab */}
            {activeTab === 'players' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Players</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {players.map((player) => (
                        <tr key={player.playerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.playerId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.groupNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.role || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.pairId || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              player.isWaiting ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {player.isWaiting ? 'Waiting' : 'Paired'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(player.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Game Detail Modal */}
      {showGameDetail && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Game Details: {selectedGame.game.pairId}</h2>
              <button
                onClick={() => setShowGameDetail(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                × Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Game Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Game Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Pair ID:</span>
                    <span className="ml-2 text-gray-800">{selectedGame.game.pairId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Group:</span>
                    <span className="ml-2 text-gray-800">{selectedGame.game.groupNumber}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                      selectedGame.game.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedGame.game.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedGame.game.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Current Round:</span>
                    <span className="ml-2 text-gray-800">{selectedGame.game.currentRound}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Current Turn:</span>
                    <span className="ml-2 text-gray-800">Person {selectedGame.game.currentTurn}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-800">{formatDate(selectedGame.game.createdAt)}</span>
                  </div>
                  {selectedGame.game.completedAt && (
                    <div>
                      <span className="font-medium text-gray-600">Completed:</span>
                      <span className="ml-2 text-gray-800">{formatDate(selectedGame.game.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Players Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Players Information</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-blue-600 mb-2">Person A</h4>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium text-gray-600">Player ID:</span>
                        <span className="ml-2 text-gray-800">{selectedGame.game.playerA.playerId}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">BATNA:</span>
                        <span className="ml-2 text-gray-800">€{selectedGame.game.playerA.batna}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-bold text-purple-600 mb-2">Person B</h4>
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium text-gray-600">Player ID:</span>
                        <span className="ml-2 text-gray-800">{selectedGame.game.playerB.playerId}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">BATNA:</span>
                        <span className="ml-2 text-gray-800">€{selectedGame.game.playerB.batna}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Info */}
              {selectedGame.game.result && (
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Game Result</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                        selectedGame.game.result.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedGame.game.result.type}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Person A Payout:</span>
                      <span className="ml-2 text-gray-800">€{selectedGame.game.result.payoutA || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Person B Payout:</span>
                      <span className="ml-2 text-gray-800">€{selectedGame.game.result.payoutB || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Reason:</span>
                      <span className="ml-2 text-gray-800">{selectedGame.game.result.reason}</span>
                    </div>
                    {selectedGame.game.result.finalOfferA !== undefined && (
                      <>
                        <div>
                          <span className="font-medium text-gray-600">Final Offer A:</span>
                          <span className="ml-2 text-gray-800">€{selectedGame.game.result.finalOfferA}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Final Offer B:</span>
                          <span className="ml-2 text-gray-800">€{selectedGame.game.result.finalOfferB}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Rounds History */}
              <div className="bg-green-50 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Negotiation History ({selectedGame.game.rounds?.length || 0} rounds)</h3>
                {selectedGame.game.rounds && selectedGame.game.rounds.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Round</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proposer</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer A</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer B</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedGame.game.rounds.map((round, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{round.roundNumber}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Person {round.proposer}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">€{round.offerA}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-bold">€{round.offerB}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                round.response === 'accept' ? 'bg-green-100 text-green-800' :
                                round.response === 'not_accept' ? 'bg-red-100 text-red-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {round.response.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {round.timestamp ? formatDate(round.timestamp) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No rounds played yet</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;