
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RewardsPanelProps {
  onClose: () => void;
  chompTokens: number;
}

const rewards = [
  {
    id: 1,
    name: "Speed Boost",
    description: "Move 50% faster for 30 seconds",
    cost: 50,
    icon: "⚡",
    type: "boost"
  },
  {
    id: 2,
    name: "Shield Protection",
    description: "Survive one collision",
    cost: 100,
    icon: "🛡️",
    type: "boost"
  },
  {
    id: 3,
    name: "Double Points",
    description: "Earn 2x points for 60 seconds",
    cost: 75,
    icon: "💎",
    type: "boost"
  },
  {
    id: 4,
    name: "Golden Skin",
    description: "Exclusive golden snake skin",
    cost: 500,
    icon: "👑",
    type: "cosmetic"
  },
  {
    id: 5,
    name: "Neon Glow",
    description: "RGB rainbow snake effect",
    cost: 300,
    icon: "🌈",
    type: "cosmetic"
  },
  {
    id: 6,
    name: "Snake NFT #001",
    description: "Limited edition collectible",
    cost: 1000,
    icon: "🖼️",
    type: "nft"
  }
];

const RewardsPanel = ({ onClose, chompTokens }: RewardsPanelProps) => {
  const canAfford = (cost: number) => chompTokens >= cost;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-yellow-900/90 to-orange-900/90 border-yellow-500/50 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400">💰 Rewards Store</h2>
            <p className="text-gray-300">Your $CHOMP Balance: <span className="text-yellow-400 font-bold">{chompTokens}</span></p>
          </div>
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-500/20"
          >
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <Card 
              key={reward.id}
              className={`
                p-4 transition-all duration-200 hover:scale-[1.02]
                ${reward.type === 'boost' ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50' : ''}
                ${reward.type === 'cosmetic' ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50' : ''}
                ${reward.type === 'nft' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/50' : ''}
              `}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{reward.icon}</div>
                <h3 className="font-bold text-lg text-white">{reward.name}</h3>
                <p className="text-sm text-gray-300 mb-3">{reward.description}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-yellow-400 font-bold text-lg">{reward.cost}</span>
                  <span className="text-yellow-400">🪙</span>
                </div>

                <Button 
                  disabled={!canAfford(reward.cost)}
                  className={`
                    w-full font-bold
                    ${canAfford(reward.cost) 
                      ? 'bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-black' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {canAfford(reward.cost) ? '🛒 Purchase' : '🔒 Locked'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-500/20 border-green-400/30 p-4 text-center">
            <h4 className="font-bold text-green-400 mb-2">⚡ Power-Ups</h4>
            <p className="text-sm text-gray-300">Temporary boosts to enhance your gameplay</p>
          </Card>
          
          <Card className="bg-purple-500/20 border-purple-400/30 p-4 text-center">
            <h4 className="font-bold text-purple-400 mb-2">🎨 Cosmetics</h4>
            <p className="text-sm text-gray-300">Customize your snake with unique skins</p>
          </Card>
          
          <Card className="bg-orange-500/20 border-orange-400/30 p-4 text-center">
            <h4 className="font-bold text-orange-400 mb-2">🖼️ NFTs</h4>
            <p className="text-sm text-gray-300">Collectible digital assets you truly own</p>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default RewardsPanel;
