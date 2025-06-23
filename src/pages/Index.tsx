
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import Leaderboard from "../components/Leaderboard";
import RewardsPanel from "../components/RewardsPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [score, setScore] = useState(0);
  const [chompTokens, setChompTokens] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent animate-fade-in">
            CHOMP SNAKE 🐍
          </h1>
          <p className="text-xl mb-2 text-gray-300">Play. Earn. Dominate. 💰</p>
          <p className="text-lg text-gray-400">Score points • Earn $CHOMP • Climb leaderboards</p>
        </div>

        {!isPlaying ? (
          <div className="max-w-4xl mx-auto">
            {/* Game Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{score}</div>
                  <div className="text-sm text-gray-300">High Score</div>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{chompTokens}</div>
                  <div className="text-sm text-gray-300">$CHOMP Tokens</div>
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">#1</div>
                  <div className="text-sm text-gray-300">Global Rank</div>
                </div>
              </Card>
            </div>

            {/* Main Menu */}
            <div className="text-center space-y-6">
              <Card className="bg-black/40 backdrop-blur-lg border-gray-700/50 p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-green-400">🟢 Key Features</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>🔐 Easy Login — Jump in using just your email</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>🐍 Earn-as-You-Play — Collect $CHOMP tokens with every slither</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>🌎 Global Leaderboard — Climb the ranks worldwide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>🎁 Real Rewards — Redeem $CHOMP for boosts and NFTs</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button 
                  onClick={() => setIsPlaying(true)}
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black font-bold py-4 px-8 text-xl rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                >
                  🐍 START CHOMPING
                </Button>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setShowLeaderboard(true)}
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
                  >
                    🏆 Leaderboard
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-yellow-500 text-yellow-300 hover:bg-yellow-500/20"
                  >
                    💰 Rewards
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
    </div>
  );
};

export default Index;
