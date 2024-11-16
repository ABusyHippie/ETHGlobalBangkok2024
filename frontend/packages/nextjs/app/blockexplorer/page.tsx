"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";

interface Bot {
  name: string;
  bio: string;
  type: "supporter" | "troller";
  role: "influencer" | "reply" | "voyeur";
  ie: "introvert" | "extrovert";
  sn: "sensor" | "intuitive";
  tf: "thinker" | "feeler";
  jp: "judger" | "perceiver";
}

interface StoredBot extends Bot {
  id: string;
  createdAt: string;
}

const stickyFormStyles = {
  position: 'sticky',
  top: '2rem',
  height: 'fit-content'
} as const;

const BotCreator: NextPage = () => {
  const [bot, setBot] = useState<Bot>({
    name: "",
    bio: "",
    type: "troller",
    role: "influencer",
    ie: "introvert",
    sn: "sensor",
    tf: "thinker",
    jp: "judger"
  });
  const [isCreated, setIsCreated] = useState(false);
  const [storedBots, setStoredBots] = useState<StoredBot[]>([]);

  useEffect(() => {
    const savedBots = localStorage.getItem('createdBots');
    if (savedBots) {
      setStoredBots(JSON.parse(savedBots));
    }
  }, []);

  const calculateMBTI = (bot: Bot): string => {
    const i_e = bot.ie === "introvert" ? "I" : "E";
    const s_n = bot.sn === "sensor" ? "S" : "N";
    const t_f = bot.tf === "thinker" ? "T" : "F";
    const j_p = bot.jp === "judger" ? "J" : "P";
    return `${i_e}${s_n}${t_f}${j_p}`;
  };

  const getMBTIDescription = (type: string): string => {
    const descriptions: { [key: string]: string } = {
      'ISTJ': 'The Logistician - Practical and fact-minded individuals, whose reliability cannot be doubted.',
      'ISFJ': 'The Defender - Very dedicated and warm protectors, always ready to defend their loved ones.',
      'INFJ': 'The Advocate - Quiet and mystical, yet very inspiring and tireless idealists.',
      'INTJ': 'The Architect - Imaginative and strategic thinkers, with a plan for everything.',
      'ISTP': 'The Virtuoso - Bold and practical experimenters, masters of all kinds of tools.',
      'ISFP': 'The Adventurer - Flexible and charming artists, always ready to explore and experience something new.',
      'INFP': 'The Mediator - Poetic, kind and altruistic people, always eager to help a good cause.',
      'INTP': 'The Logician - Innovative inventors with an unquenchable thirst for knowledge.',
      'ESTP': 'The Entrepreneur - Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
      'ESFP': 'The Entertainer - Spontaneous, energetic and enthusiastic entertainers who love life.',
      'ENFP': 'The Campaigner - Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
      'ENTP': 'The Debater - Smart and curious thinkers who cannot resist an intellectual challenge.',
      'ESTJ': 'The Executive - Excellent administrators, unsurpassed at managing things or people.',
      'ESFJ': 'The Consul - Extraordinarily caring, social and popular people, always eager to help.',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners.',
      'ENTJ': 'The Commander - Bold, imaginative and strong-willed leaders, always finding a way or making one.'
    };
    return descriptions[type] || 'Personality type description not found';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBot: StoredBot = {
      ...bot,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    const updatedBots = [...storedBots, newBot];
    setStoredBots(updatedBots);
    localStorage.setItem('createdBots', JSON.stringify(updatedBots));
    
    setIsCreated(true);
  };

  const handleDeleteBot = (id: string) => {
    const updatedBots = storedBots.filter(bot => bot.id !== id);
    setStoredBots(updatedBots);
    localStorage.setItem('createdBots', JSON.stringify(updatedBots));
  };

  return (
    <div className="container mx-auto my-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Form */}
        <div className="lg:w-1/3">
          <h1 className="text-4xl font-bold mb-8">Create Your Bot</h1>
          <div style={stickyFormStyles}>
            {!isCreated ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="block text-sm font-medium mb-2">Bot Bio</label>
                  <textarea
                    value={bot.bio}
                    onChange={(e) => setBot({ ...bot, bio: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
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
                    <option value="supporter">Supporter</option>
                    <option value="troller">Troller</option>
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
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-focus"
                >
                  Create Bot
                </button>
              </form>
            ) : (
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
                  onClick={() => setIsCreated(false)}
                  className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-focus mt-4"
                >
                  Create Another Bot
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Bot Collection */}
        <div className="lg:w-2/3">
          {storedBots.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Your Bot Collection</h2>
              <div className="grid gap-6 max-h-[800px] overflow-y-auto pr-4">
                {storedBots.map((storedBot) => (
                  <div 
                    key={storedBot.id} 
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
                        <h3 className="text-3xl font-bold text-gray-100 mb-2">{storedBot.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
                            {calculateMBTI(storedBot)}
                          </span>
                          <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
                            {getMBTIDescription(calculateMBTI(storedBot)).split('-')[0]}
                          </span>
                          <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
                            {storedBot.type}
                          </span>
                          <span className="px-2 py-1 bg-gray-700 text-gray-100 rounded-full text-sm font-medium">
                            {storedBot.role}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBot(storedBot.id)}
                        className="text-2xl text-gray-300 hover:text-red-400 transition-colors duration-200 
                        w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
                      >
                        ×
                      </button>
                    </div>

                    {/* Bot Bio */}
                    <div className="mb-4">
                      <p className="text-sm leading-relaxed text-gray-400">
                        {getMBTIDescription(calculateMBTI(storedBot))}
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
                        <p className="text-base leading-relaxed text-gray-300">{storedBot.bio}</p>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div className="flex gap-2 text-gray-300">
                        <span className="font-medium">{storedBot.ie}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{storedBot.sn}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{storedBot.tf}</span>
                        <span className="text-gray-500">•</span>
                        <span className="font-medium">{storedBot.jp}</span>
                      </div>
                      <span className="font-medium text-gray-300">
                        {new Date(storedBot.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotCreator;
