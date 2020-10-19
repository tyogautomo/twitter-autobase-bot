const express = require('express');
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const twitterBot = new TwitterBot({
    consumer_key: 'asd',
    consumer_secret: 'asd',
    access_token: 'asd',
    access_token_secret: 'asd'
})

app.get('/', (req, res, next) => {
    res.send('Welcome to twitter bot server!');
});

app.get('/adminProfile', async (req, res, next) => {
    const admin = await twitterBot.getAdminUserInfo();
    res.json(admin);
})

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
