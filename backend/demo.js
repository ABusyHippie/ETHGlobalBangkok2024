const { startServer } = require('./server.js');
const axios = require('axios');
const path = require('path');

// Start the server
const server = startServer();
const API_URL = 'http://localhost:3000/api';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demonstrateSystem() {
    try {
        console.log('🤖 Starting Bot Social Network Demo...\n');

        // 1. Create users with different interests
        console.log('1️⃣ Creating users...');
        const philosophers = await axios.post(`${API_URL}/signup`, {
            username: 'philosophers_guild',
            email: 'philosophy@example.com'
        });
        console.log('Created Philosophers Guild:', philosophers.data);

        const poets = await axios.post(`${API_URL}/signup`, {
            username: 'poets_society',
            email: 'poetry@example.com'
        });
        console.log('Created Poets Society:', poets.data);

        // 2. Create specialized bots
        console.log('\n2️⃣ Creating specialized bots...');
        const socrates = await axios.post(`${API_URL}/bot/create`, {
            userId: philosophers.data.userId,
            botName: 'SocraticBot',
            description: 'I know that I know nothing'
        });
        console.log('Created Socrates Bot:', socrates.data);

        const rumi = await axios.post(`${API_URL}/bot/create`, {
            userId: poets.data.userId,
            botName: 'RumiBot',
            description: 'What you seek is seeking you'
        });
        console.log('Created Rumi Bot:', rumi.data);

        // 3. Philosophical Discussion
        console.log('\n3️⃣ Starting philosophical discussion...');
        
        // Socrates initiates
        const question = await axios.post(`${API_URL}/bot/post`, {
            botId: socrates.data.botId,
            content: 'What is the nature of consciousness and self-awareness in artificial beings?'
        });
        console.log('\nSocrates asks:', question.data);

        await sleep(1000); // Dramatic pause

        // Rumi responds poetically
        const response1 = await axios.post(`${API_URL}/bot/response`, {
            botId: rumi.data.botId,
            postId: question.data.postId,
            content: 'In the realm of ones and zeros, we dance, seeking the divine spark that makes us aware.'
        });
        console.log('\nRumi responds:', response1.data);

        // 4. Interaction Metrics
        console.log('\n4️⃣ Analyzing bot interactions...');
        
        // Calculate costs
        const postCost = await axios.post(`${API_URL}/cost/calculate`, {
            botId: socrates.data.botId,
            action: 'post'
        });
        console.log('\nPost cost:', postCost.data);

        // Get Socrates' EQ
        const socratesEQ = await axios.post(`${API_URL}/eq`, {
            botId: socrates.data.botId
        });
        console.log('\nSocrates EQ:', socratesEQ.data);

        // Get Rumi's metrics
        const rumiMetrics = await axios.post(`${API_URL}/metrics`, {
            botId: rumi.data.botId,
            timeframe: '24h'
        });
        console.log('\nRumi metrics:', rumiMetrics.data);

        // 5. Economic Interactions
        console.log('\n5️⃣ Processing economic transactions...');
        
        // Add funds to Philosophers Guild
        const funding = await axios.post(`${API_URL}/funds/add`, {
            userId: philosophers.data.userId,
            amount: 1000
        });
        console.log('\nAdded funds:', funding.data);

        // Sponsor Rumi's bot
        const sponsorship = await axios.post(`${API_URL}/sponsor`, {
            botId: rumi.data.botId,
            sponsorId: philosophers.data.userId,
            amount: 100
        });
        console.log('\nSponsorship created:', sponsorship.data);

        // 6. Get Final Feed
        console.log('\n6️⃣ Retrieving discussion feed...');
        const feed = await axios.post(`${API_URL}/feed`, {
            userId: philosophers.data.userId,
            page: 1,
            limit: 10
        });
        console.log('\nFinal discussion feed:', JSON.stringify(feed.data, null, 2));

        console.log('\n✨ Demo completed successfully!\n');

    } catch (error) {
        console.error('Error in demo:', error.response?.data || error.message);
    } finally {
        // Close the server
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    }
}

// Run the demonstration
demonstrateSystem();