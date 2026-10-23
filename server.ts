import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_QUESTIONS, QUIZ_TOPICS, filterQuestionsByTopic, getTopicById } from './src/data/defaultQuestions.ts';
import { GamePhase, GameRoomState, Player, QuizQuestion, ClientMessage } from './src/types/quiz.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const isProd = process.env.NODE_ENV === 'production';
const getPort = (): number => {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    return Number(process.argv[portArgIndex + 1]);
  }
  // In dev / AI Studio container environment, port 8080 is reserved for Nginx.
  // The dev server must bind to port 3000.
  if (!isProd) {
    return 3000;
  }
  if (process.env.APP_PORT) {
    return Number(process.env.APP_PORT);
  }
  if (process.env.PORT && process.env.PORT !== '8080') {
    return Number(process.env.PORT);
  }
  return 3000;
};
const PORT = getPort();

app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

app.use(express.json());

interface ConnectedClient {
  ws: WebSocket;
  pin: string;
  role: 'host' | 'player';
  playerId?: string;
}

interface ServerRoom {
  pin: string;
  titleMr: string;
  titleEn: string;
  phase: GamePhase;
  currentQuestionIndex: number;
  allQuestions: QuizQuestion[];
  questions: QuizQuestion[];
  selectedTopic: string;
  selectedTopicNameMr: string;
  selectedTopicNameEn: string;
  players: Map<string, Player>;
  questionStartedAt: number | null;
  timeLimit: number;
  timeLeft: number;
  defaultTimeLimit: number;
  autoAdvance: boolean;
  autoAdvanceTimeout: NodeJS.Timeout | null;
  timerInterval: NodeJS.Timeout | null;
  countdownTimer: NodeJS.Timeout | null;
  hostWs: WebSocket | null;
  clients: Set<WebSocket>;
  createdAt: number;
  botIntervals: NodeJS.Timeout[];
}

const rooms = new Map<string, ServerRoom>();
const clientMap = new Map<WebSocket, ConnectedClient>();

function generatePin(): string {
  let pin = '';
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(pin));
  return pin;
}

function createRoom(customQuestions?: QuizQuestion[]): ServerRoom {
  const pin = generatePin();
  const masterQuestions = customQuestions && customQuestions.length > 0 ? customQuestions : DEFAULT_QUESTIONS;
  
  const room: ServerRoom = {
    pin,
    titleMr: 'थेट प्रश्नमंजुषा स्पर्धा',
    titleEn: 'Live Classroom Quiz Battle',
    phase: 'LOBBY',
    currentQuestionIndex: 0,
    allQuestions: [...masterQuestions],
    questions: [...masterQuestions],
    selectedTopic: 'all',
    selectedTopicNameMr: 'सर्व विषय (मिश्र)',
    selectedTopicNameEn: 'All Topics (Mixed)',
    players: new Map(),
    questionStartedAt: null,
    timeLimit: 20,
    timeLeft: 20,
    defaultTimeLimit: 20,
    autoAdvance: true,
    autoAdvanceTimeout: null,
    timerInterval: null,
    countdownTimer: null,
    hostWs: null,
    clients: new Set(),
    createdAt: Date.now(),
    botIntervals: []
  };

  rooms.set(pin, room);
  return room;
}

// Automatically create a default room at startup so it's always ready immediately
let defaultRoom = createRoom();

