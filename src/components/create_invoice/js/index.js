const invoicejs = require('@sofiand/invoice');
// const app = require('electron')
const path = require('path');
const { ipcRenderer } = require('electron');
const {setCloseEvent, newWindow} = require(path.resolve('src/js/shared/process/process'));

// const PARAMS = require(path.resolve('backup.json'));
const PARAMS = {
    me: require(path.resolve('user.json')),
    ...require(path.resolve('params.json'))
};
let allTemplates = [];
let data = [];
let selectedTemplate, selectedForm, multiInputModel, nameOfMultiInput;
let multiInputArr = [];
let selectedLib;

//  view
let libsAreVisible = true;
let templatesAreVisible = false;

window.onload = async function() {
    document.title = 'new-invoice';
    setCloseEvent(window, ipcRenderer, document.title);
    newWindow(document.title, ipcRenderer);
    
    PARAMS.libs = PARAMS.libs.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
    // app.ipcRenderer.postMessage()
    const ulLib = document.getElementById('libraries');
    for(let i = 0, l = PARAMS.libs.length; i < l; i++) {
        const param = [
            {
                key: 'id',
                value: PARAMS.libs[i].name.split(' ').join('-')
            },
            {
                key: 'innerText',
                value: PARAMS.libs[i].name
            },
            {
                key: 'id',
                value: PARAMS.libs[i].name.split(' ').join('-')
            },
            {
                key: 'onclick',
                value: getTemplatesFrom
            },
            {
                key: 'className',
                value: 'purple-bg'
            }
        ]
        await createElement(ulLib, 'div', param);
        PARAMS.libs[i]['id'] = PARAMS.libs[i].name.split(' ').join('-');
    }
}

async function createElement(parent, element, arrayOfParams) {
    const newElmnt = document.createElement(element);
    const arrLength = arrayOfParams.length;

    for (let i = 0; i < arrLength; i++) {
        newElmnt[arrayOfParams[i].key] = arrayOfParams[i].value;
    }

    parent.appendChild(newElmnt);
    return;
}

async function getTemplatesFrom(el) {
    isLoading();
    hideLibs();
    allTemplates = [];
    const t = PARAMS.libs.filter(x => x.id === el.target.id);
    try {
        allTemplates = await invoicejs.getListOfTemplates(t[0].url_api);
        document.getElementById('template-container').style.display = 'block';

        selectedLib = t[0];
        const a = document.getElementById('list-of-template');
        a.innerHTML = '';
        await createDiv(allTemplates, a, getTemplate);
        templatesAreVisible = false;
        hideTemplates();
        return;
    } catch (error) {
        throw new Error(error);
    } finally {
        isLoading();
    }
}

async function getTemplate(el) {
    isLoading();
    const t = allTemplates.filter(x => x.id === el.target.id)[0];
    try {
        selectedForm = await invoicejs.getForm(selectedLib.url, t.name);
        selectedTemplate = await invoicejs.getTemplate(selectedLib.url, t.name);
        document.getElementById('form-container').style.display = 'block';
        const f = document.getElementById('template-form');
        f.innerHTML = selectedForm;
        selectedForm = document.getElementById('myForm');
        selectedForm.onsubmit = pushFormData;
        document.getElementById('form-body').className += ' grid';
        getInputArr();
        hideTemplates();
        autocompleteForm();
        return;
    } catch (error) {
        throw new Error(error);
    } finally {
        isLoading();
    }

}

function getInputArr() {
    const u = document.getElementsByClassName('multi-input')[0];
    if(!u) {
        console.log('inputModel error: ', u);
        return;
    }
    multiInputModel = u.outerHTML;
    nameOfMultiInput = u.id;
    document.getElementById('add-param').onclick = pushdataInInputArr;
}

function pushdataInInputArr(event) {
    event.preventDefault();
    const u = document.getElementsByClassName('multi-input')[0];
    const l = u.children.length;
    let currentParam = {};
    for(let i= 0; i < l; i++) {
        const m = u.children[i].children.length;
        for(let n = 0; n < m; n++) {
            if(u.children[i].children[n].nodeName === 'INPUT') {
                if (u.children[i].children[n].value.length === 0) {
                    // event.preventDefault();
                    throw new Error(`${u.children[i].children[n].name.toUpperCase()} need value.`);
                }
                currentParam[u.children[i].children[n].name] = u.children[i].children[n].value;
            }
        }
    }

    multiInputArr.push(currentParam);
    u.outerHTML = multiInputModel;

    createElement(document.getElementsByClassName('multi-input')[0], 'div', [
        {
            key: 'id',
            value: 'multi-input-arr'
        },
        {
            key: 'style',
            value: 'max-width: 720px;'
        }
    ]);

    for(let i = 0, l = multiInputArr.length; i < l; i++) {
        let str = [];
        for (const key in multiInputArr[i]) {
            str.push(key + ': <span style="color: white;">' + multiInputArr[i][key] + '</span>');
        }
        const param = [
            {
                key: 'innerHTML',
                value: str.join('<br>') + '<hr>'
            }
        ];
        createElement(document.getElementById('multi-input-arr'), 'p', param);
    }
    // document.getElementById('add-param').onclick = pushdataInInputArr;
    // event.preventDefault();
    return;
}

