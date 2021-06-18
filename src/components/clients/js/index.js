const {ipcRenderer} = require('electron');
const {resolve} = require('path');

const isDevEnv = process.env.NODE_ENV === undefined;
let viewjsPath = 'resources/app/src/js/shared/view/view';
let fsPath = 'resources/app/src/js/shared/fs/fs';
let processPath = 'resources/app/src/js/shared/process/process';
let clientsPath = 'resources/app/clients.json';
let newClientPath = 'resources/app/src/components/clients/components/new-client/index.html';
if (isDevEnv) {
    viewjsPath = 'src/js/shared/view/view';
    fsPath = 'src/js/shared/fs/fs';
    processPath = 'src/js/shared/process/process';
    clientsPath = 'clients.json';
    newClientPath = 'src/components/clients/components/new-client/index.html';
}
const CLIENTS = require(resolve(clientsPath)).clients;
const viewjs = require(resolve(viewjsPath));
const fs = require(resolve(fsPath));
const {send, newWindow, setCloseEvent} = require(resolve(processPath));

// FOR STANDALONE WINDOW
const {remote} = require('electron');

let ClientsList = [];

window.onload = async function () {
    document.title = 'clients';
    setCloseEvent(window, ipcRenderer, document.title, ['new-client']);
    newWindow(document.title, ipcRenderer);
    displayClients(CLIENTS);
};

function displayClients(list) {
    const container = document.getElementById('clients');
    const id = Date.now();
    let i = 0;
    for (const client of list) {
        viewjs.createElement(container, 'div', [
            {
                key: 'id',
                value: (id + i)
            },
            {
                key: 'className',
                value: 'container grid m-50'
            }
        ]);
        const newEl = document.getElementById(id + i);
        for (const key in client) {
            viewjs.createElement(newEl, 'label',[
                {
                    key: 'for',
                    value: key
                },
                {
                    key: 'innerText',
                    value: key
                }
            ]);
            viewjs.createElement(newEl, 'input', [
                {
                    key: 'id',
                    value: key
                },
                {
                    key: 'value',
                    value: client[key]
                }
            ]);
        }
        viewjs.createElement(
            newEl,
            'div',
            [
                {
                    key: 'className',
                    value: 'red-bg pointer m-15 txt-center'
                },
                {
                    key: 'innerHTML',
                    value: '<p>Delete</p>'
                },
                {
                    key: 'onclick',
                    value: deleteClient
                }
            ]
        );
        ClientsList.push(
            Object.assign(
                {
                    id: (id + i),
                    target: document.getElementById(id + i)
                },
                client
            )
        );
        i++;
    }
}

function deleteClient(el) {
    let target = (ClientsList.filter(x => x.id == this.parentNode.id));
    target = target[0];
    // console.log('target');
    // console.log(target);
    // console.log(ClientsList.indexOf(target));
    // console.log('ClientsList.indexOf(target)');
    ClientsList.splice(ClientsList.indexOf(target), 1);
    this.parentNode.remove();
}

async function save() {
    const children = document.getElementById('clients').children;
    const l = children.length;

    // console.log('ClientsList1111 ', ClientsList);

    for (let i = 0; i < l; i++) {
        if (children[i].nodeName === 'DIV' && children[i].id) {
            // console.log('ClientsList ', ClientsList);
            // console.log('children[i] ', children[i]);
            // console.log(typeof children[i].id);
            let obj = ClientsList.filter((x) => x.id == children[i].id);
            // console.log('obj ', obj);
            obj = obj[0];
            const inputs = children[i].children;
            const lgt = inputs.length;
            for (let y = 0; y < lgt; y++) {
                if (inputs[y].nodeName === 'INPUT') {
                    obj[inputs[y].id] = inputs[y].value;
                }
            }
        }
    }
    // console.log('FINAL ClientsList ', ClientsList);

    const res = await fs.overwrite(
        clientsPath,
        JSON.stringify(
            {
                clients: 
                    ClientsList.map((x) => {
                        delete x['id'];
                        delete x['target'];
                        return x;
                    })
            }, null, 4)
    );
    console.log(res);
}

async function newClient() {
    // STANDALONE WINDOW
    const BrowserWindow = remote.BrowserWindow;
    let newWin = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            contextIsolation: false, // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true,
        }
    });
    newWin.loadFile(resolve(newClientPath));

    // nested process
    // window.open(resolve('src/components/clients/components/new-client/index.html'));
}

// PROCESS

ipcRenderer.on('clients', (event, msg) => {
    if (msg.haveToReply) {
        if (msg.from === 'new-client') {
            addClient(msg);
        }
    }
})

async function addClient(msg) {
    CLIENTS.push(msg.data);
    ClientsList = [];
    document.getElementById('clients').innerHTML = '';
    displayClients(CLIENTS);
    await save();
    send(
        'clients',
        msg.from,
        false,
        {
            status: 'success'
        },
        ipcRenderer
    );
}

function searchClient () {
    const el = document.getElementById('search-bar');
    if (el.value.length === 0) {
        for (let i = 0; i < ClientsList.length; i++) {
            ClientsList[i].target.style.display = 'grid';
        }
    } else {
        for (let i = 0; i < ClientsList.length; i++) {
            if (ClientsList[i].name.toLowerCase().includes(el.value.toLowerCase())) {
                ClientsList[i].target.style.display = 'grid';
            } else {
                ClientsList[i].target.style.display = 'none';
            }
        }
    }
}
