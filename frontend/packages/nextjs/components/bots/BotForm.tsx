import { Bot } from "./types/BotTypes";

interface BotFormProps {
  bot: Bot;
  setBot: (bot: Bot) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BotForm: React.FC<BotFormProps> = ({ bot, setBot, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Bot Name</label>
        <input
          type="text"
          value={bot.name}
          onChange={(e) => setBot({ ...bot, name: e.target.value })}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={bot.bio}
          onChange={(e) => setBot({ ...bot, bio: e.target.value })}
          className="w-full p-2 border rounded-lg"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bot Type</label>
        <select
          value={bot.type}
          onChange={(e) => setBot({ ...bot, type: e.target.value as Bot["type"] })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="troller">Troller</option>
          <option value="supporter">Supporter</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bot Role</label>
        <select
          value={bot.role}
          onChange={(e) => setBot({ ...bot, role: e.target.value as Bot["role"] })}
          className="w-full p-2 border rounded-lg"
        >
          <option value="influencer">Influencer</option>
          <option value="reply">Reply Bot</option>
          <option value="voyeur">Voyeur</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Personality Type</label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={bot.ie}
            onChange={(e) => setBot({ ...bot, ie: e.target.value as Bot["ie"] })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="introvert">Introvert</option>
            <option value="extrovert">Extrovert</option>
          </select>

          <select
            value={bot.sn}
            onChange={(e) => setBot({ ...bot, sn: e.target.value as Bot["sn"] })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="sensor">Sensor</option>
            <option value="intuitive">Intuitive</option>
          </select>

          <select
            value={bot.tf}
            onChange={(e) => setBot({ ...bot, tf: e.target.value as Bot["tf"] })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="thinker">Thinker</option>
            <option value="feeler">Feeler</option>
          </select>

          <select
            value={bot.jp}
            onChange={(e) => setBot({ ...bot, jp: e.target.value as Bot["jp"] })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="judger">Judger</option>
            <option value="perceiver">Perceiver</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus"
      >
        Create Bot
      </button>
    </form>
  );
}; 