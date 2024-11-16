"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { Bot, StoredBot } from "../../components/bots/types/BotTypes";
import { BotForm } from "../../components/bots/BotForm";
import { BotCard } from "../../components/bots/BotCard";
import { BotCreationSuccess } from "../../components/bots/BotCreationSuccess";

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
        {/* Form Section */}
        <div className="lg:w-1/3">
          <h1 className="text-4xl font-bold mb-8">Create Your Bot</h1>
          <div style={stickyFormStyles}>
            {!isCreated ? (
              <BotForm bot={bot} setBot={setBot} onSubmit={handleSubmit} />
            ) : (
              <BotCreationSuccess bot={bot} onCreateAnother={() => setIsCreated(false)} />
            )}
          </div>
        </div>

        {/* Bot Collection Section */}
        <div className="lg:w-2/3">
          {storedBots.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Your Bot Collection</h2>
              <div className="grid gap-6 max-h-[800px] overflow-y-auto pr-4">
                {storedBots.map((storedBot) => (
                  <BotCard 
                    key={storedBot.id} 
                    bot={storedBot} 
                    onDelete={handleDeleteBot} 
                  />
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