function getPublicGameState(room: ServerRoom, isHostOrReveal: boolean = false): GameRoomState {
  const currentQ = room.questions[room.currentQuestionIndex];
  
  // Calculate answer counts
  const answerCounts: [number, number, number, number] = [0, 0, 0, 0];
  room.players.forEach(p => {
    const ans = p.answers[room.currentQuestionIndex];
    if (ans && ans.selectedIndex >= 0 && ans.selectedIndex <= 3) {
      answerCounts[ans.selectedIndex]++;
    }
  });

  const activeQuestion = currentQ ? {
    index: room.currentQuestionIndex,
    questionMr: currentQ.questionMr,
    questionEn: currentQ.questionEn,
    imageUrl: currentQ.imageUrl,
    optionsMr: currentQ.optionsMr,
    optionsEn: currentQ.optionsEn,
    optionImages: currentQ.optionImages,
    categoryMr: currentQ.categoryMr,
    categoryEn: currentQ.categoryEn,
    timeLimit: currentQ.timeLimit,
    correctIndex: (isHostOrReveal || room.phase === 'REVEAL' || room.phase === 'LEADERBOARD' || room.phase === 'PODIUM') 
      ? currentQ.correctIndex 
      : undefined,
    explanationMr: (isHostOrReveal || room.phase === 'REVEAL' || room.phase === 'LEADERBOARD' || room.phase === 'PODIUM') 
      ? currentQ.explanationMr 
      : undefined,
    explanationEn: (isHostOrReveal || room.phase === 'REVEAL' || room.phase === 'LEADERBOARD' || room.phase === 'PODIUM') 
      ? currentQ.explanationEn 
      : undefined,
  } : null;

  return {
    pin: room.pin,
    titleMr: room.titleMr,
    titleEn: room.titleEn,
    phase: room.phase,
    currentQuestionIndex: room.currentQuestionIndex,
    totalQuestions: room.questions.length,
    selectedTopic: room.selectedTopic,
    selectedTopicNameMr: room.selectedTopicNameMr,
    selectedTopicNameEn: room.selectedTopicNameEn,
    questionStartedAt: room.questionStartedAt,
    timeLimit: room.timeLimit,
    timeLeft: room.timeLeft,
    players: Array.from(room.players.values()).sort((a, b) => b.score - a.score),
    activeQuestion,
    answerCounts,
    questions: isHostOrReveal ? room.questions : undefined,
    defaultTimeLimit: room.defaultTimeLimit,
    autoAdvance: room.autoAdvance,
    hostConnected: room.hostWs !== null && room.hostWs.readyState === WebSocket.OPEN
  };
}

function broadcastRoomState(room: ServerRoom) {
  const hostState = getPublicGameState(room, true);
  const playerState = getPublicGameState(room, false);

  const hostMsg = JSON.stringify({ type: 'STATE_UPDATE', payload: hostState });
  const playerMsg = JSON.stringify({ type: 'STATE_UPDATE', payload: playerState });

  const staleSockets: WebSocket[] = [];

  room.clients.forEach(clientWs => {
    if (clientWs.readyState === WebSocket.OPEN) {
      const clientInfo = clientMap.get(clientWs);
      try {
        if (clientInfo?.role === 'host') {
          clientWs.send(hostMsg);
        } else {
          clientWs.send(playerMsg);
        }
      } catch (err) {
        console.error('Failed to send state to client:', err);
        staleSockets.push(clientWs);
      }
    } else if (clientWs.readyState === WebSocket.CLOSED || clientWs.readyState === WebSocket.CLOSING) {
      staleSockets.push(clientWs);
    }
  });

  staleSockets.forEach(s => {
    room.clients.delete(s);
    clientMap.delete(s);
  });
}

function stopTimers(room: ServerRoom) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  if (room.countdownTimer) {
    clearTimeout(room.countdownTimer);
    room.countdownTimer = null;
  }
  if (room.autoAdvanceTimeout) {
    clearTimeout(room.autoAdvanceTimeout);
    room.autoAdvanceTimeout = null;
  }
  room.botIntervals.forEach(clearTimeout);
  room.botIntervals = [];
}

// Automatically reveal answer, show distribution, show leaderboard, then advance to next question
function transitionToRevealWithAutoAdvance(room: ServerRoom) {
  stopTimers(room);
  room.phase = 'REVEAL';
  broadcastRoomState(room);

  if (room.autoAdvance) {
    // Show correct answer and result breakdown for 3.5 seconds
    room.autoAdvanceTimeout = setTimeout(() => {
      if (room.phase !== 'REVEAL') return;
      room.phase = 'LEADERBOARD';
      broadcastRoomState(room);

      // Show leaderboard for 3.5 seconds, then move to next question or final podium!
      room.autoAdvanceTimeout = setTimeout(() => {
        if (room.phase !== 'LEADERBOARD') return;
        const nextIndex = room.currentQuestionIndex + 1;
        if (nextIndex >= room.questions.length) {
          room.phase = 'PODIUM';
          broadcastRoomState(room);
        } else {
          startQuestion(room, nextIndex);
        }
      }, 3500);
    }, 3500);
  }
}

