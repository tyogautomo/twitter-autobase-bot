const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const bot = new TwitterBot({
    consumer_key: '6S0huhz5S9l0ni2AJWMCTVaMP',
    consumer_secret: 'J0zDRB7AfJKIGfCfp7FMmslVL3ymec6WL6JhTW66FblCppJ50Z',
    access_token: '67367056-qQ1iWaT3PNPIFCE8TTYusrD3cvqas4AcMpmoVVpYA',
    access_token_secret: 'bCdYPhj3rJoDY0Me62Np1GxTB9bAxPtBZABXhao2dgKY0',
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
