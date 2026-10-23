import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
  PieChart,
  BrainCircuit,
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { fireConfetti } from '../utils/confetti';
import { createFractionCircleSvg, createFractionBarSvg } from '../utils/fractionVisuals';

interface DigitalFractionScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMarathi: boolean;
}

interface ScaleQuestion {
  id: string;
  level: number;
  fracA: { num: number; den: number; label: string };
  fracB: { num: number; den: number; label: string };
  correctComparison: '<' | '=' | '>';
  ruleMr: string;
  ruleEn: string;
  explanationMr: string;
  explanationEn: string;
}

const CURATED_SCALE_CHALLENGES: ScaleQuestion[] = [
  // पातळी ७: समछेद अपूर्णांक तुलना (Like Denominators)
  {
    id: 'scale_1',
    level: 7,
    fracA: { num: 3, den: 5, label: '३/५' },
    fracB: { num: 1, den: 5, label: '१/५' },
    correctComparison: '>',
    ruleMr: 'समान छेद असताना ज्याचा अंश मोठा तो अपूर्णांक मोठा असतो.',
    ruleEn: 'With identical denominators, the fraction with the larger numerator is greater.',
    explanationMr: 'येथे छेद ५ समान आहे. अंश ३ हा १ पेक्षा मोठा (३ > १) आहे, म्हणून ३/५ हे १/५ पेक्षा मोठे (जड) आहे. डावे तागडे खाली झुकेल!',
    explanationEn: 'Denominators are equal (5). Since 3 > 1, 3/5 > 1/5. The left pan tilts down!'
  },
  {
    id: 'scale_2',
    level: 7,
    fracA: { num: 2, den: 7, label: '२/७' },
    fracB: { num: 5, den: 7, label: '५/७' },
    correctComparison: '<',
    ruleMr: 'समान छेद असताना ज्याचा अंश लहान तो अपूर्णांक लहान असतो.',
    ruleEn: 'With identical denominators, smaller numerator means smaller fraction.',
    explanationMr: 'दोन्हीचा छेद ७ आहे. अंश २ हा ५ पेक्षा लहान आहे (२ < ५), म्हणून २/७ < ५/७. उजवे तागडे जड असल्याने खाली झुकेल.',
    explanationEn: 'Since 2 < 5 with common denominator 7, 2/7 < 5/7. Right pan is heavier.'
  },
  {
    id: 'scale_3',
    level: 7,
    fracA: { num: 4, den: 8, label: '४/८' },
    fracB: { num: 4, den: 8, label: '४/८' },
    correctComparison: '=',
    ruleMr: 'अंश व छेद दोन्ही तंतोतंत समान असल्यास अपूर्णांक समान (समतोल) असतात.',
    ruleEn: 'Identical fractions have equal weight and balance perfectly.',
    explanationMr: 'दोन्ही बाजूला ४/८ (अर्धा) आहे. दोन्हीचे वजन समान असल्याने डिजिटल तराजू अचूक समतोल (=) राहील!',
    explanationEn: 'Both sides are 4/8 (1/2). Weights are equal, scale balances perfectly (=)!'
  },
  {
    id: 'scale_4',
    level: 7,
    fracA: { num: 5, den: 9, label: '५/९' },
    fracB: { num: 3, den: 9, label: '३/९' },
    correctComparison: '>',
    ruleMr: 'समछेद अपूर्णांक: ५ > ३',
    ruleEn: 'Like denominators: 5 > 3',
    explanationMr: '९ समान भागांपैकी ५ भाग हे ३ भागांपेक्षा जास्त असतात, म्हणून ५/९ > ३/९.',
    explanationEn: '5 parts out of 9 is greater than 3 parts out of 9 (5/9 > 3/9).'
  },
  // पातळी ८: सममूल्य अपूर्णांक तराजू समतोल (Equivalent Fractions Balance)
  {
    id: 'scale_5',
    level: 8,
    fracA: { num: 1, den: 2, label: '१/२' },
    fracB: { num: 2, den: 4, label: '२/४' },
    correctComparison: '=',
    ruleMr: 'सममूल्य अपूर्णांक: १/२ = (१×२)/(२×२) = २/४.',
    ruleEn: 'Equivalent Fractions: 1/2 = 2/4.',
    explanationMr: '१/२ आणि २/४ हे दोन्ही एकाच वस्तूचा अर्धा भाग दर्शवतात. म्हणून डिजिटल तराजूवर ते तंतोतंत समतोल (=) राहतील!',
    explanationEn: '1/2 and 2/4 both represent half of the whole. The balance scale rests perfectly level (=)!'
  },
  {
    id: 'scale_6',
    level: 8,
    fracA: { num: 2, den: 3, label: '२/३' },
    fracB: { num: 4, den: 6, label: '४/६' },
    correctComparison: '=',
    ruleMr: 'सममूल्य अपूर्णांक: २/३ च्या अंशास व छेदास २ ने गुणल्यास ४/६ मिळते.',
    ruleEn: 'Equivalent fractions: 2/3 = 4/6.',
    explanationMr: '(२×२)/(३×२) = ४/६. दोन्हीचे मूल्य समान असल्याने तराजू समतोल (=) राहील!',
    explanationEn: '(2×2)/(3×2) = 4/6. Values are equal, scale balances (=)!'
  },
  // पातळी ८: भिन्नछेद अपूर्णांक तुलना (Unlike Denominators)
  {
    id: 'scale_7',
    level: 8,
    fracA: { num: 3, den: 4, label: '३/४' },
    fracB: { num: 2, den: 3, label: '२/३' },
    correctComparison: '>',
    ruleMr: 'भिन्नछेद अपूर्णांकांची तुलना: छेद समान करणे किंवा तिरकस गुणाकार (Cross Multiplication).',
    ruleEn: 'Comparing unlike fractions: convert to common denominator or cross-multiply.',
    explanationMr: 'तिरकस गुणाकार पद्धत: डाव्या बाजूला ३ × ३ = ९, उजव्या बाजूला ४ × २ = ८. ९ > ८ असल्याने ३/४ हे २/३ पेक्षा मोठे आहे! डावे तागडे खाली झुकेल.',
    explanationEn: 'Cross-multiplication: 3×3 = 9 vs 4×2 = 8. Since 9 > 8, 3/4 > 2/3. Left pan tilts down!'
  },
  {
    id: 'scale_8',
    level: 8,
    fracA: { num: 1, den: 3, label: '१/३' },
    fracB: { num: 1, den: 2, label: '१/२' },
    correctComparison: '<',
    ruleMr: 'समान अंश असताना ज्याचा छेद मोठा तो अपूर्णांक लहान असतो!',
    ruleEn: 'When numerators are equal, the fraction with the larger denominator is SMALLER!',
    explanationMr: 'अंश १ समान आहे. पण छेद ३ हा २ पेक्षा मोठा आहे, म्हणून १/३ हा १/२ पेक्षा लहान आहे (१/३ < १/२). उजवे तागडे (१/२) जड आहे!',
    explanationEn: 'Numerators are both 1. Since 3 > 2, 1/3 < 1/2. Right pan (1/2) is heavier!'
  },
  {
    id: 'scale_9',
    level: 8,
    fracA: { num: 5, den: 8, label: '५/८' },
    fracB: { num: 3, den: 4, label: '३/४' },
    correctComparison: '<',
    ruleMr: 'छेद ८ समान करू: ३/४ = ६/८. आता ५/८ आणि ६/८ ची तुलना करा.',
    ruleEn: 'Equalize denominators: 3/4 = 6/8. Now compare 5/8 and 6/8.',
    explanationMr: '३/४ चा सममूल्य अपूर्णांक ६/८ आहे. आता ५/८ < ६/८, म्हणून ५/८ < ३/४. उजवे तागडे खाली झुकेल.',
    explanationEn: '3/4 = 6/8. Since 5/8 < 6/8, 5/8 < 3/4. Right pan tilts down.'
  },
  {
    id: 'scale_10',
    level: 8,
    fracA: { num: 3, den: 6, label: '३/६' },
    fracB: { num: 4, den: 8, label: '४/८' },
    correctComparison: '=',
    ruleMr: 'दोन्हीचे अतिसंक्षिप्त रूप १/२ आहे (३/६ = १/२ आणि ४/८ = १/२).',
    ruleEn: 'Both simplify to 1/2 (3/6 = 1/2 and 4/8 = 1/2).',
    explanationMr: 'दोन्ही अपूर्णांक अर्धा (१/२) दर्शवतात. तराजू तंतोतंत समतोल (=) राहील!',
    explanationEn: 'Both represent half. The digital scale is balanced (=)!'
  }
];

