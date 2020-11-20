const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const bot = new TwitterBot({
    consumer_key: 'qMAr4yaINzGC7NlmnhExG7TU8',
    consumer_secret: 'ZLGTPbqs9oG4EicrH1OdQHMQLiiQnnbLuYNBwpwQeMzh73cLjg',
    access_token: '67367056-mzpg57Onz1Ex1cJv57O2t8B56gzafSO9lgqc80lAH',
    access_token_secret: 'LpkkKBzvQ3qgikorXbjl5iTdrwcIUSU0qEFDAx8VyQOno'
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
    console.log(dm);
};

app.get('/', (req, res, next) => {
    res.send('Welcome to twitter bot server!');
});

app.get('/trigger', async (req, res, next) => {
    job.fireOnTick();
    res.send('job triggered!');
});

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
