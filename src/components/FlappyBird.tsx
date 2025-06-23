
import React, { useState, useEffect, useCallback } from 'react';

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

interface FlappyBirdProps {
  onGameEnd: (score: number) => void;
}

const FlappyBird: React.FC<FlappyBirdProps> = ({ onGameEnd }) => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const BIRD_SIZE = 30;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
      // Play jump sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGkdBSuOzO/YiTYIG2m98OOdTgwNT6bg8bFjHQU6k9v00XoqBSt7yO/eizEIHWmI2uybPwkVYLbn5J9NEAxPmuC1+');
      audio.play().catch(() => {});
    }
  }, [gameStarted, gameOver]);

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
  };

  // Game physics
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          return prev;
        }
        return newY;
      });

      setBirdVelocity(prev => prev + GRAVITY);

      setPipes(prev => {
        let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - 3 }));
        
        // Remove pipes that are off screen
        newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
        
        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 300) {
          newPipes.push({
            x: GAME_WIDTH,
            gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
            passed: false
          });
        }

        // Check for scoring
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
            pipe.passed = true;
            setScore(prev => prev + 1);
          }
        });

        return newPipes;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdVelocity]);

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const birdRect = {
      x: 100,
      y: birdY,
      width: BIRD_SIZE,
      height: BIRD_SIZE
    };

    for (let pipe of pipes) {
      const topPipeRect = {
        x: pipe.x,
        y: 0,
        width: PIPE_WIDTH,
        height: pipe.gapY
      };

      const bottomPipeRect = {
        x: pipe.x,
        y: pipe.gapY + PIPE_GAP,
        width: PIPE_WIDTH,
        height: GAME_HEIGHT - pipe.gapY - PIPE_GAP
      };

      if (
        (birdRect.x < topPipeRect.x + topPipeRect.width &&
         birdRect.x + birdRect.width > topPipeRect.x &&
         birdRect.y < topPipeRect.y + topPipeRect.height &&
         birdRect.y + birdRect.height > topPipeRect.y) ||
        (birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
         birdRect.x + birdRect.width > bottomPipeRect.x &&
         birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
         birdRect.y + birdRect.height > bottomPipeRect.y)
      ) {
        setGameOver(true);
        break;
      }
    }
  }, [birdY, pipes, gameStarted, gameOver]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      const timer = setTimeout(() => {
        onGameEnd(score);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameOver, score, onGameEnd]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="mb-4">
        <div className="text-2xl font-bold text-green-400 font-mono">
          MATRIX BIRD • SCORE: {score}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-green-500 cursor-pointer overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Matrix background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="matrix-rain-game"></div>
        </div>

        {/* Bird */}
        <div
          className="absolute bg-green-400 border border-green-300 transition-transform duration-75"
          style={{
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            left: 100,
            top: birdY,
            transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`,
            borderRadius: '50%'
          }}
        >
          <div className="absolute inset-2 bg-green-300 rounded-full"></div>
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-400"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.gapY
              }}
            >
              <div className="absolute inset-1 bg-green-400 opacity-50"></div>
            </div>
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-400"
              style={{
                left: pipe.x,
                top: pipe.gapY + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.gapY - PIPE_GAP
              }}
            >
              <div className="absolute inset-1 bg-green-400 opacity-50"></div>
            </div>
          </div>
        ))}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-4 font-mono animate-pulse">
                SYSTEM FAILURE
              </div>
              <div className="text-2xl text-green-400 mb-4 font-mono">
                FINAL SCORE: {score}
              </div>
              <div className="text-lg text-green-300 font-mono">
                Returning to matrix...
              </div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-4 font-mono animate-pulse">
                MATRIX BIRD
              </div>
              <div className="text-lg text-green-300 mb-4 font-mono">
                Click or Press SPACE to fly
              </div>
              <div className="text-sm text-green-500 font-mono">
                Navigate through the data streams
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm text-green-400 font-mono">
          CONTROLS: CLICK or SPACEBAR to jump • Avoid the data barriers
        </div>
      </div>

      <style>{`
        .matrix-rain-game {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.1) 25%, rgba(0, 255, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.1) 75%, rgba(0, 255, 0, 0.1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.1) 25%, rgba(0, 255, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.1) 75%, rgba(0, 255, 0, 0.1) 76%, transparent 77%, transparent);
          background-size: 15px 15px;
          animation: matrix-move-game 15s linear infinite;
        }
        
        @keyframes matrix-move-game {
          0% { transform: translate(0, 0); }
          100% { transform: translate(15px, 15px); }
        }
      `}</style>
    </div>
  );
};

export default FlappyBird;
