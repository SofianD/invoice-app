const {resolve} = require('path');
const CLIENTS = require(resolve('clients.json')).clients;
const viewjs = require(resolve('src/js/shared/view/view'));
const fs = require(resolve('src/js/shared/fs/fs'));
const {ipcRenderer} = require('electron');
const {send} = require(resolve('src/js/shared/process/process'))

// STANDALONE WINDOW
// const {remote} = require('electron');

let ClientsList = [];

window.onload = async function () {
    displayClients();
    
};

function displayClients() {
    const container = document.getElementById('clients');
    const id = Date.now();
    let i = 0;
    for (const client of CLIENTS) {
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
        ClientsList.push({
            id: (+id + i),
            ...client
        });
        i++;
    }
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
                        const {id, ...a} = x;
                        return a;
                    })
            }, null, 4)
    );
    console.log(res);

    //  backup:
    //  {
    //     "clients": [
    //         {
    //             "name": "Pierre Demdem",
    //             "adress": "30 rue Prèsdunarbre",
    //             "city": "Lille",
    //             "codepostal": "59000",
    //             "phone": "0689568954"
    //         },
    //         {
    //             "name": "Nico Halhal",
    //             "adress": "30 rue Prèsdunmur",
    //             "city": "Lille",
    //             "codepostal": "59000",
    //             "phone": "0660233212"
    //         }
    //     ]
    // }
}

async function newClient() {
    // STANDALONE WINDOW
    // const BrowserWindow = remote.BrowserWindow;
    // let newWin = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     frame: true
    // });
    // newWin.loadFile(resolve('src/components/clients/new-client/index.html'));

    // nested process
    window.open(resolve('src/components/clients/components/new-client/index.html'));
}

// PROCESS

ipcRenderer.on('clients', (event, msg) => {
    console.log(msg)
    if (msg.haveToReply) {
        if (msg.from === 'new-client') {
            addClient(msg);
        }
    }
})

function addClient(msg) {
    CLIENTS.push(msg.data);
    ClientsList = [];
    document.getElementById('clients').innerHTML = '';
    displayClients();
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
