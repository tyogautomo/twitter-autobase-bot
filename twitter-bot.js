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
            this.T.get('direct_messages/events/list', (error, data) => {
                if (!error) {
                    const messages = data.events;
                    const receivedMessages = this.getReceivedMessages(messages, userId);
                    const unnecessaryMessages = this.getUnnecessaryMessages(receivedMessages, this.triggerWord);
                    const triggerMessages = this.getTriggerMessages(receivedMessages, this.triggerWord);
                    // console.log(JSON.stringify(triggerMessages, null, 3), 'unnes messagesss <<<<<<');

                    resolve(data);
                } else {
                    reject('error on get direct message');
                }
            })
        })
    };
}

module.exports = { TwitterBot };
