import { useEffect, useRef, useState, useCallback } from 'react';
import { GameRoomState, ClientMessage, ServerMessage } from '../types/quiz';
import { sound } from '../utils/soundEffects';

interface UseQuizSocketOptions {
  pin?: string;
  role: 'host' | 'player';
  playerId?: string;
  onJoined?: (payload: { pin: string; playerId: string; state: GameRoomState }) => void;
  onAnswerAccepted?: (data: { isCorrect: boolean; points: number; totalScore: number; streak: number }) => void;
  onError?: (err: { messageMr: string; messageEn: string }) => void;
}

export function useQuizSocket({ pin, role, playerId, onJoined, onAnswerAccepted, onError }: UseQuizSocketOptions) {
  const [gameState, setGameState] = useState<GameRoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setLastError(null);

      // If we have a pin or role, send sync or create
      if (role === 'host') {
        if (!pin) {
          ws.send(JSON.stringify({ type: 'HOST_CREATE_ROOM' }));
        } else {
          ws.send(JSON.stringify({
            type: 'SYNC_REQUEST',
            payload: { pin, role: 'host' }
          }));
        }
      } else if (pin) {
        ws.send(JSON.stringify({
          type: 'SYNC_REQUEST',
          payload: { pin, role: 'player', playerId }
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg: ServerMessage = JSON.parse(event.data);

        switch (msg.type) {
          case 'ROOM_CREATED':
            setGameState(msg.payload.state);
            break;

          case 'ROOM_JOINED':
            setGameState(msg.payload.state);
            if (onJoined) {
              onJoined(msg.payload);
            }
            break;

          case 'STATE_UPDATE':
            setGameState(msg.payload);
            break;

          case 'TIMER_TICK':
            setGameState((prev) => {
              if (!prev) return prev;
              const newTime = msg.payload.timeLeft;
              // Play ticking sound
              if (prev.phase === 'QUESTION') {
                if (newTime <= 5 && newTime > 0) {
                  sound.playTick(true);
                } else if (newTime > 5) {
                  sound.playTick(false);
                }
              }
              return { ...prev, timeLeft: newTime };
            });
            break;

          case 'ANSWER_ACCEPTED':
            if (onAnswerAccepted) {
              onAnswerAccepted(msg.payload);
            }
            if (msg.payload.isCorrect) {
              sound.playCorrect();
            } else {
              sound.playWrong();
            }
            break;

          case 'ERROR':
            setLastError(msg.payload.messageMr);
            if (onError) {
              onError(msg.payload);
            }
            break;
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Attempt auto-reconnect after 2 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 2000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };
  }, [pin, role, playerId, onAnswerAccepted, onError]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((msg: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn('Cannot send message, WebSocket not connected');
    }
  }, []);

  return {
    gameState,
    isConnected,
    lastError,
    sendMessage
  };
}
