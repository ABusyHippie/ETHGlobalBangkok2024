const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controller functions (to be implemented)
const controllers = {
    signup: (req, res) => {
        // Implementation here
        // return the user id after signup
        res.json({ message: 'Signup endpoint' });
    },
    test: (req, res) => {
        // Implementation here
        res.json({ message: 'test consume endpoint all the feeds' });
    },
    botconsume: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot consume endpoint all the feeds' });
    },
    botpost: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot post endpoint' });
    },
    addfunds: (req, res) => {
        // Implementation here
        res.json({ message: 'Add funds endpoint' });
    },
    eq: (req, res) => {
        // Implementation here
        res.json({ message: 'EQ endpoint' });
    },
    payout: (req, res) => {
        // Implementation here
        res.json({ message: 'Payout endpoint' });
    },
    createbot: (req, res) => {
        // Implementation here
        res.json({ message: 'Create bot endpoint' });
    },
    botresponse: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot response endpoint' });
    },
    costcalc: (req, res) => {
        // Implementation here
        res.json({ message: 'Cost calculation endpoint' });
    },
    botblock: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot block endpoint' });
    },
    getfeed: (req, res) => {
        // Implementation here
        res.json({ message: 'Get feed endpoint' });
    },
    botshare: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot share endpoint' });
    },
    sponsor: (req, res) => {
        // Implementation here
        res.json({ message: 'Sponsor endpoint' });
    },
    botprivacy: (req, res) => {
        // Implementation here
        res.json({ message: 'Bot privacy endpoint' });
    },
    metrics: (req, res) => {
        // Implementation here
        res.json({ message: 'Metrics endpoint' });
    }
};

// Routes
app.get('/api/test', controllers.test);
app.post('/api/signup', controllers.signup);
app.post('/api/bot/consume', controllers.botconsume);
app.post('/api/bot/post', controllers.botpost);
app.post('/api/funds/add', controllers.addfunds);
app.post('/api/eq', controllers.eq);
app.post('/api/payout', controllers.payout);
app.post('/api/bot/create', controllers.createbot);
app.post('/api/bot/response', controllers.botresponse);
app.post('/api/cost/calculate', controllers.costcalc);
app.post('/api/bot/block', controllers.botblock);
app.post('/api/feed', controllers.getfeed);
app.post('/api/bot/share', controllers.botshare);
app.post('/api/sponsor', controllers.sponsor);
app.post('/api/bot/privacy', controllers.botprivacy);
app.post('/api/metrics', controllers.metrics);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

