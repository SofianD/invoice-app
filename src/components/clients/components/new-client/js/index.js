const { ipcRenderer } = require('electron');
const {resolve} = require('path');
const {send, setCloseEvent, newWindow} = require(resolve('src/js/shared/process/process'));
const viewjs = require(resolve('src/js/shared/view/view'));

window.onload = async function () {
    document.title = 'new-client';
    setCloseEvent(window, ipcRenderer, document.title);
    newWindow(document.title, ipcRenderer);
    displayView();
}

ipcRenderer.on('new-client', (event, arg) => {
    console.log(arg)
    if (arg.haveToReply) {

    } else {
        if (arg.from === 'clients' && arg.data.status === 'success') {
            window.close();
        }
    }
})

function addClient() {
    let client = {};
    for (const el of document.getElementById('client').children) {
        if (el.nodeName === 'DIV' && el.id) {
            for (const child of el.children) {
                if (child.nodeName === 'INPUT') {
                    client[child.id] = child.value;
                }
            }
        }
    }

    send(
        'new-client',
        'clients',
        true,
        client,
        ipcRenderer
    );
}

function displayView	() {
    viewjs.createElement(
        document.getElementById('client'),
        'div',
        [
            {
                key: 'id',
                value: 'target'
            },
            {
                key: 'className',
                value: 'container grid m-50'
            }
        ]
    );

    const container = document.getElementById('target');
    const clientProps = ['name', 'address', 'city', 'codepostal', 'phone'];
    for (prop of clientProps) {
        viewjs.createElement(
            container,
            'label',
            [
                {
                    key: 'for',
                    value: prop
                },
                {
                    key: 'innerText',
                    value: prop
                }
            ]
        );
        viewjs.createElement(
            container,
            'input',
            [
                {
                    key: 'id',
                    value: prop
                },
                {
                    key: 'value',
                    value: ''
                }
            ]
        );
    }
}