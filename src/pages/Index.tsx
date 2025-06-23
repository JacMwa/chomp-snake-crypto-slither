
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import Leaderboard from "../components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [score, setScore] = useState(0);
  const [chompTokens, setChompTokens] = useState(0);

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden font-mono relative">
      {/* Matrix-style animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="matrix-rain"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-green-400 animate-pulse tracking-wider">
            CHOMP SNAKE 🐍
          </h1>
          <p className="text-xl mb-2 text-green-300">ENTER THE MATRIX • CONSUME DATA • DOMINATE</p>
          <p className="text-lg text-green-500 font-mono">Score points • Earn $CHOMP • Climb the system</p>
        </div>

        {!isPlaying ? (
          <div className="max-w-4xl mx-auto">
            {/* Game Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-black/80 border-green-500/50 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">{score}</div>
                  <div className="text-sm text-green-300">HIGH SCORE</div>
                </div>
              </Card>
              <Card className="bg-black/80 border-green-500/50 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">{chompTokens}</div>
                  <div className="text-sm text-green-300">$CHOMP DATA</div>
                </div>
              </Card>
              <Card className="bg-black/80 border-green-500/50 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 font-mono">#1</div>
                  <div className="text-sm text-green-300">SYSTEM RANK</div>
                </div>
              </Card>
            </div>

            {/* Main Menu */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Button 
                  onClick={() => setIsPlaying(true)}
                  className="bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/30 hover:text-green-300 font-bold py-4 px-8 text-xl rounded-none font-mono transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/25"
                >
                  🐍 JACK IN
                </Button>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowLeaderboard(true)}
                    className="border-green-500 text-green-400 hover:bg-green-500/20 bg-black/50 font-mono rounded-none"
                  >
                    🏆 LEADERBOARD
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <GameBoard 
            onGameEnd={(finalScore) => {
              setScore(Math.max(score, finalScore));
              setChompTokens(chompTokens + Math.floor(finalScore / 10));
              setIsPlaying(false);
            }}
          />
        )}

        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}
      </div>

      <style jsx>{`
        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent);
          background-size: 20px 20px;
          animation: matrix-move 20s linear infinite;
        }
        
        @keyframes matrix-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default Index;