async function createDiv(arr, parent, action) {
    for(let i = 0, l = arr.length; i < l; i++) {
        const param = [
            {
                key: 'id',
                value: arr[i].name.split(' ').join('-')
            },
            {
                key: 'innerText',
                value: arr[i].name
            },
            {
                key: 'onclick',
                value: action
            },
            {
                key: 'className',
                value: 'purple-bg'
            }
        ];
        await createElement(parent, 'div', param);
        arr[i]['id'] = arr[i].name.split(' ').join('-');
    }
    return;
}

function pushFormData(event) {
    event.preventDefault();
    const u = document.getElementsByClassName('multi-input')[0];
    const formData = {};

    if(u) {
        u.innerHTML = '';
        formData[nameOfMultiInput] = multiInputArr;
        multiInputArr = [];
    }
    const inputElmnts = ([...selectedForm.elements].flat()).filter(x => x.nodeName === 'INPUT');
    for(let i = 0, l = inputElmnts.length; i < l - 1; i++) {
        const c = {
            key: inputElmnts[i].name,
            value: inputElmnts[i].value
        };
        formData[c.key] = c.value;
    }

    data.push(formData);
    selectedForm.reset();
    u.outerHTML = multiInputModel;
    autocompleteForm();
    return;
}

async function getResponse(data) {
    const h = document.getElementById('result');
    document.getElementById('collect-container').style.display = 'block';
    for(let i = 0, dl = data.length; i < dl; i++) {
        const param = [
            {
                key: 'id',
                value: data[i].name.split(' ').join('-')
            },
            {
                key: 'innerHTML',
                value: '<a target="_blank" href="file:///'+ data[i].pathOfsavedFile +'">'+ data[i].name +'</a>'
            },
            {
                key: 'style',
                value: 'cursor: pointer; text-decoration: underline;'
            }
        ];

        await createElement(h, 'li', param);
    }

    return;
}

async function compileAndSave() {
    isLoading();
    try {
        const err = [];
        if (data.length === 0) err.push('No data entry.');
        if (typeof selectedTemplate !== 'string') err.push('No template.');
        if (err.length > 0) throw err.join('\n');

        const response =  await invoicejs.getAndSaveInvoice(selectedTemplate, data, {
            toSaveFiles: PARAMS.path.toSaveFiles
        });
        getResponse(response);
        data = [];
        selectedForm = undefined;
        selectedTemplate = undefined;
        document.getElementById('form-container').style.display = 'none';
    } catch (error) {
        throw new Error(error);
    } finally {
        isLoading();
    }
}

function autocompleteForm() {
    const inputElmnts = ([...selectedForm.elements].flat()).filter(x => x.nodeName === 'INPUT');
    for(let i = 0, l = inputElmnts.length; i < l - 1; i++) {
        let check = inputElmnts[i].id.split('-');
        if (check.length > 1) {
            let currentStage = {...PARAMS};
            let dataFound = false;
            let j = 0;
            let err = false;
            while (!dataFound && j < check.length && !err) {
                if (check[j] in currentStage) {
                    if (j === check.length - 1) {
                        dataFound = true;
                        currentStage = currentStage[check[j]];
                    } else {
                        currentStage = {...currentStage[check[j]]};
                        j++;
                    }
                } else {
                    err = true;
                }
            }

            if (dataFound) {
                inputElmnts[i].value = currentStage;
                check = 'me' + (check[1].charAt(0).toUpperCase()) + (check[1].substr(1));
                inputElmnts[i].name = check;
            }
        }
    }
}


//  VIEW
function hideLibs(){
    const f = document.getElementById('libraries');
    if (libsAreVisible) {
        f.style.display = 'none';
        libsAreVisible = false;
        document.getElementById('libs-display-indicator').innerHTML = '&#10798;';
    } else {
        f.style.display = 'flex';
        libsAreVisible = true;
        document.getElementById('libs-display-indicator').innerHTML = '&#8722;';
    }
    return;
}

function hideTemplates(){
    const f = document.getElementById('list-of-template');
    if (templatesAreVisible) {
        f.style.display = 'none';
        templatesAreVisible = false;
        document.getElementById('template-display-indicator').innerHTML = '&#10798;';
    } else {
        f.style.display = 'flex';
        templatesAreVisible = true;
        document.getElementById('template-display-indicator').innerHTML = '&#8722;';
    }
    return;
}

function isLoading(){
    const load = document.getElementById('loading-container');
    if(load.style.display === 'block') {
        load.style.display = 'none';
    } else {
        load.style.display = 'block';
    }
}

function exit() {
    window.close();
}

function neww() {
    window.open('index.html')
}
