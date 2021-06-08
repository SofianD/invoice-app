const {resolve} = require('path');
const {Message} = require(resolve('src/js/shared/class/message/message'));

/**
 * 
 * @param {string} from Sender
 * @param {string} to Receiver
 * @param {boolean} haveToReply 
 * @param {object} data 
 * @param {ipcRenderer} currentP 
 * @returns {void}
 */
exports.send = (from, to, haveToReply, data, currentP) => {
    currentP.send(
        'main',
        new Message(
            from,
            to,
            haveToReply,
            data
        )
    );
    return;
}