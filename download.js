const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const fs = require('fs');
const { default: Axios } = require('axios');

const OAuthHelper = (mediaUrl) => {
    const oauth = OAuth({
        consumer: {
            key: 'AWVUXTDF6iS1cEUW7AFJr8ckg',
            secret: 'qsEZ4aQTgpmf5mVZK2UvvWBnciNcgYdBFLfDsQ1WTT3oFL30rx'
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    })

    const authorization = oauth.authorize({
        url: mediaUrl,
        method: 'GET'
    }, {
        key: '67367056-k1G6wUdkBC7rDkBHDLJ5shJTQFrDWJPqjUyIrbZQV',
        secret: 'fnjwJaPaI3O8svJKmwycoDviQh5xtU2CfGvPSnho0l41A'
    });

    return oauth.toHeader(authorization);
};

const downloadMedia = async (mediaUrl, fileName) => {
    try {
        const authorization = OAuthHelper(mediaUrl);
        const { data } = await axios.get(
            mediaUrl,
            {
                headers: authorization,
                responseType: 'arraybuffer'
            }
        );
        fs.writeFileSync(fileName, data);
        return data;
    } catch (error) {
        throw new Error('error from downloading media.');
    }
};

module.exports = { downloadMedia };
