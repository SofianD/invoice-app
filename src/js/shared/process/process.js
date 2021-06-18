const {resolve} = require('path');
const isDevEnv = process.env.NODE_ENV === undefined;

let pathMessage = 'src/js/shared/class/message/message';;
if (!isDevEnv) {
    pathMessage = 'resources/app/src/js/shared/class/message/message';
}
const {Message} = require(resolve(pathMessage));

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

/**
 * 
 * @param {string} name 
 * @param {ipcRenderer} currentP 
 * @returns {void}
 */
exports.newWindow = (name, currentP) => {
    currentP.send(
        'new-window',
        name
    );
    return;
}

/**
 * 
 * @param {Browser} window 
 * @param {ipcRenderer} currentP 
 * @param {string} name 
 * @param {process} proc 
 */
exports.setCloseEvent = (window, currentP, name, childs = [])=> {
    window.onbeforeunload = async function (event) {
        currentP.send(
            'close-window',
            {
                name,
                childs
            }
        );
        process.exit();
    }
}
