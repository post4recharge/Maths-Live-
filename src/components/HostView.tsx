import React, { useEffect, useState } from 'react';
import { GameRoomState, QuizQuestion, ClientMessage } from '../types/quiz';
import { QRCodeDisplay } from './QRCodeDisplay';
import { QuestionModal } from './QuestionModal';
import { sound } from '../utils/soundEffects';
import { fireConfetti, firePodiumCelebration } from '../utils/confetti';
import { ANSWER_COLORS, QUIZ_TOPICS, getTopicById } from '../data/defaultQuestions';
import { DigitalFractionScaleModal } from './DigitalFractionScaleModal';
import {
  Trophy,
  Users,
  Play,
  Volume2,
  VolumeX,
  BookOpen,
  UserPlus,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Check,
  X,
  Copy,
  ExternalLink,
  Crown,
  Medal,
  Clock,
  FastForward,
  Printer,
  Award,
  Scale,
  Image as ImageIcon
} from 'lucide-react';

interface HostViewProps {
  gameState: GameRoomState;
  sendMessage: (msg: ClientMessage) => void;
  isMarathi: boolean;
  setIsMarathi: (val: boolean) => void;
  onOpenStudentTab: () => void;
}

export const HostView: React.FC<HostViewProps> = ({
  gameState,
  sendMessage,
  isMarathi,
  setIsMarathi,
  onOpenStudentTab
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [podiumRevealStep, setPodiumRevealStep] = useState<number>(3); // 0 = suspense, 1 = 3rd, 2 = 2nd, 3 = 1st

  const currentTopicId = gameState.selectedTopic || 'all';
  const activeTopic = QUIZ_TOPICS.find((t) => t.id === currentTopicId) || QUIZ_TOPICS[0];

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?pin=${gameState.pin}&role=player`
    : '';

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const copyJoinLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Sound triggers on phase change & sequential reveal
  useEffect(() => {
    if (gameState.phase === 'STARTING') {
      sound.playCountdownBeep(false);
    } else if (gameState.phase === 'PODIUM') {
      // Step-by-step reveal: 3rd place -> 2nd place -> 1st Champion
      setPodiumRevealStep(0);

      const t1 = setTimeout(() => {
        setPodiumRevealStep(1);
        sound.playStepFanfare(1);
        fireConfetti(35);
      }, 1200);

      const t2 = setTimeout(() => {
        setPodiumRevealStep(2);
        sound.playStepFanfare(2);
        fireConfetti(55);
      }, 3000);

      const t3 = setTimeout(() => {
        setPodiumRevealStep(3);
        sound.playPodiumFanfare();
        firePodiumCelebration();
      }, 5200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (gameState.phase === 'LEADERBOARD') {
      sound.playCountdownBeep(true);
    } else if (gameState.phase === 'REVEAL') {
      sound.playCorrect();
      fireConfetti(60);
    }
  }, [gameState.phase]);

  // Play subtle chime when a new player joins during lobby
  const prevPlayerCountRef = React.useRef(gameState.players.length);
  useEffect(() => {
    if (gameState.phase === 'LOBBY' && gameState.players.length > prevPlayerCountRef.current) {
      sound.playAnswerSubmitted();
    }
    prevPlayerCountRef.current = gameState.players.length;
  }, [gameState.players.length, gameState.phase]);

  // Answered count
  const answeredCount = gameState.players.filter(
    (p) => p.answers[gameState.currentQuestionIndex] !== undefined
  ).length;
  const totalPlayers = gameState.players.length;

  const currentQ = gameState.activeQuestion;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Top Header / Control Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                {isMarathi ? 'थेट प्रश्नमंजुषा स्पर्धा' : 'Live Classroom Quiz Battle'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {isMarathi ? 'शिक्षक स्क्रीन' : 'Host Display'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isMarathi ? 'QR कोड स्कॅन करा किंवा पिन टाका' : 'Scan QR code or use Game PIN to join'}
            </p>
          </div>
        </div>

        {/* Room PIN Pill */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-4 py-1.5 rounded-2xl shadow-inner">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {isMarathi ? 'खेळ पिन:' : 'PIN:'}
          </span>
          <span className="text-xl lg:text-2xl font-black tracking-widest text-amber-400 font-mono">
            {gameState.pin.slice(0, 3)} {gameState.pin.slice(3)}
          </span>
        </div>

        {/* Active Topic Chip in Header */}
        <button
          onClick={() => {
            if (gameState.phase === 'LOBBY') {
              setIsQuestionModalOpen(true);
            }
          }}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition shadow-sm bg-indigo-950/80 border-indigo-500/40 text-indigo-200 ${
            gameState.phase === 'LOBBY' ? 'hover:scale-105 cursor-pointer hover:border-amber-400' : ''
          }`}
          title={isMarathi ? 'सध्या निवडलेला विषय (बदलण्यासाठी क्लिक करा)' : 'Current Topic (Click to change in lobby)'}
        >
          <span className="text-base drop-shadow">{activeTopic.icon}</span>
          <span className="text-slate-400 font-normal">
            {isMarathi ? 'विषय:' : 'Topic:'}
          </span>
          <span className="text-amber-300 font-extrabold truncate max-w-[130px]">
            {isMarathi ? activeTopic.nameMr.split(' ')[0] : activeTopic.nameEn.split(' ')[0]}
          </span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[10px] text-amber-400 font-mono font-black border border-slate-700">
            {gameState.totalQuestions}Q
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Timer Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/80 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 font-semibold mr-1">{isMarathi ? 'वेळ:' : 'Timer:'}</span>
            {[10, 15, 20, 30].map((sec) => (
              <button
                key={sec}
                onClick={() => sendMessage({ type: 'HOST_SET_DEFAULT_TIMER', payload: { seconds: sec } })}
                className={`px-1.5 py-0.5 rounded-lg font-mono text-[11px] font-bold transition cursor-pointer ${
                  (gameState.defaultTimeLimit || 20) === sec
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Auto-Advance Toggle in Header */}
          <button
            onClick={() => sendMessage({ type: 'HOST_TOGGLE_AUTO_ADVANCE' })}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition cursor-pointer ${
              gameState.autoAdvance
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={isMarathi ? 'उत्तर दिल्यानंतर लगेच पुढील प्रश्न आपोआप येणे' : 'Auto advance to next question'}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{isMarathi ? 'ऑटो' : 'Auto'}: {gameState.autoAdvance ? (isMarathi ? 'चालू' : 'ON') : (isMarathi ? 'बंद' : 'OFF')}</span>
          </button>

          {/* Quick student test helper */}
          <button
            onClick={onOpenStudentTab}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition"
            title={isMarathi ? 'विद्यार्थी स्क्रीन उघडा' : 'Open Student Tab'}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isMarathi ? 'विद्यार्थी टॅब' : 'Student Tab'}</span>
          </button>

          {/* Add test bot student */}
          {gameState.phase === 'LOBBY' && (
            <button
              onClick={() => sendMessage({ type: 'HOST_ADD_BOT' })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition"
              title={isMarathi ? 'नमुना विद्यार्थी जोडा' : 'Add Test Player'}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isMarathi ? '+ विद्यार्थी' : '+ Test Player'}</span>
            </button>
          )}

          {/* Digital Scale Lab Header Button */}
          <button
            onClick={() => setIsScaleModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            title={isMarathi ? 'डिजिटल तराजू व अपूर्णांक प्रयोगशाळा' : 'Digital Scale & Fractions Lab'}
          >
            <Scale className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">{isMarathi ? '⚖️ तराजू' : '⚖️ Scale'}</span>
          </button>

          {/* Manage Questions */}
          {gameState.phase === 'LOBBY' && (
            <button
              onClick={() => setIsQuestionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{isMarathi ? 'प्रश्न सूची' : 'Questions'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setIsMarathi(!isMarathi)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            {isMarathi ? 'English' : 'मराठी'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}
            title={isMuted ? 'ध्वनी सुरू करा (Unmute)' : 'ध्वनी बंद करा (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Dynamic Stage */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* PHASE 1: LOBBY */}
        {gameState.phase === 'LOBBY' && (
          <div className="flex-1 flex flex-col items-center justify-between gap-6 py-2 w-full">
            {/* Top Prompt Banner */}
            <div className="text-center space-y-2 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {isMarathi ? 'थेट प्रश्नमंजुषा स्पर्धा • विद्यार्थी प्रवेश सुरू आहे' : 'Live Classroom Quiz Battle • Waiting for Players'}
              </span>
              <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight">
                {isMarathi
                  ? 'खेळामध्ये सामील होण्यासाठी QR कोड स्कॅन करा!'
                  : 'Scan the QR Code to Join the Quiz Battle!'}
              </h2>
            </div>

            {/* TEACHER TOPIC SELECTION BAR (शिक्षकांसाठी टॉपिक नुसार खेळ सुरू करण्याची सेटिंग) */}
            <div className="w-full max-w-6xl bg-gradient-to-r from-slate-900/95 via-indigo-950/40 to-slate-900/95 border-2 border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                      <span>{isMarathi ? 'शिक्षकांसाठी सेटिंग: खेळाचा विषय (Topic) निवडा' : 'Teacher Setting: Select Quiz Topic'}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold flex items-center gap-1 shadow-sm">
                        <span>{activeTopic.icon}</span>
                        <span>{isMarathi ? activeTopic.nameMr : activeTopic.nameEn}</span>
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isMarathi
                        ? 'खालीलपैकी कोणत्याही विषयावर क्लिक करा; त्यानुसार लगेच प्रश्न बदलतील आणि विद्यार्थ्यांच्या स्क्रीनवर हाच विषय दिसेल.'
                        : 'Click any topic below to switch immediately; questions and student screens will update automatically.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    📖 {isMarathi ? `या विषयात ${gameState.totalQuestions} प्रश्न` : `${gameState.totalQuestions} Questions`}
                  </span>
                  
                  {/* Digital Balance Scale & Fraction Lab Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsScaleModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-lg shadow-rose-500/20 active:scale-95 animate-pulse-subtle"
                    title={isMarathi ? 'डिजिटल तराजू व अपूर्णांक प्रयोगशाळा उघडा' : 'Open Digital Scale & Fractions Lab'}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isMarathi ? '⚖️ डिजिटल तराजू' : '⚖️ Digital Scale'}</span>
                  </button>

                  <button
                    onClick={() => setIsQuestionModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isMarathi ? 'प्रश्न सूची' : 'Questions'}</span>
                  </button>
                </div>
              </div>

              {/* 9 Topic Selection Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                {QUIZ_TOPICS.map((topic) => {
                  const isSelected = (gameState.selectedTopic || 'all') === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        sound.playTick();
                        sendMessage({ type: 'HOST_SET_TOPIC', payload: { topicId: topic.id } });
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer text-center relative group ${
                        isSelected
                          ? 'bg-gradient-to-b from-indigo-900/90 via-slate-900 to-indigo-950 border-amber-400 shadow-xl shadow-indigo-500/30 ring-2 ring-amber-400/50 scale-[1.04]'
                          : 'bg-slate-950/70 border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-900/90 text-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-2 right-2 bg-amber-400 text-slate-950 rounded-full p-0.5 text-[10px] font-black shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">
                        {topic.icon}
                      </span>
                      <span className={`text-xs sm:text-sm font-black leading-tight truncate w-full ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {isMarathi ? topic.nameMr.split(' ')[0] : topic.nameEn.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {isMarathi ? topic.nameMr.split(' ').slice(1).join(' ') || topic.nameMr : topic.nameEn.split(' ').slice(1).join(' ') || topic.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Stage: QR Code on Left & Joined Students in BIG FONT directly on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl items-stretch">
              {/* Left Column: QR Code & Connection Hub */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 bg-slate-900/80 border-2 border-indigo-500/30 rounded-3xl shadow-2xl backdrop-blur-xl text-center space-y-4">
                {/* QR Code */}
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-3xl shadow-xl ring-4 ring-indigo-500/20">
                    <QRCodeDisplay value={joinUrl} size={210} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyJoinLink}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{copiedLink ? (isMarathi ? 'लिंक कॉपी केली! ✓' : 'Copied! ✓') : (isMarathi ? 'लिंक कॉपी करा' : 'Copy Join Link')}</span>
                    </button>
                  </div>
                </div>

                {/* Big Game PIN */}
                <div className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isMarathi ? 'खेळ पिन (Game PIN):' : 'Game PIN:'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-amber-400">
                    {gameState.pin}
                  </span>
                </div>

                {/* Instructions */}
                <div className="w-full p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-left space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-[10px]">१</span>
                    {isMarathi ? 'मोबाईल कॅमेऱ्याने QR कोड स्कॅन करा' : 'Open phone camera & scan QR'}
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">२</span>
                    {isMarathi ? 'नाव टाका आणि थेट सामील व्हा' : 'Enter name & join instantly'}
                  </p>
                </div>

                {/* Teacher Timer Settings */}
                <div className="w-full p-3 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {isMarathi ? 'वेळ मर्यादा:' : 'Time Limit:'}
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {gameState.defaultTimeLimit || 20}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {[10, 15, 20, 30, 45, 60].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => sendMessage({ type: 'HOST_SET_DEFAULT_TIMER', payload: { seconds: sec } })}
                        className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black transition cursor-pointer ${
                          (gameState.defaultTimeLimit || 20) === sec
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Joined Students in LARGE FONT right beside the QR Code */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 lg:p-7 bg-slate-900/80 border-2 border-indigo-500/40 rounded-3xl shadow-2xl backdrop-blur-xl min-h-[480px]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl sm:text-2xl tracking-tight">
                        {isMarathi ? 'सामील झालेले विद्यार्थी' : 'Joined Students'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isMarathi ? 'QR कोड स्कॅन करून थेट जोडलेले विद्यार्थी' : 'Real-time live student lobby'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm sm:text-base">
                      👥 {totalPlayers} {isMarathi ? 'विद्यार्थी' : 'Players'}
                    </span>
                    <button
                      onClick={() => sendMessage({ type: 'HOST_ADD_BOT' })}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 transition cursor-pointer"
                    >
                      {isMarathi ? '+ नमुना' : '+ Demo'}
                    </button>
                  </div>
                </div>

                {/* Student Display Container in BIG FONT */}
                <div className="flex-1 overflow-y-auto max-h-[380px] pr-1">
                  {totalPlayers === 0 ? (
                    <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center space-y-3 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl animate-bounce">
                        📱
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white">
                        {isMarathi ? 'अद्याप कोणीही सामील झाले नाही' : 'Waiting for Students to Join...'}
                      </h4>
                      <p className="text-sm sm:text-base text-indigo-300 font-bold max-w-sm">
                        {isMarathi
                          ? 'शेजारील QR कोड स्कॅन करताच विद्यार्थ्यांची नावे इथे मोठ्या ठळक अक्षरांत दिसतील!'
                          : 'As soon as students scan the QR code beside, their names will appear here in large bold font!'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {gameState.players.map((p) => (
                        <div
                          key={p.id}
                          className="group relative flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 hover:from-slate-900 hover:to-indigo-900/40 border-2 border-indigo-500/40 hover:border-indigo-400 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="text-3xl sm:text-4xl shrink-0 drop-shadow">
                              {p.avatar}
                            </span>
                            <div className="min-w-0">
                              <span className="font-black text-xl sm:text-2xl text-white block tracking-wide truncate drop-shadow">
                                {p.name}
                              </span>
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {p.id.startsWith('bot-')
                                  ? (isMarathi ? 'नमुना विद्यार्थी' : 'Demo')
                                  : (isMarathi ? 'सज्ज!' : 'Ready!')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => sendMessage({ type: 'HOST_KICK_PLAYER', payload: { playerId: p.id } })}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition shrink-0 cursor-pointer"
                            title={isMarathi ? 'विद्यार्थी काढा' : 'Remove Player'}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto-Advance Pill in Lobby */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-4">
                  <span className="flex items-center gap-1.5">
                    <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                    {isMarathi ? 'स्वयंचलित पुढील प्रश्न:' : 'Auto-advance:'}
                    <strong className="text-emerald-400">{gameState.autoAdvance ? (isMarathi ? 'चालू' : 'ON') : (isMarathi ? 'बंद' : 'OFF')}</strong>
                  </span>
                  <span>
                    📖 {isMarathi ? `एकूण ${gameState.totalQuestions} प्रश्न` : `${gameState.totalQuestions} Questions`}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Quiz & Question/Image Management Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={() => sendMessage({ type: 'HOST_START_COUNTDOWN' })}
                disabled={totalPlayers === 0}
                className={`flex items-center gap-3 px-10 py-4 sm:py-4.5 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-2xl transform ${
                  totalPlayers > 0
                    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white hover:scale-105 shadow-indigo-500/40 cursor-pointer animate-pulse-subtle ring-4 ring-indigo-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Play className="w-7 h-7 fill-current" />
                <span>
                  {isMarathi ? 'खेळ सुरू करा! (Start Quiz)' : 'Start Quiz Battle!'}
                </span>
              </button>

              <button
                onClick={() => setIsQuestionModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-base bg-slate-900/90 hover:bg-slate-800 text-indigo-300 hover:text-white border-2 border-indigo-500/40 hover:border-indigo-400 shadow-xl transition cursor-pointer"
                title={isMarathi ? 'प्रश्नांमध्ये व पर्यायांमध्ये चित्रे जोडा किंवा बदला' : 'Manage questions and add images'}
              >
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <span>
                  {isMarathi ? 'प्रश्न व पर्याय चित्रे (Add Images)' : 'Questions & Images'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 2: STARTING 3..2..1 COUNTDOWN */}
        {gameState.phase === 'STARTING' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <span className="text-lg font-bold text-indigo-400 tracking-wider uppercase">
              {isMarathi ? 'सज्ज व्हा! खेळ सुरू होत आहे...' : 'Get Ready! Starting in...'}
            </span>
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/40 ring-8 ring-rose-500/20 animate-bounce">
              <span className="text-7xl font-black text-white font-mono">३</span>
            </div>
            <p className="text-slate-400 text-sm">
              {isMarathi ? 'सर्वप्रथम प्रश्न व ४ पर्याय स्क्रीनवर दिसतील' : 'Questions and 4 options will appear shortly'}
            </p>
          </div>
        )}

        {/* PHASE 3: QUESTION DISPLAY */}
        {gameState.phase === 'QUESTION' && currentQ && (
          <div className="flex-1 flex flex-col justify-between gap-6 py-2 max-w-5xl mx-auto w-full">
            {/* Question Progress & Timer Row */}
            <div className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold text-sm border border-indigo-500/30">
                  {isMarathi ? `प्रश्न ${currentQ.index + 1} / ${gameState.totalQuestions}` : `Question ${currentQ.index + 1} / ${gameState.totalQuestions}`}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <span>{activeTopic.icon}</span>
                  <span>{isMarathi ? activeTopic.nameMr : activeTopic.nameEn}</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  {isMarathi ? currentQ.categoryMr : currentQ.categoryEn}
                </span>
              </div>

              {/* Authoritative Live Countdown Timer */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-2xl font-black border-2 transition-all ${
                    gameState.timeLeft <= 5
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 scale-110 shadow-lg shadow-rose-500/30 animate-pulse'
                      : gameState.timeLeft <= 10
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                  }`}
                >
                  {gameState.timeLeft}
                </div>
              </div>

              {/* Answer submission progress */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">
                    {isMarathi ? 'उत्तरे नोंदवली:' : 'Responses:'}
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {answeredCount} / {totalPlayers}
                  </div>
                </div>
                <button
                  onClick={() => sendMessage({ type: 'HOST_REVEAL_ANSWER' })}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
                  title={isMarathi ? 'वेळ पूर्ण न होता निकाल जाहीर करा' : 'Skip timer and reveal'}
                >
                  {isMarathi ? 'निकाल दाखवा' : 'Reveal Now'}
                </button>
              </div>
            </div>

            {/* Question Text Box with Optional Image */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 text-center shadow-xl backdrop-blur-md space-y-4">
              {currentQ.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={currentQ.imageUrl}
                    alt="Question Visual"
                    className="max-h-60 sm:max-h-72 w-auto object-contain rounded-2xl border-2 border-indigo-500/30 shadow-2xl bg-slate-950"
                  />
                </div>
              )}
              <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight">
                {currentQ.questionMr}
              </h2>
              {currentQ.questionEn && currentQ.questionEn !== currentQ.questionMr && (
                <p className="text-base text-slate-400 italic">
                  {currentQ.questionEn}
                </p>
              )}
            </div>

            {/* 4 Answer Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.optionsMr.map((optMr, optIdx) => {
                const color = ANSWER_COLORS[optIdx];
                const optImg = currentQ.optionImages ? currentQ.optionImages[optIdx] : undefined;
                return (
                  <div
                    key={optIdx}
                    className={`relative p-4 sm:p-5 lg:p-6 rounded-3xl border-2 ${color.border} ${color.lightBg} flex items-center gap-4 transition shadow-lg`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${color.badge} flex items-center justify-center font-black text-xl shadow-md shrink-0`}>
                      {color.shape}
                    </div>

                    {optImg && (
                      <img
                        src={optImg}
                        alt={`Option ${optIdx + 1}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-2 border-white/20 bg-slate-950 shrink-0 shadow-lg hover:scale-105 transition"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <span className="text-lg lg:text-xl font-bold text-white block">
                        {optMr}
                      </span>
                      {currentQ.optionsEn && currentQ.optionsEn[optIdx] && currentQ.optionsEn[optIdx] !== optMr && (
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {currentQ.optionsEn[optIdx]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 4: REVEAL PHASE */}
        {gameState.phase === 'REVEAL' && currentQ && (
          <div className="flex-1 flex flex-col justify-between gap-6 py-2 max-w-5xl mx-auto w-full">
            {/* Header info */}
            <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-extrabold text-sm border border-indigo-500/30">
                  {isMarathi ? `प्रश्न ${currentQ.index + 1} चा निकाल` : `Question ${currentQ.index + 1} Result`}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                  <span>{activeTopic.icon}</span>
                  <span>{isMarathi ? activeTopic.nameMr : activeTopic.nameEn}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {gameState.autoAdvance && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold animate-pulse">
                    <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isMarathi ? 'आपोआप पुढील टप्प्याकडे जात आहे...' : 'Auto-advancing...'}</span>
                  </div>
                )}
                <button
                  onClick={() => sendMessage({ type: 'HOST_SHOW_LEADERBOARD' })}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:scale-105 cursor-pointer"
                >
                  <span>{isMarathi ? 'लीडरबोर्ड पहा' : 'View Leaderboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text with Optional Image */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
              {currentQ.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={currentQ.imageUrl}
                    alt="Question Visual"
                    className="max-h-48 sm:max-h-56 w-auto object-contain rounded-2xl border-2 border-indigo-500/30 shadow-xl bg-slate-950"
                  />
                </div>
              )}
              <h2 className="text-xl lg:text-3xl font-extrabold text-white">
                {currentQ.questionMr}
              </h2>
              {currentQ.explanationMr && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm max-w-2xl mx-auto">
                  💡 <strong>{isMarathi ? 'स्पष्टीकरण / माहिती:' : 'Fact:'}</strong> {currentQ.explanationMr}
                </div>
              )}
            </div>

            {/* 4 Answers with Answer Distribution Bar & Correct Answer Highlighting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.optionsMr.map((optMr, optIdx) => {
                const color = ANSWER_COLORS[optIdx];
                const isCorrect = optIdx === currentQ.correctIndex;
                const count = gameState.answerCounts ? gameState.answerCounts[optIdx] : 0;
                const pct = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0;

                return (
                  <div
                    key={optIdx}
                    className={`relative p-5 lg:p-6 rounded-3xl border-2 transition overflow-hidden shadow-lg ${
                      isCorrect
                        ? 'border-emerald-400 bg-emerald-950/60 ring-4 ring-emerald-500/30 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/60 opacity-60'
                    }`}
                  >
                    {/* Fill background bar based on count percentage */}
                    <div
                      style={{ width: `${pct}%` }}
                      className={`absolute inset-0 opacity-15 transition-all duration-700 ${
                        isCorrect ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}
                    />

                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                            isCorrect ? 'bg-emerald-500 text-white' : color.badge
                          }`}
                        >
                          {isCorrect ? <Check className="w-6 h-6 stroke-[3]" /> : color.shape}
                        </div>

                        {currentQ.optionImages && currentQ.optionImages[optIdx] && (
                          <img
                            src={currentQ.optionImages[optIdx]}
                            alt={`Option ${optIdx + 1}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-white/20 bg-slate-950 shrink-0 shadow-md"
                          />
                        )}

                        <div className="min-w-0">
                          <span className={`text-lg font-bold block ${isCorrect ? 'text-emerald-300 font-extrabold' : 'text-white'}`}>
                            {optMr}
                          </span>
                          {isCorrect && (
                            <span className="text-xs text-emerald-400 font-bold tracking-wide">
                              ✓ {isMarathi ? 'योग्य पर्याय' : 'Correct Answer'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Vote Count Badge */}
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-white font-mono">
                          {count}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 5: LEADERBOARD PHASE */}
        {gameState.phase === 'LEADERBOARD' && (
          <div className="flex-1 flex flex-col justify-between gap-6 py-2 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-extrabold text-white">
                  {isMarathi ? 'गुणवत्ता यादी (Leaderboard)' : 'Leaderboard'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {gameState.autoAdvance && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold animate-pulse">
                    <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isMarathi ? 'पुढील प्रश्न सुरू होत आहे...' : 'Next question starting...'}</span>
                  </div>
                )}

                {gameState.currentQuestionIndex + 1 < gameState.totalQuestions ? (
                  <button
                    onClick={() => sendMessage({ type: 'HOST_NEXT_QUESTION' })}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:scale-105 cursor-pointer"
                  >
                    <span>{isMarathi ? 'पुढील प्रश्न' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => sendMessage({ type: 'HOST_SHOW_PODIUM' })}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-extrabold rounded-xl shadow-lg shadow-amber-500/30 transition transform hover:scale-105 animate-pulse cursor-pointer"
                  >
                    <span>{isMarathi ? 'अंतिम निकाल (Podium) 🎉' : 'Final Results 🎉'}</span>
                    <Crown className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[60vh] pr-1">
              {gameState.players.slice(0, 10).map((player, rankIdx) => {
                const isTop3 = rankIdx < 3;
                const medalColors = [
                  'border-amber-400 bg-amber-500/10 text-amber-300', // 1st Gold
                  'border-slate-300 bg-slate-400/10 text-slate-200', // 2nd Silver
                  'border-amber-700 bg-amber-800/10 text-amber-500', // 3rd Bronze
                ];

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isTop3
                        ? `${medalColors[rankIdx]} shadow-lg`
                        : 'border-slate-800 bg-slate-900/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center font-black text-sm">
                        {rankIdx === 0 ? '🥇' : rankIdx === 1 ? '🥈' : rankIdx === 2 ? '🥉' : `#${rankIdx + 1}`}
                      </div>
                      <span className="text-2xl">{player.avatar}</span>
                      <div>
                        <span className="font-extrabold text-base lg:text-lg text-white block">
                          {player.name}
                        </span>
                        {player.streak > 1 && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                            <Flame className="w-3.5 h-3.5 fill-amber-400" />
                            {player.streak} {isMarathi ? 'सलग अचूक!' : 'streak!'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl lg:text-2xl font-black font-mono text-white">
                        {player.score.toLocaleString()} <span className="text-xs font-normal text-slate-400">{isMarathi ? 'गुण' : 'pts'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 6: FINAL PODIUM & COMPLETE MERIT LIST */}
        {gameState.phase === 'PODIUM' && (
          <div className="flex-1 flex flex-col items-center py-6 space-y-8 max-w-5xl mx-auto w-full">
            {/* Grand Header with Big Font & Stats */}
            <div className="text-center space-y-3 w-full">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-black tracking-widest uppercase animate-pulse">
                <Trophy className="w-4 h-4 text-amber-400" />
                {isMarathi ? '🏆 अंतिम निकाल व गुणवत्ता यादी' : 'Final Results & Merit List'}
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                {isMarathi ? 'विजेत्यांचे हार्दिक अभिनंदन!' : 'Congratulations Champions!'}
              </h2>
              <p className="text-base sm:text-xl font-bold text-slate-300 max-w-2xl mx-auto">
                {isMarathi
                  ? 'कमी वेळेत अचूक उत्तरे देणाऱ्या गुणवंत विद्यार्थ्यांची क्रमवारी'
                  : 'Highest scorers ranked by accuracy and lightning speed'}
              </p>

              {/* Tournament Summary Stats Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-300 shadow-md">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{isMarathi ? `एकूण स्पर्धक: ${totalPlayers} विद्यार्थी` : `Total Players: ${totalPlayers}`}</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2 text-sm font-bold text-amber-400 shadow-md">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>{isMarathi ? `सर्वोच्च गुण: ${gameState.players[0]?.score?.toLocaleString() || 0} गुण` : `Top Score: ${gameState.players[0]?.score?.toLocaleString() || 0} pts`}</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-300 shadow-md">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <span>{isMarathi ? `एकूण प्रश्न: ${gameState.totalQuestions}` : `Questions: ${gameState.totalQuestions}`}</span>
                </div>
              </div>
            </div>

            {/* Sequential Announcement Banner */}
            {podiumRevealStep < 3 && (
              <div className="w-full max-w-xl py-3 px-6 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border-2 border-amber-500/40 rounded-3xl text-center shadow-2xl animate-pulse">
                <p className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide">
                  {podiumRevealStep === 0 && (isMarathi ? '⏳ विजेत्यांची घोषणा होत आहे...' : 'Announcing winners...')}
                  {podiumRevealStep === 1 && (isMarathi ? '🥉 ३ रा क्रमांक (कांस्य पदक) जाहीर झाला!' : '🥉 3rd Place Bronze Announced!')}
                  {podiumRevealStep === 2 && (isMarathi ? '🥈 २ रा क्रमांक (रौप्य पदक) जाहीर झाला!' : '🥈 2nd Place Silver Announced!')}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
                  {podiumRevealStep < 2
                    ? (isMarathi ? 'पुढील विजेता काही क्षणांत स्क्रीनवर येत आहे...' : 'Next winner coming up...')
                    : (isMarathi ? 'आणि आता... १ ला सुवर्ण विजेता कोण?... 👑' : 'And now... who is the Champion?... 👑')}
                </p>
              </div>
            )}

            {/* 3D Olympic Podium Structure with BIG FONTS and Sequential Reveal */}
            <div className="flex items-end justify-center gap-3 sm:gap-6 lg:gap-8 w-full max-w-4xl pt-6 pb-2">
              {/* 2nd Place (Left) */}
              <div className="flex-1 flex flex-col items-center">
                {gameState.players[1] ? (
                  podiumRevealStep >= 2 ? (
                    <div className="mb-3 text-center animate-bounce">
                      <span className="text-5xl sm:text-7xl lg:text-8xl block drop-shadow-lg">
                        {gameState.players[1].avatar}
                      </span>
                      <span className="font-black text-xl sm:text-3xl lg:text-4xl text-white block mt-2 tracking-tight">
                        {gameState.players[1].name}
                      </span>
                      <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-slate-200 block mt-1">
                        {gameState.players[1].score.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-slate-400">{isMarathi ? 'गुण' : 'pts'}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 text-center py-6 px-4 bg-slate-900/60 border border-slate-800 rounded-3xl w-full max-w-[200px] animate-pulse">
                      <span className="text-4xl sm:text-5xl block opacity-40">🥈</span>
                      <span className="text-xs sm:text-sm font-black text-slate-400 block mt-2">
                        {isMarathi ? '२ रा क्रमांक...' : '2nd Place...'}
                      </span>
                    </div>
                  )
                ) : null}

                {/* Pedestal 2 */}
                <div className={`w-full h-44 sm:h-56 lg:h-64 bg-gradient-to-t from-slate-800 via-slate-700 to-slate-500 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl border-t-2 border-slate-300/60 transition-all duration-700 ${
                  podiumRevealStep >= 2 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                }`}>
                  <Medal className="w-10 h-10 sm:w-14 sm:h-14 text-slate-200 drop-shadow" />
                  <span className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-mono mt-1">२</span>
                  <span className="text-xs sm:text-sm lg:text-base text-slate-200 font-black uppercase tracking-wider mt-1 px-3 py-0.5 rounded-full bg-slate-900/40">
                    {isMarathi ? 'रौप्य उपविजेता' : 'Silver'}
                  </span>
                </div>
              </div>

              {/* 1st Place Champion (Center & Tallest) */}
              <div className="flex-1 flex flex-col items-center -mt-8 sm:-mt-12">
                {gameState.players[0] ? (
                  podiumRevealStep >= 3 ? (
                    <div className="mb-4 text-center animate-pulse-subtle">
                      <Crown className="w-10 h-10 sm:w-16 sm:h-16 text-amber-400 mx-auto fill-amber-400 animate-bounce drop-shadow-xl" />
                      <span className="text-6xl sm:text-8xl lg:text-9xl block drop-shadow-2xl">
                        {gameState.players[0].avatar}
                      </span>
                      <span className="font-black text-2xl sm:text-4xl lg:text-5xl text-amber-300 block mt-2 tracking-tight drop-shadow-md">
                        {gameState.players[0].name}
                      </span>
                      <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono text-amber-400 block mt-1 drop-shadow">
                        {gameState.players[0].score.toLocaleString()} <span className="text-sm sm:text-base font-bold text-amber-200">{isMarathi ? 'गुण' : 'pts'}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4 text-center py-8 px-4 bg-slate-900/80 border-2 border-amber-500/40 rounded-3xl w-full max-w-[240px] animate-pulse">
                      <span className="text-5xl sm:text-6xl block">👑</span>
                      <span className="text-sm sm:text-base font-black text-amber-300 block mt-2">
                        {isMarathi ? '१ ला सुवर्ण विजेता कोण?...' : 'Champion?...'}
                      </span>
                    </div>
                  )
                ) : null}

                {/* Pedestal 1 */}
                <div className={`w-full h-56 sm:h-72 lg:h-80 bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl ring-8 ring-amber-400/40 border-t-2 border-yellow-200 transition-all duration-700 ${
                  podiumRevealStep >= 3 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                }`}>
                  <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-amber-950 fill-amber-950 drop-shadow" />
                  <span className="text-5xl sm:text-7xl lg:text-8xl font-black text-amber-950 font-mono mt-1">१</span>
                  <span className="text-xs sm:text-sm lg:text-lg text-amber-950 font-black uppercase tracking-wider mt-1 px-4 py-1 rounded-full bg-yellow-300/60 shadow">
                    {isMarathi ? 'सुवर्ण महाविजेता' : 'Gold Champion'}
                  </span>
                </div>
              </div>

              {/* 3rd Place (Right) */}
              <div className="flex-1 flex flex-col items-center">
                {gameState.players[2] ? (
                  podiumRevealStep >= 1 ? (
                    <div className="mb-3 text-center animate-bounce">
                      <span className="text-5xl sm:text-7xl lg:text-8xl block drop-shadow-lg">
                        {gameState.players[2].avatar}
                      </span>
                      <span className="font-black text-xl sm:text-3xl lg:text-4xl text-amber-100 block mt-2 tracking-tight">
                        {gameState.players[2].name}
                      </span>
                      <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono text-amber-300 block mt-1">
                        {gameState.players[2].score.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-slate-400">{isMarathi ? 'गुण' : 'pts'}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 text-center py-6 px-4 bg-slate-900/60 border border-slate-800 rounded-3xl w-full max-w-[200px] animate-pulse">
                      <span className="text-4xl sm:text-5xl block opacity-40">🥉</span>
                      <span className="text-xs sm:text-sm font-black text-slate-400 block mt-2">
                        {isMarathi ? '३ रा क्रमांक...' : '3rd Place...'}
                      </span>
                    </div>
                  )
                ) : null}

                {/* Pedestal 3 */}
                <div className={`w-full h-36 sm:h-44 lg:h-52 bg-gradient-to-t from-amber-950 via-amber-800 to-amber-700 rounded-t-3xl flex flex-col items-center justify-center shadow-2xl border-t-2 border-amber-600/60 transition-all duration-700 ${
                  podiumRevealStep >= 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                }`}>
                  <Medal className="w-8 h-8 sm:w-12 sm:h-12 text-amber-300 drop-shadow" />
                  <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-200 font-mono mt-1">३</span>
                  <span className="text-xs sm:text-sm lg:text-base text-amber-200 font-black uppercase tracking-wider mt-1 px-3 py-0.5 rounded-full bg-slate-950/40">
                    {isMarathi ? 'कांस्य पदक' : 'Bronze'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sequential Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 w-full">
              {podiumRevealStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setPodiumRevealStep(3)}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer"
                >
                  {isMarathi ? 'सर्व विजेते एकदम उघडा' : 'Reveal All Immediately'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setPodiumRevealStep(0);
                    setTimeout(() => {
                      setPodiumRevealStep(1);
                      sound.playStepFanfare(1);
                      fireConfetti(35);
                    }, 800);
                    setTimeout(() => {
                      setPodiumRevealStep(2);
                      sound.playStepFanfare(2);
                      fireConfetti(55);
                    }, 2400);
                    setTimeout(() => {
                      setPodiumRevealStep(3);
                      sound.playPodiumFanfare();
                      firePodiumCelebration();
                    }, 4200);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 text-sm shadow transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isMarathi ? 'पुन्हा ॲनिमेशन दाखवा' : 'Replay Animation'}</span>
                </button>
              )}

              {/* Print / Save Merit List */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 text-sm shadow transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-indigo-400" />
                <span>{isMarathi ? 'गुणवत्ता पत्रक प्रिंट करा' : 'Print Merit Sheet'}</span>
              </button>

              {/* Play Again Button */}
              <button
                type="button"
                onClick={() => sendMessage({ type: 'HOST_RESET_GAME' })}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:scale-105 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-600/30 transition cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{isMarathi ? 'नवीन खेळ सुरू करा (Play Again)' : 'Play Again'}</span>
              </button>
            </div>

            {/* Complete Sequential Merit List (सर्व विद्यार्थ्यांची संपूर्ण गुणवत्ता यादी क्रमाने) */}
            <div className="w-full mt-6 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    {isMarathi ? 'सर्व विद्यार्थ्यांची संपूर्ण गुणवत्ता यादी (क्रमाने)' : 'Complete Ranked Merit List'}
                  </h3>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-400">
                  {isMarathi ? `एकूण: ${totalPlayers} विद्यार्थी` : `Total: ${totalPlayers}`}
                </span>
              </div>

              {/* Sequential Ranking Cards with BIG FONTS */}
              <div className="space-y-3">
                {gameState.players.map((player, rankIdx) => {
                  const isTop3 = rankIdx < 3;
                  const medalBorderColors = [
                    'border-amber-400 bg-amber-500/15 shadow-amber-500/10', // 1st Gold
                    'border-slate-300 bg-slate-400/15 shadow-slate-300/10', // 2nd Silver
                    'border-amber-700 bg-amber-800/15 shadow-amber-800/10', // 3rd Bronze
                  ];

                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-lg ${
                        isTop3
                          ? `${medalBorderColors[rankIdx]} scale-[1.01]`
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      {/* Left: Rank Medal + Avatar + Big Name */}
                      <div className="flex items-center gap-3 sm:gap-5">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-2xl shadow-inner shrink-0 ${
                          rankIdx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : rankIdx === 1
                            ? 'bg-slate-300 text-slate-950 font-black'
                            : rankIdx === 2
                            ? 'bg-amber-700 text-white font-black'
                            : 'bg-slate-800 text-slate-300 font-bold'
                        }`}>
                          {rankIdx === 0 ? '🥇 १' : rankIdx === 1 ? '🥈 २' : rankIdx === 2 ? '🥉 ३' : `#${rankIdx + 1}`}
                        </div>

                        <span className="text-3xl sm:text-5xl shrink-0">
                          {player.avatar}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-lg sm:text-2xl lg:text-3xl text-white tracking-tight">
                              {player.name}
                            </span>
                            {rankIdx === 0 && (
                              <span className="text-[11px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {isMarathi ? 'विजेता' : 'Winner'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 mt-1 flex-wrap">
                            {player.highestStreak > 1 && (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                                {player.highestStreak} {isMarathi ? 'सलग अचूक!' : 'streak!'}
                              </span>
                            )}
                            <span>
                              {isMarathi
                                ? `${Object.keys(player.answers).length} / ${gameState.totalQuestions} प्रश्नांची उत्तरे दिली`
                                : `${Object.keys(player.answers).length} / ${gameState.totalQuestions} answered`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Big Font Score */}
                      <div className="text-right shrink-0">
                        <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono text-amber-400 block drop-shadow">
                          {player.score.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-400 block mt-0.5">
                          {isMarathi ? 'एकूण गुण' : 'points'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Question Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        questions={gameState.questions || []}
        onSaveQuestions={(newQs) => {
          sendMessage({ type: 'HOST_CHANGE_QUESTIONS', payload: { questions: newQs } });
        }}
        selectedTopic={gameState.selectedTopic || 'all'}
        onSelectTopic={(topicId) => {
          sendMessage({ type: 'HOST_SET_TOPIC', payload: { topicId } });
        }}
        isMarathi={isMarathi}
      />

      {/* Digital Balance Scale & Fractions Lab Modal */}
      <DigitalFractionScaleModal
        isOpen={isScaleModalOpen}
        onClose={() => setIsScaleModalOpen(false)}
        isMarathi={isMarathi}
      />
    </div>
  );
};
