import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IntroScreen from './pages/IntroScreen';
import GroupSelection from './pages/GroupSelection';
import WaitingRoom from './pages/WaitingRoom';
import NegotiationScreen from './pages/NegotiationScreen';
import ResultScreen from './pages/ResultScreen';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<IntroScreen />} />
            <Route path="/select-group" element={<GroupSelection />} />
            <Route path="/waiting" element={<WaitingRoom />} />
            <Route path="/negotiate" element={<NegotiationScreen />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
