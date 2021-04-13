const path = require('path');
const view = require(path.resolve('src/js/shared/view/view'));
const fs = require(path.resolve('src/js/shared/fs/fs'));
const User = require(path.resolve('user.json'));
const PARAMS = require(path.resolve('params.json'));

window.onload = async function () {
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
    let newUser = {...User};
    let newParams = {...PARAMS};
    for (const key in User) {
        const value = document.getElementById(`me-${key}`).value;
        newUser[key] = value;
    }
    for (const key in PARAMS.path){
        const value = document.getElementById(`path-${key}`).value;
        newParams.path[key] = value;
    }
    await fs.overwrite('user.json', JSON.stringify(newUser, null, 4));
    await fs.overwrite('params.json', JSON.stringify(newParams, null, 4));
    window.close();
}