const {resolve} = require('path');
const CLIENTS = require(resolve('clients.json')).clients;
const viewjs = require(resolve('src/js/shared/view/view'));
const fs = require(resolve('src/js/shared/fs/fs'));
const {ipcRenderer} = require('electron');
const {send, newWindow, setCloseEvent} = require(resolve('src/js/shared/process/process'));

// STANDALONE WINDOW
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
                value: (+id + i)
            },
            {
                key: 'className',
                value: 'container grid m-50'
            }
        ]);
        const newEl = document.getElementById((+id + i));
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
        ClientsList.push({
            id: (+id + i),
            ...client,
            target: document.getElementById(+id + i)
        });
        i++;
    }
}

function deleteClient(el) {
    ClientsList.splice(ClientsList.indexOf(ClientsList.filter(x => x.id === +this.parentNode.id)[0]), 1);
    this.parentNode.remove();
}

async function save() {
    for (const el of document.getElementById('clients').children) {
        if (el.nodeName === 'DIV' && el.id) {
            let obj = ClientsList.filter((x) => x.id === +el.id)[0];
            for (const child of el.children) {
                if (child.nodeName === 'INPUT') {
                    obj[child.id] = child.value;
                }
            }
        }
    }

    const res = await fs.overwrite(
        'clients.json',
        JSON.stringify(
            {
                clients: 
                    ClientsList.map((x) => {
                        const {id, target, ...a} = x;
                        return a;
                    })
            }, null, 4)
    );
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
    newWin.loadFile(resolve('src/components/clients/components/new-client/index.html'));

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
        for (client of ClientsList) {
            client.target.style.display = 'grid';
        }
    } else {
        for (client of ClientsList) {
            client.target.style.display = 'none';
        }
        for (client of ClientsList.filter(x => x.name.toLowerCase().includes(el.value.toLowerCase()))) {
            client.target.style.display = 'grid';
        }
    }
}
