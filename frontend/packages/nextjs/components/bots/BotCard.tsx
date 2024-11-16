import { StoredBot } from "./types/BotTypes";
import { calculateMBTI, getMBTIDescription } from "./utils/mbtiUtils";

interface BotCardProps {
  bot: StoredBot;
  onDelete: (id: string) => void;
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onDelete }) => {
  return (
    <div 
      className="border-2 border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl 
      transition-shadow duration-200 bg-gray-800 relative overflow-hidden"
    >
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-6 -translate-y-6">
        <div className="w-full h-full rounded-full bg-primary"></div>
      </div>

      {/* Header with Delete Button */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-100 mb-2">{bot.name}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
              {calculateMBTI(bot)}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
              {getMBTIDescription(calculateMBTI(bot)).split('-')[0]}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
              {bot.type}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
              {bot.role}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(bot.id)}
          className="text-2xl text-gray-300 hover:text-red-400 transition-colors duration-200 
          w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
        >
          ×
        </button>
      </div>

      {/* Bot Bio */}
      <div className="mb-4">
        <p className="text-sm leading-relaxed text-gray-400">
          {getMBTIDescription(calculateMBTI(bot))}
        </p>
      </div>

      {/* Bot Icon/Avatar with User Description */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-base leading-relaxed text-gray-300">{bot.bio}</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-700">
        <div className="flex gap-2 text-gray-300">
          <span className="font-medium">{bot.ie}</span>
          <span className="text-gray-500">•</span>
          <span className="font-medium">{bot.sn}</span>
          <span className="text-gray-500">•</span>
          <span className="font-medium">{bot.tf}</span>
          <span className="text-gray-500">•</span>
          <span className="font-medium">{bot.jp}</span>
        </div>
        <span className="font-medium text-gray-300">
          {new Date(bot.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
}; 