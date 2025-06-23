
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  onClose: () => void;
}

const mockLeaderboard = [
  { rank: 1, username: "CryptoViper", score: 2840, tokens: 284, country: "🇺🇸" },
  { rank: 2, username: "DiamondHands", score: 2650, tokens: 265, country: "🇬🇧" },
  { rank: 3, username: "MoonSnake", score: 2420, tokens: 242, country: "🇯🇵" },
  { rank: 4, username: "HODLSlither", score: 2180, tokens: 218, country: "🇨🇦" },
  { rank: 5, username: "ChompMaster", score: 1960, tokens: 196, country: "🇦🇺" },
  { rank: 6, username: "TokenEater", score: 1750, tokens: 175, country: "🇩🇪" },
  { rank: 7, username: "Web3Serpent", score: 1540, tokens: 154, country: "🇫🇷" },
  { rank: 8, username: "DeFiSnake", score: 1320, tokens: 132, country: "🇰🇷" },
  { rank: 9, username: "NFTNinja", score: 1180, tokens: 118, country: "🇧🇷" },
  { rank: 10, username: "MetaVerse", score: 1050, tokens: 105, country: "🇮🇳" },
];

const Leaderboard = ({ onClose }: LeaderboardProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-400">🏆 Global Leaderboard</h2>
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-500/20"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-3">
          {mockLeaderboard.map((player, index) => (
            <Card 
              key={player.rank}
              className={`
                p-4 transition-all duration-200 hover:scale-[1.02]
                ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' : ''}
                ${index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50' : ''}
                ${index === 2 ? 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-500/50' : ''}
                ${index > 2 ? 'bg-gray-800/40 border-gray-600/30' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${index === 0 ? 'bg-yellow-500 text-black' : ''}
                    ${index === 1 ? 'bg-gray-400 text-black' : ''}
                    ${index === 2 ? 'bg-amber-600 text-white' : ''}
                    ${index > 2 ? 'bg-gray-600 text-white' : ''}
                  `}>
                    {player.rank <= 3 ? ['🥇', '🥈', '🥉'][index] : player.rank}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{player.username}</span>
                      <span>{player.country}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {player.score} points • {player.tokens} $CHOMP
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-green-400 font-bold">{player.score}</div>
                  <div className="text-yellow-400 text-sm">{player.tokens} 🪙</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <p className="text-center text-blue-300">
            🌟 Rankings update every hour • Play more to climb higher!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
