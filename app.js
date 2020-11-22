const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const bot = new TwitterBot({
    consumer_key: '4R9xbtXupliOSyd4ojflD43q4',
    consumer_secret: 'xDrLsdr0g3OUMmbgow7R5ysoceKVqAkMh5JmuuKFdrSF7uxbGD',
    access_token: '67367056-cyKkhqLBZpU8UrGE326tPCTaDhW5i6dtBWRgcLbEL',
    access_token_secret: '2bIscNM2b23YxxQsQNabPEQJkmORvjOXfKJmWk5yCcP8X',
    triggerWord: 'coy!'
});

const job = new CronJob(
    '*/2 * * * * *',
    doJob,
    null,
    false
);

async function doJob() {
    const authenticatedUserId = await bot.getAdminUserInfo();
    const dm = await bot.getDirectMessage(authenticatedUserId);
    // console.log(dm);
};

app.get('/', (req, res, next) => {
    res.send('Welcome to twitter bot server!');
});

app.get('/trigger', async (req, res, next) => {
    job.fireOnTick();
    res.send('job triggered!');
});

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
