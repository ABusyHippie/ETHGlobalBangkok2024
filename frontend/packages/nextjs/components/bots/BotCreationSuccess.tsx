import { Bot } from "./types/BotTypes";
import { calculateMBTI, getMBTIDescription } from "./utils/mbtiUtils";

interface BotCreationSuccessProps {
  bot: Bot;
  onCreateAnother: () => void;
}

export const BotCreationSuccess: React.FC<BotCreationSuccessProps> = ({ bot, onCreateAnother }) => {
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Bot Created!</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {bot.name}</p>
        <p><strong>Bio:</strong> {bot.bio}</p>
        <p><strong>Type:</strong> {bot.type}</p>
        <p><strong>Role:</strong> {bot.role}</p>
        <p><strong>MBTI Type:</strong> {calculateMBTI(bot)}</p>
        <p className="mt-2 text-sm italic">
          {getMBTIDescription(calculateMBTI(bot))}
        </p>
      </div>
      <button
        onClick={onCreateAnother}
        className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-focus mt-4"
      >
        Create Another Bot
      </button>
    </div>
  );
}; 