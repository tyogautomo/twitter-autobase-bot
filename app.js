const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const bot = new TwitterBot({
    consumer_key: 'AWVUXTDF6iS1cEUW7AFJr8ckg',
    consumer_secret: 'qsEZ4aQTgpmf5mVZK2UvvWBnciNcgYdBFLfDsQ1WTT3oFL30rx',
    access_token: '67367056-k1G6wUdkBC7rDkBHDLJ5shJTQFrDWJPqjUyIrbZQV',
    access_token_secret: 'fnjwJaPaI3O8svJKmwycoDviQh5xtU2CfGvPSnho0l41A',
    triggerWord: 'coy!'
});

const job = new CronJob(
    '*/2 * * * * *',
    doJob,
    null,
    false
);

async function doJob() {
    try {
        const authenticatedUserId = await bot.getAdminUserInfo();
        const message = await bot.getDirectMessage(authenticatedUserId);
        // console.log(JSON.stringify(message, null, 2), 'message <<<<<<<<<<<<<');
        if (message.id) {
            await bot.tweetMessage(message);
        } else {
            console.log('no tweet to post --------------------------');
        }
    } catch (error) {
        console.log(error);
        console.log('--------------- ERROR ------------------');
    }
};

app.get('/', (req, res, next) => {
    res.send('Welcome to twitter bot server!');
});

app.get('/trigger', async (req, res, next) => {
    job.fireOnTick();
    res.send('job triggered!');
});

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
