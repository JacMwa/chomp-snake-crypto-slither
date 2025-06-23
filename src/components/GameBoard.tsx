
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

interface GameBoardProps {
  onGameEnd: (score: number) => void;
}

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

const GameBoard = ({ onGameEnd }: GameBoardProps) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <Card className="bg-gradient-to-r from-green-500/20 to-yellow-500/20 border-green-400/30 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{score}</div>
            <div className="text-sm text-gray-300">Score</div>
          </div>
        </Card>
        
        <div className="space-x-4">
          <Button 
            onClick={() => setIsPaused(!isPaused)}
            variant="outline"
            className="border-yellow-500 text-yellow-300 hover:bg-yellow-500/20"
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </Button>
          <Button 
            onClick={() => onGameEnd(score)}
            variant="outline"
            className="border-red-500 text-red-300 hover:bg-red-500/20"
          >
            🏠 Menu
          </Button>
        </div>
      </div>

      {/* Game Board */}
      <Card className="bg-black/60 backdrop-blur-lg border-gray-700/50 p-4">
        <div 
          className="grid gap-1 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            maxWidth: '600px',
            aspectRatio: '1'
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);
            
            const isSnakeHead = snake[0] && snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            
            return (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm transition-all duration-100
                  ${isSnakeHead ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-400/50' : ''}
                  ${isSnakeBody ? 'bg-gradient-to-br from-green-500 to-green-700' : ''}
                  ${isFood ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50 animate-pulse' : ''}
                  ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-gray-800/30' : ''}
                `}
              >
                {isFood && <div className="w-full h-full flex items-center justify-center text-xs">🪙</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Game Controls */}
      <div className="mt-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mb-4">
          <Button 
            onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })}
            variant="outline"
            className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
          >
            ⬆️
          </Button>
          <Button 
            onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })}
            variant="outline"
            className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
          >
            ⬅️
          </Button>
          <Button 
            onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })}
            variant="outline"
            className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
          >
            ⬇️
          </Button>
          <Button 
            onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })}
            variant="outline"
            className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
          >
            ➡️
          </Button>
        </div>
        
        <p className="text-gray-400 text-sm">
          Use arrow keys or buttons to control • Spacebar to pause
        </p>
        
        {isPaused && (
          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <p className="text-yellow-300 font-bold">Game Paused</p>
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gradient-to-br from-red-900/80 to-purple-900/80 border-red-500/50 p-8 max-w-md mx-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over! 💀</h2>
              <p className="text-xl mb-2">Final Score: <span className="text-green-400 font-bold">{score}</span></p>
              <p className="text-lg mb-6">$CHOMP Earned: <span className="text-yellow-400 font-bold">{Math.floor(score / 10)}</span></p>
              
              <div className="space-y-4">
                <Button 
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold"
                >
                  🔄 Play Again
                </Button>
                <Button 
                  onClick={() => onGameEnd(score)}
                  variant="outline"
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-500/20"
                >
                  🏠 Back to Menu
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
