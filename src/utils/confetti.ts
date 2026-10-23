import confetti from 'canvas-confetti';

export function fireConfetti(count = 100) {
  try {
    confetti({
      particleCount: count,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
    });
  } catch {
    // safely ignore
  }
}

export function firePodiumCelebration() {
  try {
    const end = Date.now() + 3000;
    const colors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#eab308'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // safely ignore
  }
}