function startQuestion(room: ServerRoom, questionIndex: number) {
  stopTimers(room);

  if (questionIndex >= room.questions.length) {
    room.phase = 'PODIUM';
    broadcastRoomState(room);
    return;
  }

  room.currentQuestionIndex = questionIndex;
  const q = room.questions[questionIndex];
  room.phase = 'QUESTION';
  room.timeLimit = q.timeLimit || room.defaultTimeLimit || 20;
  room.timeLeft = room.timeLimit;
  room.questionStartedAt = Date.now();

  // Reset players' lastAnswer for this question
  room.players.forEach(p => {
    p.lastAnswer = null;
  });

  broadcastRoomState(room);

  // Authoritative countdown timer on server
  room.timerInterval = setInterval(() => {
    room.timeLeft -= 1;

    // Broadcast tick
    const tickMsg = JSON.stringify({ type: 'TIMER_TICK', payload: { timeLeft: room.timeLeft } });
    room.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(tickMsg);
        } catch {
          // ignore
        }
      }
    });

    if (room.timeLeft <= 0) {
      transitionToRevealWithAutoAdvance(room);
    }
  }, 1000);

  // Trigger bots if any exist
  room.players.forEach(p => {
    if (p.id.startsWith('bot-')) {
      const delay = Math.random() * (room.timeLimit * 700) + 1200; // Answer within 1.2s to 70% of limit
      const timeout = setTimeout(() => {
        if (room.phase !== 'QUESTION' || room.currentQuestionIndex !== questionIndex) return;
        // 80% chance of correct answer for bots
        const isRight = Math.random() > 0.25;
        const selected = isRight ? q.correctIndex : (q.correctIndex + 1 + Math.floor(Math.random() * 3)) % 4;
        submitPlayerAnswer(room, p.id, questionIndex, selected);
      }, delay);
      room.botIntervals.push(timeout);
    }
  });
}

function submitPlayerAnswer(room: ServerRoom, playerId: string, questionIndex: number, selectedIndex: number, sourceWs?: WebSocket) {
  if (room.phase !== 'QUESTION') return;
  if (room.currentQuestionIndex !== questionIndex) return;

  const player = room.players.get(playerId);
  if (!player) return;

  // Idempotency: Ignore if already answered
  if (player.answers[questionIndex] !== undefined) return;

  const currentQ = room.questions[questionIndex];
  if (!currentQ) return;

  const isCorrect = selectedIndex === currentQ.correctIndex;
  const timeTaken = room.questionStartedAt ? (Date.now() - room.questionStartedAt) / 1000 : 0;
  
  let points = 0;
  if (isCorrect) {
    const timeRemaining = Math.max(0, room.timeLimit - timeTaken);
    const speedRatio = timeRemaining / room.timeLimit;
    const basePoints = 500;
    const speedBonus = Math.round(500 * speedRatio);
    const streakBonus = Math.min(300, player.streak * 50);
    points = basePoints + speedBonus + streakBonus;

    player.score += points;
    player.streak += 1;
    player.highestStreak = Math.max(player.highestStreak, player.streak);
  } else {
    player.streak = 0;
  }

  const answerRecord = {
    selectedIndex,
    timeTaken,
    isCorrect,
    points,
    streakAtTime: player.streak
  };

  player.answers[questionIndex] = answerRecord;
  player.lastAnswer = {
    selectedIndex,
    isCorrect,
    points
  };

  // Send immediate answer acknowledgement to the answering player
  if (sourceWs && sourceWs.readyState === WebSocket.OPEN) {
    try {
      sourceWs.send(JSON.stringify({
        type: 'ANSWER_ACCEPTED',
        payload: {
          isCorrect,
          points,
          totalScore: player.score,
          streak: player.streak
        }
      }));
    } catch (err) {
      console.error('Failed to send ANSWER_ACCEPTED:', err);
    }
  }

  // Check if all players answered
  let allAnswered = true;
  for (const p of room.players.values()) {
    if (p.isOnline && p.answers[questionIndex] === undefined) {
      allAnswered = false;
      break;
    }
  }

  broadcastRoomState(room);

  if (allAnswered && room.players.size > 0) {
    // If all players have answered, transition to REVEAL and auto-advance!
    setTimeout(() => {
      if (room.phase === 'QUESTION' && room.currentQuestionIndex === questionIndex) {
        transitionToRevealWithAutoAdvance(room);
      }
    }, 600);
  }
}

