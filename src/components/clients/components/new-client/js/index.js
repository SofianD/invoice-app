const { ipcRenderer } = require('electron');
const {resolve} = require('path');
const {send, setCloseEvent, newWindow} = require(resolve('resources/app/src/js/shared/process/process'));
const viewjs = require(resolve('resources/app/src/js/shared/view/view'));

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
    // for (const el of document.getElementById('client').children) {
    //     if (el.nodeName === 'DIV' && el.id) {
    //         for (const child of el.children) {
    //             if (child.nodeName === 'INPUT') {
    //                 client[child.id] = child.value;
    //             }
    //         }
    //     }
    // }
    const allDiv  = document.getElementById('client').children;
    const length = allDiv.length;
    for (let i = 0; i < length; i++) {
        if (allDiv[i].nodeName === 'DIV' && allDiv[i].id) {
            const allInput = allDiv[i].children;
            const l = allInput.length;
            for (let y = 0; y < l; y++) {
                if (allInput[y].nodeName === 'INPUT') {
                    client[allInput[y].id] = allInput[y].value;
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
    const l = clientProps.length;
    for (let i = 0; i < l; i++) {
        viewjs.createElement(
            container,
            'label',
            [
                {
                    key: 'for',
                    value: clientProps[i]
                },
                {
                    key: 'innerText',
                    value: clientProps[i]
                }
            ]
        );
        viewjs.createElement(
            container,
            'input',
            [
                {
                    key: 'id',
                    value: clientProps[i]
                },
                {
                    key: 'value',
                    value: ''
                }
            ]
        );
    }
}
