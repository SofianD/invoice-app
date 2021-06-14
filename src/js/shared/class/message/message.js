/**
 * 
 * @param {string} from Sender
 * @param {string} to Receiver
 * @param {boolean} haveToReply 
 * @param {object} data
 * @param {object} error 
 */
class Message {
    constructor(from, to, haveToReply, data = undefined, error = undefined) {
        // for (const key in data) {
        //     this[key] = data[key];
        // }
        this.from = typeof from === 'string' ? from : undefined;
        this.to = typeof to === 'string' ? to : undefined;
        this.haveToReply = typeof haveToReply === 'boolean' ? haveToReply : undefined;
        this.data = data || null;
        this.error = error || null;
    }
}

module.exports.Message = Message;