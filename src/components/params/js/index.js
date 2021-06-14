const path = require('path');
const view = require(path.resolve('resources/app/src/js/shared/view/view'));
const fs = require(path.resolve('resources/app/src/js/shared/fs/fs'));
const User = require(path.resolve('resources/app/user.json'));
const PARAMS = require(path.resolve('resources/app/params.json'));
const { ipcRenderer } = require('electron');
const {setCloseEvent, newWindow} = require(path.resolve('resources/app/src/js/shared/process/process'));


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
    await fs.overwrite('resources/app/user.json', JSON.stringify(newUser, null, 4));
    await fs.overwrite('resources/app/params.json', JSON.stringify(newParams, null, 4));
    window.close();
}
