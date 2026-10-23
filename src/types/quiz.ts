export interface QuizTopic {
  id: string;
  nameMr: string;
  nameEn: string;
  icon: string;
  color: string;
  bgGradient: string;
  descriptionMr: string;
  descriptionEn: string;
}

export interface QuizQuestion {
  id: string;
  topicId?: string;
  questionMr: string;
  questionEn: string;
  imageUrl?: string;
  optionsMr: [string, string, string, string];
  optionsEn: [string, string, string, string];
  optionImages?: [string | undefined, string | undefined, string | undefined, string | undefined];
  correctIndex: number;
  explanationMr?: string;
  explanationEn?: string;
  categoryMr: string;
  categoryEn: string;
  timeLimit: number; // in seconds, default 20
}

export interface PlayerAnswer {
  selectedIndex: number;
  timeTaken: number;
  isCorrect: boolean;
  points: number;
  streakAtTime: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  highestStreak: number;
  answers: Record<number, PlayerAnswer>;
  lastAnswer?: {
    selectedIndex: number;
    isCorrect: boolean;
    points: number;
  } | null;
  joinedAt: number;
  isOnline: boolean;
}

export type GamePhase = 'LOBBY' | 'STARTING' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'PODIUM';

export interface GameRoomState {
  pin: string;
  titleMr: string;
  titleEn: string;
  phase: GamePhase;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStartedAt: number | null;
  timeLimit: number;
  timeLeft: number;
  players: Player[];
  activeQuestion?: {
    index: number;
    questionMr: string;
    questionEn: string;
    imageUrl?: string;
    optionsMr: [string, string, string, string];
    optionsEn: [string, string, string, string];
    optionImages?: [string | undefined, string | undefined, string | undefined, string | undefined];
    categoryMr: string;
    categoryEn: string;
    timeLimit: number;
    correctIndex?: number; // Only sent in REVEAL, LEADERBOARD, or to host
    explanationMr?: string;
    explanationEn?: string;
  } | null;
  answerCounts?: [number, number, number, number];
  questions?: QuizQuestion[];
  selectedTopic?: string;
  selectedTopicNameMr?: string;
  selectedTopicNameEn?: string;
  defaultTimeLimit: number;
  autoAdvance: boolean;
  autoAdvanceCountdown?: number;
  hostConnected: boolean;
}

export type ClientMessage =
  | { type: 'HOST_CREATE_ROOM'; payload?: { customQuestions?: QuizQuestion[] } }
  | { type: 'HOST_START_COUNTDOWN' }
  | { type: 'HOST_START_QUESTION' }
  | { type: 'HOST_REVEAL_ANSWER' }
  | { type: 'HOST_SHOW_LEADERBOARD' }
  | { type: 'HOST_NEXT_QUESTION' }
  | { type: 'HOST_SHOW_PODIUM' }
  | { type: 'HOST_RESET_GAME' }
  | { type: 'HOST_SET_DEFAULT_TIMER'; payload: { seconds: number } }
  | { type: 'HOST_TOGGLE_AUTO_ADVANCE'; payload?: { enabled: boolean } }
  | { type: 'HOST_CHANGE_QUESTIONS'; payload: { questions: QuizQuestion[] } }
  | { type: 'HOST_SET_TOPIC'; payload: { topicId: string } }
  | { type: 'HOST_KICK_PLAYER'; payload: { playerId: string } }
  | { type: 'HOST_ADD_BOT'; payload?: { name?: string } }
  | { type: 'PLAYER_JOIN'; payload: { pin: string; name: string; avatar: string } }
  | { type: 'PLAYER_SUBMIT_ANSWER'; payload: { questionIndex: number; selectedIndex: number } }
  | { type: 'SYNC_REQUEST'; payload: { pin: string; role: 'host' | 'player'; playerId?: string } };

export type ServerMessage =
  | { type: 'ROOM_CREATED'; payload: { pin: string; state: GameRoomState } }
  | { type: 'ROOM_JOINED'; payload: { pin: string; playerId: string; state: GameRoomState } }
  | { type: 'STATE_UPDATE'; payload: GameRoomState }
  | { type: 'TIMER_TICK'; payload: { timeLeft: number } }
  | { type: 'ANSWER_ACCEPTED'; payload: { isCorrect: boolean; points: number; totalScore: number; streak: number } }
  | { type: 'ERROR'; payload: { messageMr: string; messageEn: string } };
