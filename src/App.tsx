import React, { useState, useEffect } from 'react';
import { HostView } from './components/HostView';
import { StudentView } from './components/StudentView';
import { useQuizSocket } from './hooks/useQuizSocket';
import {
  Monitor,
  Columns2,
  Wifi,
  WifiOff,
  Languages
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<'host' | 'student' | 'split'>('host');
  const [isStudentOnly, setIsStudentOnly] = useState<boolean>(false);
  const [isMarathi, setIsMarathi] = useState(true);
  const [playerId, setPlayerId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('quiz_player_id');
    }
    return null;
  });
  const [pinFromUrl, setPinFromUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('pin') || sessionStorage.getItem('quiz_player_pin') || '';
    }
    return '';
  });

  // Check URL parameters at startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      const urlPin = params.get('pin');

      if (urlPin) {
        setPinFromUrl(urlPin);
        sessionStorage.setItem('quiz_player_pin', urlPin);
      }

      if (urlRole === 'player' || urlRole === 'student') {
        setRole('student');
        setIsStudentOnly(true);
      }
    }
  }, []);

  const { gameState, isConnected, lastError, sendMessage } = useQuizSocket({
    pin: pinFromUrl || undefined,
    role: (role === 'student' || isStudentOnly) ? 'player' : 'host',
    playerId: playerId || undefined,
    onJoined: (payload) => {
      setPlayerId(payload.playerId);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quiz_player_id', payload.playerId);
        if (payload.pin) {
          sessionStorage.setItem('quiz_player_pin', payload.pin);
          setPinFromUrl(payload.pin);
        }
      }
    }
  });

  const openStudentTab = () => {
    if (typeof window !== 'undefined' && gameState?.pin) {
      window.open(`/?pin=${gameState.pin}&role=player`, '_blank');
    }
  };

  const isCurrentStudent = role === 'student' || isStudentOnly;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 
        STUDENT VIEW: Clean, distraction-free top bar. 
        STUDENTS CANNOT ACCESS OR SEE TEACHER SCREEN!
      */}
      {isCurrentStudent ? (
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'थेट जोडले आहे' : 'Connected'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'पुनर्जोडणी होत आहे...' : 'Reconnecting...'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMarathi(!isMarathi)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isMarathi ? 'EN' : 'मराठी'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* 
          HOST VIEW: Teacher controls bar (Host View vs Split View for testing).
          Only rendered on host display.
        */
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isMarathi ? 'थेट सर्व्हर जोडले आहे' : 'Server Connected'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'पुनर्जोडणी करत आहे...' : 'Reconnecting...'}</span>
              </span>
            )}
            {lastError && (
              <span className="text-rose-400 font-medium px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                {lastError}
              </span>
            )}
          </div>

          {/* Teacher screen mode switcher: Only Host and Split */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setRole('host')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                role === 'host'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'शिक्षक स्क्रीन' : 'Host Display'}</span>
            </button>

            <button
              onClick={() => setRole('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                role === 'split'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isMarathi ? 'चाचणीसाठी दोन्ही स्क्रीन एकत्र पहा' : 'View Host and Student together for testing'}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'चाचणी दृश्य (Dual View)' : 'Dual View'}</span>
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setIsMarathi(!isMarathi)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer"
          >
            {isMarathi ? 'EN' : 'मराठी'}
          </button>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col">
        {isCurrentStudent ? (
          <StudentView
            gameState={gameState}
            playerId={playerId}
            setPlayerId={setPlayerId}
            sendMessage={sendMessage}
            isMarathi={isMarathi}
            initialPin={pinFromUrl}
          />
        ) : role === 'host' && gameState ? (
          <HostView
            gameState={gameState}
            sendMessage={sendMessage}
            isMarathi={isMarathi}
            setIsMarathi={setIsMarathi}
            onOpenStudentTab={openStudentTab}
          />
        ) : role === 'split' && gameState ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-slate-950">
            {/* Host Section */}
            <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
              <HostView
                gameState={gameState}
                sendMessage={sendMessage}
                isMarathi={isMarathi}
                setIsMarathi={setIsMarathi}
                onOpenStudentTab={openStudentTab}
              />
            </div>

            {/* Simulated Mobile Student Screen for Teacher Testing */}
            <div className="lg:col-span-4 bg-slate-900/50 flex flex-col p-4 justify-center items-center overflow-y-auto">
              <div className="w-full max-w-sm rounded-3xl border-4 border-slate-700 bg-slate-950 shadow-2xl overflow-hidden min-h-[620px] flex flex-col">
                <div className="bg-slate-800 px-4 py-1.5 flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-700">
                  <span>📱 {isMarathi ? 'विद्यार्थी मोबाईल चाचणी' : 'Student Mobile Preview'}</span>
                  <span>९:४१ AM</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <StudentView
                    gameState={gameState}
                    playerId={playerId}
                    setPlayerId={setPlayerId}
                    sendMessage={sendMessage}
                    isMarathi={isMarathi}
                    initialPin={gameState.pin}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!gameState && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">
              {isMarathi ? 'खेळ लोड होत आहे...' : 'Loading quiz battle...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
