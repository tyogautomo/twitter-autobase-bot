const express = require('express');
const CronJob = require('cron').CronJob;
const app = express();

const { TwitterBot } = require('./twitter-bot');

const PORT = 3000;

const bot = new TwitterBot({
    consumer_key: '7HlelUq9OvoOCnunIbCj01aqe',
    consumer_secret: '4D61xFcKkp7CY2eAxgfdq2vYDSeX8oS3I4Xsv8MBMGIjtN37b9',
    access_token: '67367056-WjTmqYVkMrAehul8MoU1x6NCJHcNUpvCnuJMt4Nl1',
    access_token_secret: 'oLDjcWjjqlFNysnoFBmGsVORmlXgxHmVMJpU8xVJgf8de',
    triggerWord: 'coy!'
});

const job = new CronJob(
    '*/2 * * * * *',
    doJob,
    null,
    false
);

async function doJob() {
    let tempMessage;
    try {
        const authenticatedUserId = await bot.getAdminUserInfo();
        const message = await bot.getDirectMessage(authenticatedUserId);
        if (message.id) {
            tempMessage = message;
            await bot.tweetMessage(message);
            await bot.deleteMessage(message);
            console.log('message has been deleted from twitter....');
        } else {
            console.log('no tweet to post --------------------------');
        }
    } catch (error) {
        console.log(error);
        console.log('--------------- ERROR ------------------');
        if (tempMessage.id) {
            await bot.deleteMessage(tempMessage);
        }
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
