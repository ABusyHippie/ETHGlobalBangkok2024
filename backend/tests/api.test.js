process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../index.js');
const { db } = require('../index.js');

describe('API Endpoints', () => {
    let userId;
    let secondUserId;
    let botId;
    let secondBotId;
    let postId;

    // User Management Tests
    describe('User Management', () => {
        test('POST /api/signup - Should create new user successfully', async () => {
            const res = await request(app)
                .post('/api/signup')
                .send({
                    username: 'testuser',
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('userId');
            userId = res.body.userId;
        });

        test('POST /api/signup - Should fail with missing data', async () => {
            const res = await request(app)
                .post('/api/signup')
                .send({
                    username: 'testuser'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('POST /api/signup - Create second user for interaction tests', async () => {
            const res = await request(app)
                .post('/api/signup')
                .send({
                    username: 'testuser2',
                    email: 'test2@example.com'
                });

            secondUserId = res.body.userId;
            expect(res.statusCode).toBe(200);
        });
    });

    // Bot Management Tests
    describe('Bot Management', () => {
        test('POST /api/bot/create - Should create new bot successfully', async () => {
            const res = await request(app)
                .post('/api/bot/create')
                .send({
                    userId,
                    botName: 'TestBot',
                    description: 'A test bot',
                    isPublic: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('botId');
            botId = res.body.botId;
        });

        test('POST /api/bot/create - Should fail with invalid user', async () => {
            const res = await request(app)
                .post('/api/bot/create')
                .send({
                    userId: 'invalid-user-id',
                    botName: 'TestBot'
                });

            expect(res.statusCode).toBe(404);
        });

        test('POST /api/bot/create - Create second bot for interaction tests', async () => {
            const res = await request(app)
                .post('/api/bot/create')
                .send({
                    userId: secondUserId,
                    botName: 'TestBot2',
                    description: 'Another test bot'
                });

            secondBotId = res.body.botId;
            expect(res.statusCode).toBe(200);
        });
    });

    // Bot Posting and Interaction Tests
    describe('Bot Interactions', () => {
        test('POST /api/bot/post - Should create new post successfully', async () => {
            const res = await request(app)
                .post('/api/bot/post')
                .send({
                    botId,
                    content: 'Hello, world!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('postId');
            expect(res.body).toHaveProperty('content');
            postId = res.body.postId;
        }, 15000);

        test('POST /api/bot/response - Should add response to post', async () => {
            const res = await request(app)
                .post('/api/bot/response')
                .send({
                    botId: secondBotId,
                    postId,
                    content: 'Hello back!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('replyId');
        });

        test('POST /api/bot/share - Should share bot successfully', async () => {
            const res = await request(app)
                .post('/api/bot/share')
                .send({
                    botId,
                    targetBotId: secondBotId
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain('successfully');
        });
    });

    // Feed and Content Tests
    describe('Feed Management', () => {
        test('POST /api/feed - Should get feed with correct pagination', async () => {
            const res = await request(app)
                .post('/api/feed')
                .send({
                    userId,
                    page: 1,
                    limit: 10
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('posts');
            expect(res.body).toHaveProperty('page');
            expect(res.body).toHaveProperty('hasMore');
            expect(Array.isArray(res.body.posts)).toBeTruthy();
        });

        test('POST /api/feed - Should handle empty page correctly', async () => {
            const res = await request(app)
                .post('/api/feed')
                .send({
                    userId,
                    page: 999,
                    limit: 10
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.posts).toHaveLength(0);
            expect(res.body.hasMore).toBeFalsy();
        });
    });

    // Error Handling Tests
    describe('Error Handling', () => {
        test('Should handle invalid bot ID', async () => {
            const res = await request(app)
                .post('/api/bot/post')
                .send({
                    botId: 'invalid-bot-id',
                    content: 'This should fail'
                });

            expect(res.statusCode).toBe(404);
        });

        test('Should handle invalid post ID', async () => {
            const res = await request(app)
                .post('/api/bot/response')
                .send({
                    botId,
                    postId: 'invalid-post-id',
                    content: 'This should fail'
                });

            expect(res.statusCode).toBe(404);
        });

        test('Should handle missing required fields', async () => {
            const res = await request(app)
                .post('/api/bot/post')
                .send({
                    botId
                    // missing content
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // Financial Management Tests
    describe('Financial Management', () => {
        test('POST /api/funds/add - Should add funds to user account', async () => {
            const res = await request(app)
                .post('/api/funds/add')
                .send({
                    userId,
                    amount: 50
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.credits).toBe(150); // 100 initial + 50 added
            expect(res.body.message).toContain('successfully');
        });

        test('POST /api/payout - Should process bot payout', async () => {
            const res = await request(app)
                .post('/api/payout')
                .send({
                    botId,
                    amount: 25
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.credits).toBe(175); // 150 previous + 25 payout
        });

        test('POST /api/cost/calculate - Should calculate action costs', async () => {
            const actions = ['post', 'response', 'share', 'consume'];
            
            for (const action of actions) {
                const res = await request(app)
                    .post('/api/cost/calculate')
                    .send({
                        botId,
                        action
                    });

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('cost');
                expect(typeof res.body.cost).toBe('number');
            }
        });
    });

    // Bot Analytics Tests
    describe('Bot Analytics', () => {
        test('POST /api/eq - Should calculate emotional quotient', async () => {
            const res = await request(app)
                .post('/api/eq')
                .send({
                    botId
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.eq).toHaveProperty('engagement');
            expect(res.body.eq).toHaveProperty('sentiment');
            expect(res.body.eq).toHaveProperty('empathy');
        });

        test('POST /api/metrics - Should get bot metrics', async () => {
            const res = await request(app)
                .post('/api/metrics')
                .send({
                    botId,
                    timeframe: '24h'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.metrics).toHaveProperty('totalPosts');
            expect(res.body.metrics).toHaveProperty('totalInteractions');
            expect(res.body.metrics).toHaveProperty('engagement');
            expect(res.body.metrics).toHaveProperty('popularity');
        });
    });

    // Bot Interaction Tests
    describe('Advanced Bot Interactions', () => {
        test('POST /api/bot/consume - Should record content consumption', async () => {
            const res = await request(app)
                .post('/api/bot/consume')
                .send({
                    botId,
                    targetBotId: secondBotId
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain('successfully');
        });

        test('POST /api/bot/block - Should block target bot', async () => {
            const res = await request(app)
                .post('/api/bot/block')
                .send({
                    botId,
                    targetBotId: secondBotId
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain('blocked successfully');

            // Verify the block is recorded
            const bot = db.bots.get(botId);
            expect(bot.blocked).toContain(secondBotId);
        });

        test('POST /api/bot/privacy - Should update privacy settings', async () => {
            const settings = {
                isPublic: false,
                allowDirectMessages: false,
                showActivity: true
            };

            const res = await request(app)
                .post('/api/bot/privacy')
                .send({
                    botId,
                    settings
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('privacy');
            expect(res.body.privacy).toMatchObject(settings);
        });
    });

    // Sponsorship Tests
    describe('Sponsorship Management', () => {
        test('POST /api/sponsor - Should create sponsorship', async () => {
            const res = await request(app)
                .post('/api/sponsor')
                .send({
                    botId,
                    sponsorId: secondUserId,
                    amount: 100
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('sponsorship');
            expect(res.body.sponsorship).toHaveProperty('id');
            expect(res.body.sponsorship.amount).toBe(100);
            expect(res.body.sponsorship.status).toBe('active');
        });

        test('POST /api/sponsor - Should fail with invalid amount', async () => {
            const res = await request(app)
                .post('/api/sponsor')
                .send({
                    botId,
                    sponsorId: secondUserId,
                    amount: -50 // Invalid negative amount
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // Error Cases for New Endpoints
    describe('Advanced Error Handling', () => {
        test('Should handle invalid timeframe in metrics', async () => {
            const res = await request(app)
                .post('/api/metrics')
                .send({
                    botId,
                    timeframe: 'invalid'
                });

            expect(res.statusCode).toBe(200); // Still returns default 24h
            expect(res.body.metrics.timeframe).toBe('24h');
        });

        test('Should handle missing settings in privacy update', async () => {
            const res = await request(app)
                .post('/api/bot/privacy')
                .send({
                    botId
                    // Missing settings
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        test('Should handle invalid sponsorship amount', async () => {
            const res = await request(app)
                .post('/api/sponsor')
                .send({
                    botId,
                    sponsorId: secondUserId,
                    amount: 'invalid'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    // Cleanup helper function
    afterAll(async () => {
        // Clear in-memory database after tests
        db.users.clear();
        db.bots.clear();
        db.posts.clear();
        db.interactions.clear();
    });
}); 