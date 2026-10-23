import React, { useState } from 'react';
import { GameRoomState, ClientMessage } from '../types/quiz';
import { AVATAR_OPTIONS, ANSWER_COLORS } from '../data/defaultQuestions';
import { fireConfetti } from '../utils/confetti';
import { sound } from '../utils/soundEffects';
import {
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  User,
  ArrowRight,
  ShieldCheck,
  Medal,
  Award,
  AlertTriangle,
  Crown,
  Volume2,
  VolumeX,
  Scale
} from 'lucide-react';
import { DigitalFractionScaleModal } from './DigitalFractionScaleModal';

interface StudentViewProps {
  gameState: GameRoomState | null;
  playerId: string | null;
  setPlayerId: (id: string | null) => void;
  sendMessage: (msg: ClientMessage) => void;
  isMarathi: boolean;
  initialPin?: string;
}

export const StudentView: React.FC<StudentViewProps> = ({
  gameState,
  playerId,
  setPlayerId,
  sendMessage,
  isMarathi,
  initialPin = ''
}) => {
  const [pinInput, setPinInput] = useState(initialPin);
  const [nameInput, setNameInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].emoji);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{
    questionIndex: number;
    optionIndex: number;
  } | null>(null);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const me = gameState?.players.find((p) => p.id === playerId);
  const isJoined = Boolean(playerId && me);

  const currentQ = gameState?.activeQuestion;

  // Whenever the question index changes or phase changes, reset local answer state
  React.useEffect(() => {
    setSelectedAnswer(null);
  }, [gameState?.currentQuestionIndex, gameState?.phase]);

  const myAnswer = me && currentQ ? me.answers[currentQ.index] : undefined;
  const hasLocallySelected = selectedAnswer !== null && selectedAnswer.questionIndex === currentQ?.index;
  const hasAnswered = myAnswer !== undefined || hasLocallySelected;

  // Trigger sound effect on reveal (correct or wrong)
  React.useEffect(() => {
    if (gameState?.phase === 'REVEAL' && currentQ && me) {
      const ans = me.answers[currentQ.index] || me.lastAnswer;
      if (ans) {
        if (ans.isCorrect) {
          sound.playCorrect();
          fireConfetti(35);
        } else {
          sound.playWrong();
        }
      }
    }
  }, [gameState?.phase, currentQ, me]);

  // Trigger sound effect when quiz finishes / podium
  React.useEffect(() => {
    if (gameState?.phase === 'PODIUM') {
      sound.playQuizFinished();
    }
  }, [gameState?.phase]);

  // Urgent beep alert for final 5 seconds if student has not yet answered!
  React.useEffect(() => {
    if (
      gameState?.phase === 'QUESTION' &&
      currentQ &&
      !hasAnswered &&
      gameState.timeLeft <= 5 &&
      gameState.timeLeft > 0
    ) {
      sound.playUrgentBeep(gameState.timeLeft);
    }
  }, [gameState?.timeLeft, gameState?.phase, hasAnswered, currentQ]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    sound.unlockAudio();

    sendMessage({
      type: 'PLAYER_JOIN',
      payload: {
        pin: pinInput.trim() || gameState?.pin || '',
        name: nameInput.trim(),
        avatar: selectedAvatar
      }
    });
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (hasAnswered || !currentQ || gameState?.phase !== 'QUESTION') return;

    sound.unlockAudio();
    sound.playAnswerSubmitted();

    setSelectedAnswer({
      questionIndex: currentQ.index,
      optionIndex
    });
    sendMessage({
      type: 'PLAYER_SUBMIT_ANSWER',
      payload: {
        questionIndex: currentQ.index,
        selectedIndex: optionIndex
      }
    });
  };

  // Find my rank
  const myRank = me && gameState
    ? gameState.players.findIndex((p) => p.id === me.id) + 1
    : 0;

  // View 1: Not Joined Yet -> Join Form
  if (!gameState || !playerId || !me) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isMarathi ? 'थेट प्रश्नमंजुषा' : 'Live Quiz Battle'}
            </h1>
            <p className="text-xs text-slate-400">
              {isMarathi ? 'नाव टाका आणि थेट खेळामध्ये सामील व्हा' : 'Enter your name to join the game'}
            </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            {/* PIN input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {isMarathi ? 'खेळ पिन (Game PIN):' : 'Game PIN:'}
              </label>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={gameState?.pin || 'उदा. 482910'}
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-center font-mono text-2xl font-black tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {isMarathi ? 'तुमचे नाव (Your Name):' : 'Your Name:'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={isMarathi ? 'उदा. राहुल, स्नेहा...' : 'e.g. Rahul, Sneha...'}
                  maxLength={20}
                  className="w-full px-4 py-3 pl-11 bg-slate-950 border border-slate-700 rounded-2xl text-white font-bold text-base focus:outline-none focus:border-indigo-500"
                  required
                />
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                {isMarathi ? 'अवतार निवडा (Pick Avatar):' : 'Pick an Avatar:'}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(item.emoji)}
                    className={`h-11 rounded-2xl flex items-center justify-center text-2xl transition transform hover:scale-110 ${
                      selectedAvatar === item.emoji
                        ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-105'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isMarathi ? 'सामील व्हा (Join Game)' : 'Join Quiz Now'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // View 2: Joined - Active Student Playing View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-xl mx-auto border-x border-slate-900/60 shadow-2xl">
      {/* Student Top Bar */}
      <header className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
            {me.avatar}
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>{me.name}</span>
              {myRank > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold">
                  #{myRank}
                </span>
              )}
            </div>
            {me.streak > 1 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{me.streak} सलग उत्तरे!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Sound Toggle & Current Score Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
            }`}
            title={isMuted ? 'ध्वनी सुरू करा (Unmute)' : 'ध्वनी बंद करा (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              {isMarathi ? 'एकूण गुण' : 'Score'}
            </span>
            <span className="text-base font-black font-mono text-amber-400">
              {me.score.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Based on Game Phase */}
      <main className="flex-1 flex flex-col justify-center p-4">
        {/* PHASE 1: LOBBY */}
        {gameState?.phase === 'LOBBY' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-5xl mx-auto shadow-2xl ring-8 ring-indigo-500/20 animate-pulse-subtle">
              {me.avatar}
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isMarathi ? 'तुम्ही जोडले गेला आहात!' : "You're in!"}
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {isMarathi ? `स्वागत आहे, ${me.name}!` : `Welcome, ${me.name}!`}
              </h2>

              {/* Topic Badge in Student Lobby */}
              {gameState?.selectedTopicNameMr && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-950/90 border-2 border-indigo-500/40 text-white shadow-xl animate-fade-in mx-auto">
                  <span className="text-xl">🎯</span>
                  <span className="text-xs text-slate-300">
                    {isMarathi ? 'खेळाचा विषय:' : 'Quiz Topic:'}{' '}
                    <strong className="text-amber-400 font-extrabold text-sm ml-1">
                      {isMarathi ? gameState.selectedTopicNameMr : gameState.selectedTopicNameEn || gameState.selectedTopicNameMr}
                    </strong>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold">
                    {gameState.totalQuestions} {isMarathi ? 'प्रश्न' : 'Q'}
                  </span>
                </div>
              )}

              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                {isMarathi
                  ? 'शिक्षकांनी खेळ सुरू करण्याची वाट पहा... लवकरच स्क्रीनवर प्रश्न येईल!'
                  : 'Waiting for host to start the game... Keep an eye on the screen!'}
              </p>

              {/* Student Digital Scale & Fraction Lab Practice Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsScaleModalOpen(true)}
                  className="w-full max-w-xs mx-auto py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border-2 border-amber-500/40 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl cursor-pointer transition active:scale-95 animate-pulse-subtle"
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>{isMarathi ? '⚖️ डिजिटल तराजू सराव खेळा' : '⚖️ Practice Digital Scale Game'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 max-w-xs mx-auto space-y-1 text-left">
              <div className="font-bold text-slate-200">💡 {isMarathi ? 'महत्त्वाची टीप:' : 'Pro Tip:'}</div>
              <div>
                {isMarathi
                  ? '१. अचूक उत्तर देणे आवश्यक आहे.'
                  : '1. Accuracy is essential.'}
              </div>
              <div>
                {isMarathi
                  ? '२. जितक्या वेगाने उत्तर द्याल, तितके जास्त गुण मिळतील!'
                  : '2. The faster you respond, the higher the points!'}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: STARTING 3..2..1 */}
        {gameState?.phase === 'STARTING' && (
          <div className="text-center space-y-6 py-12">
            <span className="text-sm font-bold text-amber-400 uppercase tracking-widest">
              {isMarathi ? 'सज्ज व्हा!' : 'Get Ready!'}
            </span>
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto shadow-2xl ring-8 ring-rose-500/20 animate-bounce">
              <span className="text-6xl font-black text-white font-mono">३</span>
            </div>
            <p className="text-slate-400 text-sm">
              {isMarathi ? 'प्रश्न सुरू होत आहे...' : 'Question starting...'}
            </p>
          </div>
        )}

        {/* PHASE 3: QUESTION (Active Answering) */}
        {gameState?.phase === 'QUESTION' && currentQ && (
          <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">
                {isMarathi ? `प्रश्न ${currentQ.index + 1}` : `Q ${currentQ.index + 1}`}
              </span>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 truncate max-w-[140px]">
                {isMarathi ? currentQ.categoryMr : currentQ.categoryEn}
              </span>

              {/* Countdown timer */}
              <div className={`flex items-center gap-1.5 font-mono text-lg font-black transition-all ${
                gameState.timeLeft <= 5 && !hasAnswered ? 'text-rose-400 animate-pulse scale-110' : 'text-amber-400'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{gameState.timeLeft}s</span>
              </div>
            </div>

            {/* Urgent Warning if <= 5 seconds and not answered */}
            {!hasAnswered && gameState.timeLeft <= 5 && gameState.timeLeft > 0 && (
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-rose-600/30 border-2 border-rose-500 rounded-2xl text-rose-300 text-xs font-black animate-pulse shadow-lg shadow-rose-600/20">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>
                  {isMarathi
                    ? `⚠️ घाई करा! फक्त ${gameState.timeLeft} सेकंद शिल्लक!`
                    : `⚠️ Hurry up! Only ${gameState.timeLeft}s left!`}
                </span>
              </div>
            )}

            {/* Question Text & Optional Image */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-2">
              {currentQ.imageUrl && (
                <div className="flex justify-center mb-1">
                  <img
                    src={currentQ.imageUrl}
                    alt="Question Visual"
                    className="max-h-40 w-auto object-contain rounded-xl border border-indigo-500/30 shadow-lg bg-slate-950 mx-auto"
                  />
                </div>
              )}
              <h3 className="text-lg lg:text-xl font-bold text-white leading-snug">
                {currentQ.questionMr}
              </h3>
              {currentQ.questionEn && currentQ.questionEn !== currentQ.questionMr && (
                <p className="text-xs text-slate-400 italic">
                  {currentQ.questionEn}
                </p>
              )}
            </div>

            {/* Answer Feedback / Locked State */}
            {hasAnswered ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-indigo-500/30 rounded-3xl text-center space-y-3 animate-pulse-subtle">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  {isMarathi ? 'उत्तर नोंदवले गेले आहे!' : 'Answer Submitted!'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isMarathi ? 'शिक्षकांकडून निकाल जाहीर होण्याची वाट पहा...' : 'Waiting for timer to end...'}
                </p>
              </div>
            ) : (
              /* 4 Big Touch Buttons with Option Image support */
              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
                {currentQ.optionsMr.map((opt, optIdx) => {
                  const color = ANSWER_COLORS[optIdx];
                  const optImg = currentQ.optionImages ? currentQ.optionImages[optIdx] : undefined;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`min-h-32 p-3 sm:p-4 rounded-3xl ${color.bg} flex flex-col items-center justify-center text-center gap-2 shadow-xl active:scale-95 transition cursor-pointer relative overflow-hidden group`}
                    >
                      {optImg && (
                        <div className="w-full flex justify-center mb-0.5">
                          <img
                            src={optImg}
                            alt={opt}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-2 border-white/30 shadow-lg bg-black/40 group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="text-xl sm:text-2xl font-black drop-shadow-md">
                          {color.shape}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-white leading-tight">
                          {opt}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: REVEAL (Result Feedback) */}
        {gameState?.phase === 'REVEAL' && currentQ && (() => {
          const revealAnswer = myAnswer || me.lastAnswer;
          const correctIdx = currentQ.correctIndex !== undefined ? currentQ.correctIndex : -1;
          const correctOptText = correctIdx >= 0 ? currentQ.optionsMr[correctIdx] : '';
          const correctOptImg = (correctIdx >= 0 && currentQ.optionImages) ? currentQ.optionImages[correctIdx] : undefined;
          const correctColor = correctIdx >= 0 ? ANSWER_COLORS[correctIdx] : null;

          return (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-5 max-w-md mx-auto w-full">
              {revealAnswer ? (
                revealAnswer.isCorrect ? (
                  <div className="w-full space-y-3">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                      <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-400">
                        {isMarathi ? 'अतिशय छान! बरोबर उत्तर!' : 'Awesome! Correct Answer!'}
                      </h3>
                      <p className="text-3xl font-black font-mono text-amber-400 mt-1">
                        +{revealAnswer.points} {isMarathi ? 'गुण' : 'points'}
                      </p>
                    </div>
                    {me.streak > 1 && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                        <Flame className="w-4 h-4 fill-amber-400" />
                        <span>{me.streak} सलग बरोबर उत्तरे! 🔥</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-2xl">
                      <XCircle className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-rose-400">
                        {isMarathi ? 'अरेरे, चुकीचे उत्तर!' : 'Oops, Wrong Answer!'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {isMarathi ? 'पुढच्या प्रश्नात नक्की जास्त गुण मिळतील!' : 'Keep going! Try the next one!'}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full space-y-3">
                  <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Clock className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-300">
                    {isMarathi ? 'वेळेत उत्तर दिले नाही' : 'Time Ran Out!'}
                  </h3>
                </div>
              )}

              {/* Show Correct Answer Highlight with Image */}
              {correctIdx >= 0 && (
                <div className="w-full p-4 bg-emerald-950/50 border-2 border-emerald-500/50 rounded-2xl text-left space-y-2 shadow-lg">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    ✓ {isMarathi ? 'योग्य उत्तर (Correct Answer):' : 'Correct Answer:'}
                  </span>
                  <div className="flex items-center gap-3">
                    {correctOptImg && (
                      <img
                        src={correctOptImg}
                        alt="Correct visual"
                        className="w-16 h-16 object-cover rounded-xl border border-emerald-400/40 bg-black/50 shrink-0 shadow-md"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {correctColor && (
                          <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {correctColor.shape}
                          </span>
                        )}
                        <span className="text-base font-extrabold text-white">
                          {correctOptText}
                        </span>
                      </div>
                      {currentQ.explanationMr && (
                        <p className="text-xs text-emerald-300/90 mt-1.5 leading-relaxed">
                          💡 {currentQ.explanationMr}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Question Image in Reveal */}
              {currentQ.imageUrl && (
                <div className="flex justify-center max-w-xs">
                  <img
                    src={currentQ.imageUrl}
                    alt="Question"
                    className="max-h-28 w-auto object-contain rounded-xl border border-indigo-500/30 shadow-md bg-slate-950"
                  />
                </div>
              )}

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl w-full">
                <span className="text-xs text-slate-400 block mb-0.5">
                  {isMarathi ? 'तुमचे सध्याचे एकूण गुण:' : 'Your Total Score:'}
                </span>
                <span className="text-2xl font-black font-mono text-white">
                  {me.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          );
        })()}

        {/* PHASE 5: LEADERBOARD */}
        {gameState?.phase === 'LEADERBOARD' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 py-6">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
              <Medal className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isMarathi ? 'तुमचा गुणवत्ता क्रमांक:' : 'Your Current Rank:'}
              </span>
              <h2 className="text-4xl font-black text-amber-400 font-mono">
                #{myRank}
              </h2>
              <p className="text-sm text-slate-300">
                {isMarathi ? `एकूण ${me.score.toLocaleString()} गुण` : `Total ${me.score.toLocaleString()} points`}
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
              {isMarathi ? 'शिक्षकांकडून पुढील प्रश्न सुरू होण्याची वाट पहा...' : 'Waiting for host to continue...'}
            </div>
          </div>
        )}

        {/* PHASE 6: PODIUM */}
        {gameState?.phase === 'PODIUM' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 py-6 px-2">
            {/* Big Avatar with Crown / Glow */}
            <div className="relative">
              {myRank === 1 && (
                <Crown className="w-12 h-12 text-amber-400 fill-amber-400 mx-auto animate-bounce absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-lg" />
              )}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-6xl sm:text-7xl mx-auto shadow-2xl ring-8 ring-amber-400/30 animate-pulse-subtle">
                {me.avatar}
              </div>
            </div>

            {/* Big Font Rank Heading */}
            <div className="space-y-3 w-full max-w-sm">
              <span className="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-widest px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                🎉 {isMarathi ? 'अंतिम निकाल' : 'Final Results'} 🎉
              </span>

              <h2 className={`font-black tracking-tight leading-tight ${
                myRank === 1
                  ? 'text-3xl sm:text-5xl text-amber-300 drop-shadow-md'
                  : myRank === 2
                  ? 'text-2xl sm:text-4xl text-slate-100'
                  : myRank === 3
                  ? 'text-2xl sm:text-4xl text-amber-200'
                  : 'text-2xl sm:text-4xl text-white'
              }`}>
                {myRank === 1
                  ? isMarathi ? '१ ला क्रमांक - सुवर्ण विजेता! 🥇' : 'Champion! 1st Place! 🥇'
                  : myRank === 2
                  ? isMarathi ? '२ रा क्रमांक - रौप्य उपविजेता! 🥈' : 'Runner-Up! 2nd Place! 🥈'
                  : myRank === 3
                  ? isMarathi ? '३ रा क्रमांक - कांस्य पदक! 🥉' : '3rd Place Bronze! 🥉'
                  : isMarathi ? `गुणवत्ता क्रमांक: #${myRank}` : `Final Rank: #${myRank}`}
              </h2>

              <div className="py-2">
                <span className="text-4xl sm:text-6xl font-black font-mono text-amber-400 block drop-shadow">
                  {me.score.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-400 block mt-1 uppercase tracking-wider">
                  {isMarathi ? 'एकूण मिळवलेले गुण' : 'Total Points'}
                </span>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center">
                <span className="text-[11px] text-slate-400 font-bold block">
                  {isMarathi ? 'अचूक उत्तरे' : 'Correct Answers'}
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {Object.values(me.answers).filter(a => a.isCorrect).length} / {gameState.totalQuestions}
                </span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center">
                <span className="text-[11px] text-slate-400 font-bold block">
                  {isMarathi ? 'सर्वोच्च स्ट्रीक' : 'Best Streak'}
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  🔥 {me.highestStreak}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl w-full max-w-sm space-y-1 text-xs text-slate-400">
              <p className="text-white font-bold text-sm">{isMarathi ? 'उत्कृष्ट कामगिरी! सहभागाबद्दल धन्यवाद!' : 'Well Played! Thanks for participating!'}</p>
              <p>{isMarathi ? 'असेच सतत शिकत राहा आणि नवीन ज्ञान मिळवा.' : 'Keep learning and aiming for the top!'}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
        {isMarathi ? 'थेट प्रश्नमंजुषा स्पर्धा • जलद व अचूक उत्तरे' : 'Live Classroom Quiz Battle • Fast & Accurate'}
      </footer>

      {/* Student Digital Balance Scale & Fraction Practice Modal */}
      <DigitalFractionScaleModal
        isOpen={isScaleModalOpen}
        onClose={() => setIsScaleModalOpen(false)}
        isMarathi={isMarathi}
      />
    </div>
  );
};
