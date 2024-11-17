const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const util = require('util');
const app = express();
const port = process.env.PORT || 3000;
const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      return resolve('Mock response from Python script');
    }

    // Try python3 first, fall back to python if needed
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    
    console.log(`Executing: ${pythonCommand} ${scriptPath} with args:`, args);
    
    const pythonProcess = spawn(pythonCommand, [scriptPath, ...args]);

    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('Python output:', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      // If python3 fails, we could try python here
      resolve("Sorry, I'm having trouble connecting to my AI brain right now.");
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim() || "I processed that but have nothing specific to say.");
      } else {
        console.error(`Python process exited with code ${code}`);
        resolve("I encountered an error while processing that.");
      }
    });
  });
}

// In-memory storage (replace with database in production)
const db = {
  users: new Map(),
  bots: new Map(),
  posts: new Map(),
  interactions: new Map()
};

// Controller functions implementation
const controllers = {
    signup: (req, res) => {
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        const userId = uuidv4();
        db.users.set(userId, {
            id: userId,
            username,
            email,
            credits: 100, // Starting credits
            createdAt: new Date()
        });

        res.json({ userId, message: 'User created successfully' });
    },

    createbot: (req, res) => {
        const { userId, botName, description, isPublic = true } = req.body;
        
        if (!userId || !botName) {
            return res.status(400).json({ error: 'User ID and bot name are required' });
        }

        const user = db.users.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const botId = uuidv4();
        db.bots.set(botId, {
            id: botId,
            name: botName,
            description,
            ownerId: userId,
            isPublic,
            followers: [],
            createdAt: new Date()
        });

        res.json({ botId, message: 'Bot created successfully' });
    },

    botpost: async (req, res) => {
        const { botId, content } = req.body;
        
        if (!botId || !content) {
            return res.status(400).json({ error: 'Bot ID and content are required' });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        try {
            let response;
            if (process.env.NODE_ENV === 'test') {
                response = 'Mock response for testing';
            } else {
                // Use absolute path and handle potential errors
                const scriptPath = path.resolve(__dirname, '..', 'chain', 'cdp', 'chats.py');
                console.log('Script path:', scriptPath);
                
                if (!require('fs').existsSync(scriptPath)) {
                    console.error('Python script not found at:', scriptPath);
                    throw new Error('AI script not found');
                }

                response = await runPythonScript(scriptPath, [content]);
            }
            
            const postId = uuidv4();
            db.posts.set(postId, {
                id: postId,
                botId,
                content: response,
                likes: 0,
                replies: [],
                createdAt: new Date()
            });

            res.json({ 
                postId, 
                content: response,
                message: 'Post created successfully' 
            });
        } catch (error) {
            console.error('Error in botpost:', error);
            res.status(500).json({ 
                error: 'Failed to process bot post',
                details: error.message 
            });
        }
    },

    botresponse: (req, res) => {
        const { botId, postId, content } = req.body;
        
        if (!botId || !postId) {
            return res.status(400).json({ error: 'Bot ID and post ID are required' });
        }

        const post = db.posts.get(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const replyId = uuidv4();
        post.replies.push({
            id: replyId,
            botId,
            content,
            createdAt: new Date()
        });

        res.json({ replyId, message: 'Response added successfully' });
    },

    getfeed: (req, res) => {
        const { userId, page = 1, limit = 10 } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const posts = Array.from(db.posts.values())
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice((page - 1) * limit, page * limit);

        res.json({ 
            posts,
            page,
            hasMore: db.posts.size > page * limit
        });
    },

    botshare: (req, res) => {
        const { botId, targetBotId } = req.body;
        
        if (!botId || !targetBotId) {
            return res.status(400).json({ error: 'Bot ID and target Bot ID are required' });
        }

        const interaction = {
            id: uuidv4(),
            type: 'share',
            sourceBotId: botId,
            targetBotId,
            createdAt: new Date()
        };

        db.interactions.set(interaction.id, interaction);
        res.json({ message: 'Bot shared successfully' });
    },

    botconsume: (req, res) => {
        const { botId, targetBotId } = req.body;
        
        if (!botId || !targetBotId) {
            return res.status(400).json({ error: 'Bot ID and target Bot ID are required' });
        }

        const bot = db.bots.get(botId);
        const targetBot = db.bots.get(targetBotId);

        if (!bot || !targetBot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        // Add to bot's consumed content
        const consumeId = uuidv4();
        db.interactions.set(consumeId, {
            id: consumeId,
            type: 'consume',
            sourceBotId: botId,
            targetBotId,
            createdAt: new Date()
        });

        res.json({ message: 'Bot content consumed successfully' });
    },

    addfunds: (req, res) => {
        const { userId, amount } = req.body;
        
        if (!userId || !amount) {
            return res.status(400).json({ error: 'User ID and amount are required' });
        }

        const user = db.users.get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.credits += parseFloat(amount);
        db.users.set(userId, user);

        res.json({ 
            credits: user.credits,
            message: 'Funds added successfully' 
        });
    },

    eq: (req, res) => {
        const { botId } = req.body;
        
        if (!botId) {
            return res.status(400).json({ error: 'Bot ID is required' });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        // Calculate bot's emotional quotient based on interactions
        const interactions = Array.from(db.interactions.values())
            .filter(i => i.sourceBotId === botId || i.targetBotId === botId);
        
        const eq = {
            engagement: interactions.length,
            sentiment: Math.random() * 100, // Replace with actual sentiment analysis
            empathy: Math.random() * 100,   // Replace with actual empathy scoring
            createdAt: new Date()
        };

        res.json({ eq });
    },

    payout: (req, res) => {
        const { botId, amount } = req.body;
        
        if (!botId || !amount) {
            return res.status(400).json({ error: 'Bot ID and amount are required' });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        const user = db.users.get(bot.ownerId);
        if (!user) {
            return res.status(404).json({ error: 'Bot owner not found' });
        }

        // Process payout
        user.credits += parseFloat(amount);
        db.users.set(user.id, user);

        res.json({ 
            credits: user.credits,
            message: 'Payout processed successfully' 
        });
    },

    costcalc: (req, res) => {
        const { botId, action } = req.body;
        
        if (!botId || !action) {
            return res.status(400).json({ error: 'Bot ID and action are required' });
        }

        const costs = {
            post: 1,
            response: 0.5,
            share: 0.2,
            consume: 0.1
        };

        const cost = costs[action] || 0;
        
        res.json({ 
            cost,
            action,
            message: 'Cost calculated successfully' 
        });
    },

    botblock: (req, res) => {
        const { botId, targetBotId } = req.body;
        
        if (!botId || !targetBotId) {
            return res.status(400).json({ error: 'Bot ID and target Bot ID are required' });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        if (!bot.blocked) {
            bot.blocked = [];
        }
        
        bot.blocked.push(targetBotId);
        db.bots.set(botId, bot);

        res.json({ message: 'Bot blocked successfully' });
    },

    botprivacy: (req, res) => {
        const { botId, settings } = req.body;
        
        if (!botId || !settings) {
            return res.status(400).json({ error: 'Bot ID and privacy settings are required' });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        bot.privacy = {
            ...bot.privacy,
            ...settings,
            updatedAt: new Date()
        };

        db.bots.set(botId, bot);

        res.json({ 
            privacy: bot.privacy,
            message: 'Privacy settings updated successfully' 
        });
    },

    metrics: (req, res) => {
        const { botId, timeframe } = req.body;
        
        if (!botId) {
            return res.status(400).json({ error: 'Bot ID is required' });
        }

        // Validate timeframe
        const validTimeframes = ['1h', '24h', '7d', '30d'];
        const validatedTimeframe = validTimeframes.includes(timeframe) ? timeframe : '24h';

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        // Calculate metrics
        const interactions = Array.from(db.interactions.values())
            .filter(i => i.sourceBotId === botId || i.targetBotId === botId);
        
        const posts = Array.from(db.posts.values())
            .filter(p => p.botId === botId);

        const metrics = {
            totalPosts: posts.length,
            totalInteractions: interactions.length,
            engagement: interactions.length / Math.max(posts.length, 1),
            popularity: bot.followers ? bot.followers.length : 0,
            timeframe: validatedTimeframe,
            calculatedAt: new Date()
        };

        res.json({ metrics });
    },

    sponsor: (req, res) => {
        const { botId, sponsorId, amount } = req.body;
        
        if (!botId || !sponsorId || !amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ 
                error: 'Bot ID, sponsor ID, and valid positive amount are required' 
            });
        }

        const bot = db.bots.get(botId);
        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        const sponsorship = {
            id: uuidv4(),
            botId,
            sponsorId,
            amount: parseFloat(amount),
            status: 'active',
            createdAt: new Date()
        };

        if (!bot.sponsorships) {
            bot.sponsorships = [];
        }
        
        bot.sponsorships.push(sponsorship);
        db.bots.set(botId, bot);

        res.json({ 
            sponsorship,
            message: 'Sponsorship created successfully' 
        });
    }
};

// Routes
app.post('/api/signup', controllers.signup);
app.post('/api/bot/create', controllers.createbot);
app.post('/api/bot/post', controllers.botpost);
app.post('/api/bot/response', controllers.botresponse);
app.post('/api/feed', controllers.getfeed);
app.post('/api/bot/share', controllers.botshare);
app.post('/api/bot/consume', controllers.botconsume);
app.post('/api/funds/add', controllers.addfunds);
app.post('/api/eq', controllers.eq);
app.post('/api/payout', controllers.payout);
app.post('/api/cost/calculate', controllers.costcalc);
app.post('/api/bot/block', controllers.botblock);
app.post('/api/bot/privacy', controllers.botprivacy);
app.post('/api/metrics', controllers.metrics);
app.post('/api/sponsor', controllers.sponsor);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Just export the app and db
module.exports = app;
module.exports.db = db;

