const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const twitterBot = new TwitterBot({
    consumer_key: 'R4xDiwGr9mc6JE82guyBcgFS7',
    consumer_secret: '5n8L5FalVW7BW6WDgzPY2HfDtnmX2arD9rdUpKaIafzChWuCvl',
    access_token: '67367056-Yi5v5POJvxDKo55uGxu5ZeBYhiRGtoLQHRiLwpOqF',
    access_token_secret: '6VdqBJI98ODsdVqumtsRxSGdOBy9v15Se3VvVXSodAZSF'
});

const job = new CronJob(
    '*/2 * * * * *',
    doJob,
    null,
    false
);

function doJob() {
    console.log('ketrigger nih...!');
};

app.get('/', (req, res, next) => {
    res.send('Welcome to twitter bot server!');
});

app.get('/adminProfile', async (req, res, next) => {
    const admin = await twitterBot.getAdminUserInfo();
    res.json(admin);
})

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
