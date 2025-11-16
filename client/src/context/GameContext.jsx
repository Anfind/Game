import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [role, setRole] = useState(null);
  const [pairId, setPairId] = useState(null);
  const [groupNumber, setGroupNumber] = useState(null);
  const [batna, setBatna] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, waiting, active, completed, failed
  const [rounds, setRounds] = useState([]);
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const serverUrl = import.meta.env.VITE_API_URL || '';
    const socketOptions = {
      transports: ['websocket'],
      reconnection: true
    };
    const newSocket = serverUrl ? io(serverUrl, socketOptions) : io(socketOptions);

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      toast.error('Disconnected from server');
    });

    newSocket.on('error', (data) => {
      toast.error(data.message || 'An error occurred');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    socket,
    playerId,
    setPlayerId,
    role,
    setRole,
    pairId,
    setPairId,
    groupNumber,
    setGroupNumber,
    batna,
    setBatna,
    currentTurn,
    setCurrentTurn,
    currentRound,
    setCurrentRound,
    gameStatus,
    setGameStatus,
    rounds,
    setRounds,
    gameResult,
    setGameResult
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
