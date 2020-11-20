const Twit = require('twit');

class TwitterBot {
    constructor(props) {
        this.T = new Twit({
            consumer_key: props.consumer_key,
            consumer_secret: props.consumer_secret,
            access_token: props.access_token,
            access_token_secret: props.access_token_secret
        })
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

    getDirectMessage = (userId) => {
        return new Promise((resolve, reject) => {
            this.T.get('direct_messages/events/list', (error, data) => {
                if (!error) {
                    const messages = data.events;
                    const receivedMessages = this.getReceivedMessages(messages, userId)

                    // console.log(receivedMessages, 'messagesss <<<<<<');

                    resolve(data);
                } else {
                    reject('error on get direct message');
                }
            })
        })
    };
}

module.exports = { TwitterBot };