export const DigitalFractionScaleModal: React.FC<DigitalFractionScaleModalProps> = ({
  isOpen,
  onClose,
  isMarathi
}) => {
  const [activeTab, setActiveTab] = useState<'scale' | 'auto_eval' | 'explorer'>('scale');
  
  // SCALE GAME STATE (पातळी ७ व ८)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedComparison, setSelectedComparison] = useState<'<' | '=' | '>' | null>(null);
  const [isScaleEvaluated, setIsScaleEvaluated] = useState(false);
  const [scaleScore, setScaleScore] = useState(0);
  const [scaleStreak, setScaleStreak] = useState(0);
  const [highStreak, setHighStreak] = useState(0);

  // AUTO-EVALUATION STATE (पातळी ५ व ६)
  const [autoQuestion, setAutoQuestion] = useState<{
    id: string;
    level: number;
    promptMr: string;
    promptEn: string;
    optionsMr: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationMr: string;
    explanationEn: string;
    visualSvg?: string;
  } | null>(null);
  const [autoSelectedAnswer, setAutoSelectedAnswer] = useState<number | null>(null);
  const [autoIsChecked, setAutoIsChecked] = useState(false);
  const [autoScore, setAutoScore] = useState(0);
  const [autoStreak, setAutoStreak] = useState(0);

  // EXPLORER STATE (पातळी १, २, ३, ४, ९)
  const [explorerDenom, setExplorerDenom] = useState(4);
  const [explorerNum, setExplorerNum] = useState(1);

  const currentScaleQ = CURATED_SCALE_CHALLENGES[currentIndex % CURATED_SCALE_CHALLENGES.length];

  // Helper to calculate tilt angle
  const getTiltAngle = () => {
    if (!isScaleEvaluated) return 0;
    if (currentScaleQ.correctComparison === '>') return -11; // left down
    if (currentScaleQ.correctComparison === '<') return 11;  // right down
    return 0; // balanced
  };

  // Generate a random dynamic question for Auto-Evaluation (पातळी ५ व ६)
  const generateNewAutoQuestion = () => {
    setAutoSelectedAnswer(null);
    setAutoIsChecked(false);

    const type = Math.floor(Math.random() * 3); // 0: Like Addition, 1: Equivalent missing, 2: Shaded visual

    if (type === 0) {
      // Like Addition
      const den = [5, 7, 8, 9, 10][Math.floor(Math.random() * 5)];
      const num1 = Math.floor(Math.random() * (den - 2)) + 1;
      const maxNum2 = den - num1;
      const num2 = Math.floor(Math.random() * (maxNum2 > 1 ? maxNum2 : 1)) + 1;
      const sum = num1 + num2;

      setAutoQuestion({
        id: `auto_${Date.now()}`,
        level: 5,
        promptMr: `संगणकीय स्वयं-मूल्यमापन: समछेद अपूर्णांकांची बेरीज करा: ${num1}/${den} + ${num2}/${den} = ?`,
        promptEn: `Automated Evaluation: Add like fractions: ${num1}/${den} + ${num2}/${den} = ?`,
        optionsMr: [
          `${sum}/${den}`,
          `${sum}/${den * 2}`,
          `${Math.max(1, sum - 1)}/${den}`,
          `${sum + 1}/${den}`
        ],
        optionsEn: [
          `${sum}/${den}`,
          `${sum}/${den * 2}`,
          `${Math.max(1, sum - 1)}/${den}`,
          `${sum + 1}/${den}`
        ],
        correctIndex: 0,
        explanationMr: `समछेद अपूर्णांकांची बेरीज करताना छेद (${den}) तसाच राहतो आणि अंशांची बेरीज होते: (${num1} + ${num2})/${den} = ${sum}/${den}.`,
        explanationEn: `Keep common denominator ${den} and add numerators: (${num1} + ${num2})/${den} = ${sum}/${den}.`,
        visualSvg: createFractionBarSvg(sum, den, '#10b981')
      });
    } else if (type === 1) {
      // Equivalent missing value
      const baseNum = [1, 2, 3][Math.floor(Math.random() * 3)];
      const baseDen = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const multiplier = [2, 3, 4][Math.floor(Math.random() * 3)];
      const targetNum = baseNum * multiplier;
      const targetDen = baseDen * multiplier;

      setAutoQuestion({
        id: `auto_${Date.now()}`,
        level: 6,
        promptMr: `संगणकीय स्वयं-मूल्यमापन: सममूल्य अपूर्णांकातील रिकामी जागा भरा: ${baseNum}/${baseDen} = [ ? ] / ${targetDen}`,
        promptEn: `Automated Evaluation: Find the missing equivalent numerator: ${baseNum}/${baseDen} = [ ? ] / ${targetDen}`,
        optionsMr: [
          `${targetNum}`,
          `${targetNum + 2}`,
          `${baseNum + multiplier}`,
          `${targetDen - baseDen}`
        ],
        optionsEn: [
          `${targetNum}`,
          `${targetNum + 2}`,
          `${baseNum + multiplier}`,
          `${targetDen - baseDen}`
        ],
        correctIndex: 0,
        explanationMr: `छेद ${baseDen} ला ${multiplier} ने गुणल्यावर ${targetDen} मिळाला (${baseDen} × ${multiplier} = ${targetDen}). म्हणून अंशालाही ${multiplier} ने गुणावे लागेल: ${baseNum} × ${multiplier} = ${targetNum}.`,
        explanationEn: `Denominator multiplied by ${multiplier} gives ${targetDen}. Multiply numerator by ${multiplier}: ${baseNum} × ${multiplier} = ${targetNum}.`
      });
    } else {
      // Visual shaded fraction check
      const den = [4, 6, 8][Math.floor(Math.random() * 3)];
      const num = Math.floor(Math.random() * (den - 1)) + 1;

      setAutoQuestion({
        id: `auto_${Date.now()}`,
        level: 5,
        promptMr: `संगणकीय स्वयं-मूल्यमापन: शेजारील वर्तुळाचा रंगवलेला भाग कोणत्या अपूर्णांकाने दर्शविला जाईल?`,
        promptEn: `Automated Evaluation: Which fraction represents the shaded portion of the circle?`,
        optionsMr: [
          `${num}/${den}`,
          `${den - num}/${den}`,
          `${den}/${num}`,
          `${num}/${den + 2}`
        ],
        optionsEn: [
          `${num}/${den}`,
          `${den - num}/${den}`,
          `${den}/${num}`,
          `${num}/${den + 2}`
        ],
        correctIndex: 0,
        explanationMr: `वर्तुळाचे एकूण समान भाग = ${den} (छेद) आणि रंगवलेले भाग = ${num} (अंश). म्हणून योग्य उत्तर ${num}/${den} आहे.`,
        explanationEn: `Total parts = ${den} (Denominator), Shaded parts = ${num} (Numerator). Answer is ${num}/${den}.`,
        visualSvg: createFractionCircleSvg(num, den, '#f59e0b')
      });
    }
  };

  useEffect(() => {
    if (isOpen && !autoQuestion) {
      generateNewAutoQuestion();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handler for scale comparison answer
  const handleScaleAnswer = (choice: '<' | '=' | '>') => {
    if (isScaleEvaluated) return;
    setSelectedComparison(choice);
    setIsScaleEvaluated(true);

    const isCorrect = choice === currentScaleQ.correctComparison;
    if (isCorrect) {
      sound.playCorrect();
      fireConfetti();
      const newStreak = scaleStreak + 1;
      setScaleStreak(newStreak);
      if (newStreak > highStreak) setHighStreak(newStreak);
      setScaleScore((prev) => prev + 10 * Math.min(newStreak, 5));
    } else {
      sound.playWrong();
      setScaleStreak(0);
    }
  };

  const nextScaleQuestion = () => {
    setSelectedComparison(null);
    setIsScaleEvaluated(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleAutoAnswer = (idx: number) => {
    if (autoIsChecked || !autoQuestion) return;
    setAutoSelectedAnswer(idx);
    setAutoIsChecked(true);

    if (idx === autoQuestion.correctIndex) {
      sound.playCorrect();
      fireConfetti();
      setAutoScore((prev) => prev + 10);
      setAutoStreak((prev) => prev + 1);
    } else {
      sound.playWrong();
      setAutoStreak(0);
    }
  };

  const tiltAngle = getTiltAngle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
              ⚖️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>{isMarathi ? 'अपूर्णांक प्रयोगशाळा व डिजिटल तराजू' : 'Fractions Lab & Digital Balance Scale'}</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  {isMarathi ? 'पातळी १ ते ९' : 'Levels 1 - 9'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isMarathi
                  ? 'पायाभूत ओळख • सममूल्य • संगणक स्वयं-मूल्यमापन • डिजिटल तराजू लहान-मोठेपणा'
                  : 'Basics • Equivalent • Auto Self-Assessment • Scale Comparison'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('scale')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'scale'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isMarathi ? 'पातळी ७ व ८: डिजिटल तराजू खेळ' : 'Levels 7 & 8: Digital Scale Game'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px]">⚖️</span>
          </button>

          <button
            onClick={() => setActiveTab('auto_eval')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'auto_eval'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{isMarathi ? 'पातळी ५ व ६: संगणक स्वयं-मूल्यमापन' : 'Levels 5 & 6: Auto-Evaluation'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px]">🤖</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>{isMarathi ? 'पातळी १, २, ३, ४ व ९: संकल्पना व प्रकार' : 'Levels 1-4 & 9: Concepts & Types'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/30 text-[10px]">🍰</span>
          </button>
        </div>

        {/* TAB 1: DIGITAL BALANCE SCALE GAME (पातळी ७ व ८) */}
        {activeTab === 'scale' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between gap-5">
            {/* SCORE & LEVEL STRIP */}
            <div className="w-full flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {isMarathi ? `पातळी ${currentScaleQ.level}: अपूर्णांक लहान-मोठेपणा` : `Level ${currentScaleQ.level}: Fraction Comparison`}
                </span>
                <span className="text-xs text-slate-400">
                  {isMarathi ? `प्रश्न ${currentIndex + 1} / ${CURATED_SCALE_CHALLENGES.length}` : `Question ${currentIndex + 1} of ${CURATED_SCALE_CHALLENGES.length}`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-300 text-xs font-black">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isMarathi ? `${scaleScore} गुण` : `${scaleScore} pts`}</span>
                </div>
                {scaleStreak > 1 && (
                  <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 px-2.5 py-1 rounded-xl text-orange-400 text-xs font-black animate-pulse">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{scaleStreak}x Streak</span>
                  </div>
                )}
              </div>
            </div>

            {/* THE INTERACTIVE DIGITAL BALANCE SCALE SIMULATOR */}
            <div className="w-full max-w-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-inner flex flex-col items-center relative overflow-hidden">
              <div className="text-center mb-3">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {isMarathi ? 'डिजिटल तराजूच्या मदतीने तुलना करा:' : 'Compare using the Digital Scale:'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  <span className="text-amber-400">{currentScaleQ.fracA.label}</span>
                  <span className="mx-3 text-slate-500 font-normal">
                    {isScaleEvaluated ? (
                      <span className="text-2xl font-black text-emerald-400">
                        {currentScaleQ.correctComparison}
                      </span>
                    ) : (
                      '⚖️'
                    )}
                  </span>
                  <span className="text-rose-400">{currentScaleQ.fracB.label}</span>
                </h3>
              </div>

              {/* PHYSICAL BALANCE SCALE SVG / CSS ANIMATION */}
              <div className="relative w-full max-w-lg h-60 flex items-center justify-center">
                {/* Scale Fulcrum & Stand */}
                <div className="absolute bottom-2 w-28 h-6 bg-slate-700 rounded-t-lg shadow" />
                <div className="absolute bottom-6 w-5 h-32 bg-slate-600 rounded-t-sm shadow" />
                <div className="absolute top-[82px] w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md z-20" />

                {/* Tilting Beam */}
                <div
                  className="absolute top-[90px] w-80 h-3.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-full shadow-lg z-10 transition-transform duration-700 ease-out origin-center"
                  style={{ transform: `rotate(${tiltAngle}deg)` }}
                >
                  {/* Left Pan Strings & Pan */}
                  <div className="absolute -left-2 top-2 flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-slate-400 origin-top" />
                    {/* Left Pan Container */}
                    <div className="w-24 min-h-[64px] bg-slate-800/95 border-2 border-amber-400 rounded-b-2xl rounded-t-sm p-1.5 shadow-xl flex flex-col items-center justify-end relative">
                      {/* Visual Fraction Liquid / Fill */}
                      <div
                        className="w-full bg-amber-500/40 rounded-b-xl border border-amber-400 transition-all duration-500"
                        style={{ height: `${Math.round((currentScaleQ.fracA.num / currentScaleQ.fracA.den) * 44)}px` }}
                      />
                      <span className="absolute top-1 text-sm font-black text-amber-300 drop-shadow">
                        {currentScaleQ.fracA.label}
                      </span>
                      <span className="text-[9px] text-amber-200/70 font-semibold">
                        {isMarathi ? 'डावे तागडे' : 'Left Pan'}
                      </span>
                    </div>
                  </div>

                  {/* Right Pan Strings & Pan */}
                  <div className="absolute -right-2 top-2 flex flex-col items-center">
                    <div className="w-0.5 h-16 bg-slate-400 origin-top" />
                    {/* Right Pan Container */}
                    <div className="w-24 min-h-[64px] bg-slate-800/95 border-2 border-rose-400 rounded-b-2xl rounded-t-sm p-1.5 shadow-xl flex flex-col items-center justify-end relative">
                      {/* Visual Fraction Liquid / Fill */}
                      <div
                        className="w-full bg-rose-500/40 rounded-b-xl border border-rose-400 transition-all duration-500"
                        style={{ height: `${Math.round((currentScaleQ.fracB.num / currentScaleQ.fracB.den) * 44)}px` }}
                      />
                      <span className="absolute top-1 text-sm font-black text-rose-300 drop-shadow">
                        {currentScaleQ.fracB.label}
                      </span>
                      <span className="text-[9px] text-rose-200/70 font-semibold">
                        {isMarathi ? 'उजवे तागडे' : 'Right Pan'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status / Instruction Indicator */}
              <div className="text-center mt-2 text-xs font-semibold">
                {!isScaleEvaluated ? (
                  <span className="text-indigo-300 animate-pulse">
                    {isMarathi
                      ? '👇 खालील तीन पर्यायांपैकी योग्य चिन्ह निवडून तराजू समतोल किंवा झुकवा!'
                      : '👇 Choose the correct symbol below to tilt or balance the scale!'}
                  </span>
                ) : (
                  <span className={selectedComparison === currentScaleQ.correctComparison ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {selectedComparison === currentScaleQ.correctComparison
                      ? (isMarathi ? '🎉 शाब्बास! अचूक उत्तर (+१० गुण)' : '🎉 Correct! +10 Points')
                      : (isMarathi ? '❌ चूक! योग्य तुलना समजून घ्या' : '❌ Incorrect! Learn the explanation below')}
                  </span>
                )}
              </div>
            </div>

            {/* THREE BIG TACTILE COMPARISON BUTTONS (<, =, >) */}
            {!isScaleEvaluated ? (
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl">
                <button
                  onClick={() => handleScaleAnswer('<')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-800/90 hover:bg-indigo-600 border-2 border-slate-700 hover:border-indigo-400 rounded-2xl transition cursor-pointer group shadow-lg active:scale-95"
                >
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:scale-110 transition">
                    &lt;
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-300 group-hover:text-white mt-1">
                    {isMarathi ? 'लहान (Less Than)' : 'Less Than (<)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {isMarathi ? 'डावा लहान, उजवा जड' : 'Right pan heavier'}
                  </span>
                </button>

                <button
                  onClick={() => handleScaleAnswer('=')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-800/90 hover:bg-emerald-600 border-2 border-slate-700 hover:border-emerald-400 rounded-2xl transition cursor-pointer group shadow-lg active:scale-95"
                >
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:scale-110 transition">
                    =
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-300 group-hover:text-white mt-1">
                    {isMarathi ? 'समान (समतोल)' : 'Equal (=)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {isMarathi ? 'दोन्ही सममूल्य / सारखे' : 'Perfect balance'}
                  </span>
                </button>

                <button
                  onClick={() => handleScaleAnswer('>')}
                  className="flex flex-col items-center justify-center p-4 bg-slate-800/90 hover:bg-amber-600 border-2 border-slate-700 hover:border-amber-400 rounded-2xl transition cursor-pointer group shadow-lg active:scale-95"
                >
                  <span className="text-3xl sm:text-4xl font-black text-white group-hover:scale-110 transition">
                    &gt;
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-300 group-hover:text-white mt-1">
                    {isMarathi ? 'मोठा (Greater)' : 'Greater Than (>)'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {isMarathi ? 'डावा जड, खाली झुकेल' : 'Left pan heavier'}
                  </span>
                </button>
              </div>
            ) : (
              /* DETAILED STEP-BY-STEP EXPLANATION & NEXT BUTTON */
              <div className="w-full max-w-xl bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-start gap-3">
                  {selectedComparison === currentScaleQ.correctComparison ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      {isMarathi ? currentScaleQ.ruleMr : currentScaleQ.ruleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {isMarathi ? currentScaleQ.explanationMr : currentScaleQ.explanationEn}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={nextScaleQuestion}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-500/25 cursor-pointer"
                  >
                    <span>{isMarathi ? 'पुढील आव्हान सोडवा' : 'Next Challenge'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPUTER AUTO-EVALUATION (पातळी ५ व ६) */}
        {activeTab === 'auto_eval' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between gap-5">
            {/* SCORE BAR */}
            <div className="w-full flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isMarathi ? `पातळी ${autoQuestion?.level || 5}: स्वयं-मूल्यमापन` : `Level ${autoQuestion?.level || 5}: Auto-Evaluation`}
                </span>
                <span className="text-xs text-slate-400">
                  {isMarathi ? 'संगणक आपोआप नवीन प्रश्न देतो' : 'Computer automatically generates problems'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-amber-300 text-xs font-black">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isMarathi ? `${autoScore} गुण` : `${autoScore} pts`}</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC QUESTION CARD */}
            {autoQuestion && (
              <div className="w-full max-w-xl bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center text-center space-y-4">
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                  🤖 {isMarathi ? 'संगणकीय स्वयंतपासणी प्रश्न' : 'Automated Quiz Engine'}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {isMarathi ? autoQuestion.promptMr : autoQuestion.promptEn}
                </h3>

                {/* Optional SVG Visual generated for question */}
                {autoQuestion.visualSvg && (
                  <div className="flex justify-center my-2">
                    <img
                      src={autoQuestion.visualSvg}
                      alt="Fraction Visual"
                      className="max-h-36 rounded-2xl border border-slate-700 shadow-md"
                    />
                  </div>
                )}

                {/* 4 OPTIONS */}
                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                  {autoQuestion.optionsMr.map((opt, i) => {
                    const isSelected = autoSelectedAnswer === i;
                    const isCorrect = i === autoQuestion.correctIndex;
                    let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-indigo-400 text-white';

                    if (autoIsChecked) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-600/90 border-rose-400 text-white ring-2 ring-rose-400';
                      } else {
                        btnStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={autoIsChecked}
                        onClick={() => handleAutoAnswer(i)}
                        className={`p-3.5 rounded-2xl border-2 font-black text-base sm:text-lg transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {autoIsChecked && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                        {autoIsChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* EXPLANATION AFTER ANSWERING */}
                {autoIsChecked && (
                  <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-left space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>💡 {isMarathi ? 'संगणकीय अभिप्राय व उकल:' : 'Computer Feedback & Solution:'}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {isMarathi ? autoQuestion.explanationMr : autoQuestion.explanationEn}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={generateNewAutoQuestion}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                      >
                        <span>{isMarathi ? 'पुढील संगणकीय प्रश्न' : 'Next Auto Problem'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONCEPTS & TYPES GUIDE (पातळी १, २, ३, ४ व ९) */}
        {activeTab === 'explorer' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* INTERACTIVE FRACTION SLICER (पातळी १ व २) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {isMarathi ? 'पातळी १ व २: पायाभूत ओळख (Interactive Fraction Slicer)' : 'Levels 1 & 2: Interactive Fraction Slicer'}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {isMarathi ? 'अंश व छेद बदलून आकृतीमध्ये थेट बदल पहा' : 'Change numerator & denominator to see live fraction shape'}
                  </h3>
                </div>

                <div className="bg-indigo-950 border border-indigo-500/30 px-4 py-2 rounded-2xl text-center">
                  <div className="text-2xl font-black text-amber-300">
                    {explorerNum} / {explorerDenom}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isMarathi
                      ? `अंश = ${explorerNum}, छेद = ${explorerDenom}`
                      : `Num = ${explorerNum}, Den = ${explorerDenom}`}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual SVG rendered live */}
                <div className="flex flex-col items-center justify-center bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <img
                    src={createFractionCircleSvg(explorerNum, explorerDenom, '#f59e0b')}
                    alt="Fraction Disc"
                    className="max-h-48 drop-shadow-md"
                  />
                  <div className="mt-2 text-xs text-slate-400 font-semibold text-center">
                    {explorerNum === 1 && explorerDenom === 2 && 'अर्धा भाग (Half)'}
                    {explorerNum === 1 && explorerDenom === 4 && 'पाव भाग (Quarter)'}
                    {explorerNum === 3 && explorerDenom === 4 && 'पाऊण भाग (Three-Fourths)'}
                    {explorerNum === explorerDenom && 'एक पूर्ण (Whole)'}
                    {!(
                      (explorerNum === 1 && explorerDenom === 2) ||
                      (explorerNum === 1 && explorerDenom === 4) ||
                      (explorerNum === 3 && explorerDenom === 4) ||
                      explorerNum === explorerDenom
                    ) && `${explorerNum} अंश ${explorerDenom} छेद (${explorerNum} भाग रंगवलेले)`}
                  </div>
                </div>

                {/* Sliders & Controls */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-bold mb-1">
                      <span>{isMarathi ? 'छेद (एकूण समान भाग):' : 'Denominator (Total Parts):'}</span>
                      <span className="text-amber-400 font-black">{explorerDenom}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[2, 3, 4, 5, 6, 8, 10, 12].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setExplorerDenom(d);
                            if (explorerNum > d) setExplorerNum(d);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            explorerDenom === d
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-bold mb-1">
                      <span>{isMarathi ? 'अंश (रंगवलेले भाग):' : 'Numerator (Shaded Parts):'}</span>
                      <span className="text-amber-400 font-black">{explorerNum}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={explorerDenom}
                      value={explorerNum}
                      onChange={(e) => setExplorerNum(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Equivalent Fraction Mini Indicator (पातळी ३ व ४) */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {isMarathi ? 'सममूल्य अपूर्णांक (Equivalent Fractions):' : 'Equivalent Fractions:'}
                    </span>
                    <p className="text-xs text-emerald-300 font-semibold">
                      {explorerNum}/{explorerDenom} = {explorerNum * 2}/{explorerDenom * 2} = {explorerNum * 3}/{explorerDenom * 3}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TYPES OF FRACTIONS CARDS (पातळी ९: समछेद व भिन्नछेद अपूर्णांक) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  {isMarathi ? 'पातळी ९: अपूर्णांकांचे प्रकार (Types of Fractions)' : 'Level 9: Types of Fractions'}
                </span>
                <h3 className="text-lg font-black text-white">
                  {isMarathi ? 'समछेद व भिन्नछेद अपूर्णांक ओळखण्याचा सराव' : 'Like and Unlike Fractions Practice Guide'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. समछेद अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'समछेद अपूर्णांक (Like Fractions)' : 'Like Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'ज्या अपूर्णांकांचे छेद समान (सारखे) असतात.'
                      : 'Fractions with the same denominator.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-300">
                    उदा: २/७, ५/७, ३/७
                  </div>
                </div>

                {/* 2. भिन्नछेद अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'भिन्नछेद अपूर्णांक (Unlike Fractions)' : 'Unlike Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'ज्या अपूर्णांकांचे छेद वेगवेगळे (भिन्न) असतात.'
                      : 'Fractions with different denominators.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-300">
                    उदा: ३/४, २/५, ५/८
                  </div>
                </div>

                {/* 3. सममूल्य अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'सममूल्य अपूर्णांक (Equivalent)' : 'Equivalent Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'वेगवेगळे दिसत असले तरी त्यांची किंमत समान असते.'
                      : 'Fractions representing the same value.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-300">
                    १/२ = २/४ = ४/८
                  </div>
                </div>

                {/* 4. छेदाधिक अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'छेदाधिक अपूर्णांक (Proper)' : 'Proper Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'अंश हा छेदापेक्षा लहान असतो (अंश < छेद).'
                      : 'Numerator is smaller than denominator.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-300">
                    उदा: ३/५ (किंमत &lt; १)
                  </div>
                </div>

                {/* 5. अंशाधिक अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'अंशाधिक अपूर्णांक (Improper)' : 'Improper Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'अंश हा छेदापेक्षा मोठा असतो (अंश > छेद).'
                      : 'Numerator is greater than denominator.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono font-bold text-rose-300">
                    उदा: ७/४ (किंमत &gt; १)
                  </div>
                </div>

                {/* 6. पूर्णांकयुक्त अपूर्णांक */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <h4 className="font-bold text-white text-sm">
                      {isMarathi ? 'पूर्णांकयुक्त (Mixed)' : 'Mixed Fractions'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    {isMarathi
                      ? 'पूर्णांक संख्या आणि अपूर्णांक मिळून बनतो.'
                      : 'A whole number plus a proper fraction.'}
                  </p>
                  <div className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs font-mono font-bold text-violet-300">
                    उदा: २ ⅓ (दोन पूर्णांक एक तृतीयांश)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex items-center justify-between text-xs text-slate-400">
          <span>{isMarathi ? 'महाराष्ट्र राज्य अभ्यासक्रम - इयत्ता ४ थी ते ७ वी गणित' : 'Curriculum Fractions Grade 4-7'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
