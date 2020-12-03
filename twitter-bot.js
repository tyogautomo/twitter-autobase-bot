const Twit = require('twit');

class TwitterBot {
    constructor(props) {
        this.T = new Twit({
            consumer_key: props.consumer_key,
            consumer_secret: props.consumer_secret,
            access_token: props.access_token,
            access_token_secret: props.access_token_secret
        });
        this.triggerWord = props.triggerWord;
    }

    getAdminUserInfo = () => {
        return new Promise((resolve, reject) => {
            this.T.get('account/verify_credentials', { skip_status: true })
                .then(result => {
                    const userId = result.data.id_str
                    resolve(userId);
                })
                .catch(err => {
                    reject(err);
                })
        })
    };

    getReceivedMessages = (messages, userId) => {
        return messages.filter(msg => msg.message_create.sender_id !== userId);
    };

    getUnnecessaryMessages = (receivedMessages, trigger) => {
        return receivedMessages.filter(msg => {
            const message = msg.message_create.message_data.text; // 'Halo nama gw yoga coy!'
            const words = this.getEachWord(message); // ['Halo', 'nama', 'gw', 'yoga', 'coy!']
            return !words.includes(trigger);
        })
    };

    getTriggerMessages = (receivedMessages, trigger) => {
        return receivedMessages.filter(msg => {
            const message = msg.message_create.message_data.text; // 'Halo nama gw yoga coy!'
            const words = this.getEachWord(message); // ['Halo', 'nama', 'gw', 'yoga', 'coy!']
            return words.includes(trigger);
        })
    };

    getEachWord = (message) => {
        let words = []; // ['ini', 'line,', 'pertama', 'ini', ...]
        let finalWords = []; // ['ini', 'line', ',', 'pertama', ....]
        const separateEnter = message.split('\n'); // ['ini line, pertama', 'ini line kedua']
        separateEnter.forEach(line => words = [...words, ...line.split(' ')]);
        words.forEach(word => {
            const splitComma = word.split(','); // ['line', ',']
            finalWords = [...finalWords, ...splitComma];
        });
        return finalWords;
    };

    getDirectMessage = (userId) => {
        return new Promise((resolve, reject) => {
            this.T.get('direct_messages/events/list', async (error, data) => {
                try {
                    if (!error) {
                        let lastMessage = {};
                        const messages = data.events;
                        const receivedMessages = this.getReceivedMessages(messages, userId);
                        const unnecessaryMessages = this.getUnnecessaryMessages(receivedMessages, this.triggerWord);
                        const triggerMessages = this.getTriggerMessages(receivedMessages, this.triggerWord);

                        // console.log(JSON.stringify(unnecessaryMessages, null, 3), 'unnes messagesss <<<<<<');
                        // console.log(JSON.stringify(triggerMessages, null, 3), 'trigger messagesss <<<<<<');
                        await this.deleteUnnecessaryMessages(unnecessaryMessages);
                        await this.deleteMoreThan280CharMsgs(triggerMessages);
                        if (triggerMessages[0]) {
                            lastMessage = triggerMessages[triggerMessages.length - 1];
                        }
                        resolve(lastMessage);
                    } else {
                        reject('error on get direct message');
                    }
                } catch (error) {
                    throw (error);
                }
            })
        })
    };

    deleteUnnecessaryMessages = async (unnecessaryMessages) => {
        if (unnecessaryMessages.length > 3) {
            for (let i = 0; i < 3; i++) {
                await this.deleteMessage(unnecessaryMessages[i]);
                await this.sleep(2000);
            }
        } else {
            for (const msg of unnecessaryMessages) {
                await this.deleteMessage(msg);
                await this.sleep(2000);
            }
        }
    };

    deleteMoreThan280CharMsgs = async (triggerMessages) => {
        try {
            let moreThan280 = [];
            for (const [i, msg] of triggerMessages.entries()) {
                let text = msg.message_create.message_data.text;
                const attachment = msg.message_create.message_data.attachment
                if (attachment) {
                    const shortUrl = attachment.media.url;
                    text = text.split(shortUrl)[0];
                }
                if (text.length > 280) {
                    moreThan280.push(msg);
                    await this.deleteMessage(msg);
                    await this.sleep(2000);
                }
                if ((i + 1) === 3) {
                    break;
                }
            }
            for (const msg of moreThan280) {
                const idx = triggerMessages.indexOf(msg);
                triggerMessages.splice(idx, 1);
            }
        } catch (error) {
            throw (error);
        }
    };

    deleteMessage = (message) => {
        return new Promise((resolve, reject) => {
            this.T.delete('direct_messages/events/destroy', { id: message.id }, (error, data) => {
                if (!error) {
                    const msg = `Message with id: ${message.id} has been successfuly deleted`
                    console.log(msg);
                    resolve({
                        message: msg,
                        data
                    })
                } else {
                    reject(error);
                }
            })
        })
    };

    sleep = (time) => new Promise(resolve => setTimeout(resolve, time));
}

module.exports = { TwitterBot };
