const { ipcRenderer } = require('electron');
const path = require('path');

const isDevEnv = process.env.NODE_ENV === undefined;
let viewjsPath = 'resources/app/src/js/shared/view/view';
let fsPath = 'resources/app/src/js/shared/fs/fs';
let userPath = 'resources/app/user.json';
let paramsPath = 'resources/app/params.json';
let processPath = 'resources/app/src/js/shared/process/process';
if (isDevEnv) {
    viewjsPath = 'src/js/shared/view/view';
    fsPath = 'src/js/shared/fs/fs';
    userPath = 'user.json';
    paramsPath = 'params.json';
    processPath = 'src/js/shared/process/process';
}
const view = require(path.resolve(viewjsPath));
const fs = require(path.resolve(fsPath));
const User = require(path.resolve(userPath));
const PARAMS = require(path.resolve(paramsPath));
const {setCloseEvent, newWindow} = require(path.resolve(processPath));

window.onload = async function () {
    document.title = 'params';
    setCloseEvent(window, ipcRenderer, document.title);
    newWindow(document.title, ipcRenderer);
    displayMyInfo();
    displayPath();
}

function displayMyInfo() {
    const container = document.getElementById('me');
    for(const key in User) {
        view.createElement(container, 'div', [
            {
                key: 'innerHTML',
                value: 
                `<label for="${key}">${key}</label>
                <input type="text" name="${key}" id="me-${key}" value="${User[key]}">`
            },
            {
                key: 'className',
                value: 'grid m-30'
            }
        ]);
    }
}

function displayPath() {
    const container = document.getElementById('path');

    for(const key in PARAMS.path) {
        view.createElement(container, 'div', [
            {
                key: 'innerHTML',
                value: 
                `<label for="${key}">${key}</label>
                <input type="text" name="${key}" id="path-${key}" value="${PARAMS.path[key]}">`
            },
            {
                key: 'className',
                value: 'grid m-30'
            }
        ]);
    }
}

async function save() {
    let newUser = {};
    let newParams = {};
    Object.assign(newParams, PARAMS);
    newParams.path.toSaveFiles = document.getElementById('path-toSaveFiles').value;
    for (const key in User) {
        const value = document.getElementById(`me-${key}`).value;
        newUser[key] = value;
    }
    await fs.overwrite(userPath, JSON.stringify(newUser, null, 4));
    await fs.overwrite(paramsPath, JSON.stringify(newParams, null, 4));
    window.close();
}