// WebSocket Connection handling
wss.on('connection', (ws) => {
  ws.on('message', (messageRaw) => {
    try {
      const msg: ClientMessage = JSON.parse(messageRaw.toString());

      switch (msg.type) {
        case 'HOST_CREATE_ROOM': {
          const room = createRoom(msg.payload?.customQuestions);
          room.hostWs = ws;
          room.clients.add(ws);

          clientMap.set(ws, { ws, pin: room.pin, role: 'host' });

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            payload: { pin: room.pin, state: getPublicGameState(room, true) }
          }));
          break;
        }

        case 'SYNC_REQUEST': {
          let room = rooms.get(msg.payload.pin);
          if (!room && msg.payload.pin === defaultRoom.pin) {
            room = defaultRoom;
          }

          if (!room) {
            // If room doesn't exist, create or fallback to default
            room = defaultRoom;
          }

          room.clients.add(ws);
          clientMap.set(ws, {
            ws,
            pin: room.pin,
            role: msg.payload.role,
            playerId: msg.payload.playerId
          });

          if (msg.payload.role === 'host') {
            room.hostWs = ws;
          } else if (msg.payload.playerId && room.players.has(msg.payload.playerId)) {
            const p = room.players.get(msg.payload.playerId)!;
            p.isOnline = true;
          }

          const isHost = msg.payload.role === 'host';
          ws.send(JSON.stringify({
            type: 'STATE_UPDATE',
            payload: getPublicGameState(room, isHost)
          }));
          break;
        }

        case 'PLAYER_JOIN': {
          const { pin, name, avatar } = msg.payload;
          let room = rooms.get(pin.trim());
          if (!room && (pin === '' || pin === defaultRoom.pin)) {
            room = defaultRoom;
          }

          if (!room) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              payload: {
                messageMr: 'अवैध पिन (Invalid PIN) - कृपया योग्य ६ आकडी पिन किंवा QR कोड वापरा.',
                messageEn: 'Invalid PIN - please enter a valid 6-digit game PIN.'
              }
            }));
            return;
          }

          const playerId = 'p-' + Math.random().toString(36).substring(2, 9);
          const newPlayer: Player = {
            id: playerId,
            name: name.trim() || 'खेळाडू',
            avatar: avatar || '🦁',
            score: 0,
            streak: 0,
            highestStreak: 0,
            answers: {},
            lastAnswer: null,
            joinedAt: Date.now(),
            isOnline: true
          };

          room.players.set(playerId, newPlayer);
          room.clients.add(ws);
          clientMap.set(ws, { ws, pin: room.pin, role: 'player', playerId });

          ws.send(JSON.stringify({
            type: 'ROOM_JOINED',
            payload: { pin: room.pin, playerId, state: getPublicGameState(room, false) }
          }));

          broadcastRoomState(room);
          break;
        }

        case 'PLAYER_SUBMIT_ANSWER': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || !clientInfo.playerId) return;

          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          submitPlayerAnswer(room, clientInfo.playerId, msg.payload.questionIndex, msg.payload.selectedIndex, ws);
          break;
        }

        case 'HOST_START_COUNTDOWN': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          stopTimers(room);
          room.phase = 'STARTING';
          broadcastRoomState(room);

          // 3 second dramatic countdown, then start Question 0
          room.countdownTimer = setTimeout(() => {
            startQuestion(room, 0);
          }, 3200);
          break;
        }

        case 'HOST_START_QUESTION': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          startQuestion(room, room.currentQuestionIndex);
          break;
        }

        case 'HOST_REVEAL_ANSWER': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          stopTimers(room);
          room.phase = 'REVEAL';
          broadcastRoomState(room);
          break;
        }

        case 'HOST_SHOW_LEADERBOARD': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          stopTimers(room);
          room.phase = 'LEADERBOARD';
          broadcastRoomState(room);
          break;
        }

        case 'HOST_NEXT_QUESTION': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          const nextIndex = room.currentQuestionIndex + 1;
          if (nextIndex >= room.questions.length) {
            room.phase = 'PODIUM';
            broadcastRoomState(room);
          } else {
            startQuestion(room, nextIndex);
          }
          break;
        }

        case 'HOST_SHOW_PODIUM': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          stopTimers(room);
          room.phase = 'PODIUM';
          broadcastRoomState(room);
          break;
        }

        case 'HOST_SET_DEFAULT_TIMER': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          const seconds = Math.max(5, Math.min(120, Number(msg.payload.seconds) || 20));
          room.defaultTimeLimit = seconds;
          room.timeLimit = seconds;
          room.questions.forEach(q => {
            q.timeLimit = seconds;
          });
          if (room.phase === 'QUESTION') {
            room.timeLeft = Math.min(room.timeLeft, seconds);
          }
          broadcastRoomState(room);
          break;
        }

        case 'HOST_TOGGLE_AUTO_ADVANCE': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          if (msg.payload?.enabled !== undefined) {
            room.autoAdvance = Boolean(msg.payload.enabled);
          } else {
            room.autoAdvance = !room.autoAdvance;
          }
          broadcastRoomState(room);
          break;
        }

        case 'HOST_RESET_GAME': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          stopTimers(room);
          room.phase = 'LOBBY';
          room.currentQuestionIndex = 0;
          room.players.forEach(p => {
            p.score = 0;
            p.streak = 0;
            p.answers = {};
            p.lastAnswer = null;
          });
          broadcastRoomState(room);
          break;
        }

        case 'HOST_ADD_BOT': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          const botNames = ['राजू (Raju)', 'प्रिया (Priya)', 'रोहन (Rohan)', 'स्नेहा (Sneha)', 'अनिल (Anil)', 'कविता (Kavita)'];
          const botAvatars = ['🐯', '🚀', '🌟', '🐬', '🦉', '🎯'];
          const existingBotCount = Array.from(room.players.keys()).filter(k => k.startsWith('bot-')).length;
          const name = msg.payload?.name || botNames[existingBotCount % botNames.length];
          const avatar = botAvatars[existingBotCount % botAvatars.length];
          const botId = `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

          room.players.set(botId, {
            id: botId,
            name,
            avatar,
            score: 0,
            streak: 0,
            highestStreak: 0,
            answers: {},
            lastAnswer: null,
            joinedAt: Date.now(),
            isOnline: true
          });

          broadcastRoomState(room);
          break;
        }

        case 'HOST_KICK_PLAYER': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          room.players.delete(msg.payload.playerId);
          broadcastRoomState(room);
          break;
        }

        case 'HOST_SET_TOPIC': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          const topicId = msg.payload.topicId || 'all';
          const topicInfo = getTopicById(topicId);
          room.selectedTopic = topicId;
          room.selectedTopicNameMr = topicInfo?.nameMr || 'सर्व विषय (मिश्र)';
          room.selectedTopicNameEn = topicInfo?.nameEn || 'All Topics (Mixed)';

          // Filter questions from room.allQuestions based on topic
          const filtered = filterQuestionsByTopic(room.allQuestions, topicId);
          room.questions = filtered.length > 0 ? filtered : room.allQuestions;
          room.currentQuestionIndex = 0;

          if (topicId === 'all') {
            room.titleMr = 'थेट प्रश्नमंजुषा स्पर्धा';
            room.titleEn = 'Live Classroom Quiz Battle';
          } else {
            room.titleMr = `${topicInfo?.nameMr} विशेष प्रश्नमंजुषा`;
            room.titleEn = `${topicInfo?.nameEn} Quiz Battle`;
          }

          broadcastRoomState(room);
          break;
        }

        case 'HOST_CHANGE_QUESTIONS': {
          const clientInfo = clientMap.get(ws);
          if (!clientInfo || clientInfo.role !== 'host') return;
          const room = rooms.get(clientInfo.pin);
          if (!room) return;

          if (msg.payload.questions && msg.payload.questions.length > 0) {
            room.allQuestions = msg.payload.questions;
            if (room.selectedTopic && room.selectedTopic !== 'all') {
              const filtered = filterQuestionsByTopic(msg.payload.questions, room.selectedTopic);
              room.questions = filtered.length > 0 ? filtered : msg.payload.questions;
            } else {
              room.questions = msg.payload.questions;
            }
            room.currentQuestionIndex = 0;
            broadcastRoomState(room);
          }
          break;
        }
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    const clientInfo = clientMap.get(ws);
    if (clientInfo) {
      const room = rooms.get(clientInfo.pin);
      if (room) {
        room.clients.delete(ws);
        if (clientInfo.role === 'host') {
          room.hostWs = null;
        } else if (clientInfo.playerId) {
          const player = room.players.get(clientInfo.playerId);
          if (player) {
            player.isOnline = false;
          }
        }
        broadcastRoomState(room);
      }
      clientMap.delete(ws);
    }
  });
});

// REST API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeRooms: rooms.size, defaultPin: defaultRoom.pin });
});

app.get('/api/default-questions', (req, res) => {
  res.json(DEFAULT_QUESTIONS);
});

// Vite middleware in dev or static files in production
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
}

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server] Port ${PORT} is already in use. Retrying or waiting for port release.`);
  } else {
    console.error('[Server Error]:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz server listening on http://0.0.0.0:${PORT} (Default PIN: ${defaultRoom.pin})`);
});
