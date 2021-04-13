const path = require('path');
const view = require(path.resolve('src/js/shared/view/view'));
const User = require(path.resolve('user.json')).me;
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
                <input type="text" name="${key}" id="me${key}" value="${User[key]}">`
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
                <input type="text" name="${key}" id="${key}" value="${PARAMS.path[key]}">`
            },
            {
                key: 'className',
                value: 'grid m-30'
            }
        ]);
    }
}
