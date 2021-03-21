const invoicejs = require('@sofiand/invoice');
// const app = require('electron')

const PARAMS = [
    {
        name: 'invoiceJS-lib',
        url_api: 'https://api.github.com/repos/SofianD/invoicejs-lib/git/trees/master',
        url: 'https://github.com/SofianD/invoiceJS-lib/tree/master/lib'
    }
];
let allTemplates = [];
let data = [];
let selectedTemplate, selectedForm, multiInputModel, nameOfMultiInput;
let multiInputArr = []

window.onload = async function() {
    // console.log(app)
    // app.ipcRenderer.postMessage()
    const ulLib = document.getElementById('libraries');
    for(let i = 0, l = PARAMS.length; i < l; i++) {
        const param = [
            {
                key: 'id',
                value: PARAMS[i].name.split(' ').join('-')
            },
            {
                key: 'innerText',
                value: PARAMS[i].name
            },
            {
                key: 'id',
                value: PARAMS[i].name.split(' ').join('-')
            },
            {
                key: 'onclick',
                value: getTemplatesFrom
            },
            {
                key: 'style',
                value: 'cursor: pointer; text-decoration: underline;'
            }
        ]
        await createElement(ulLib, 'li', param);
        PARAMS[i]['id'] = PARAMS[i].name.split(' ').join('-');
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
    allTemplates = [];
    const t = PARAMS.filter(x => x.id === el.target.id);
    try {
        allTemplates = await invoicejs.getListOfTemplates(t[0].url_api);
    } catch (error) {
        console.log(error);
        return;
    }
    const a = document.getElementById('list-of-template');
    a.innerHTML = '';
    await createLI(allTemplates, a, getTemplate);

    return;
}

async function getTemplate(el) {
    const t = allTemplates.filter(x => x.id === el.target.id)[0];
    try {
        selectedForm = await invoicejs.getForm(t.name);
        selectedTemplate = await invoicejs.getTemplate(t.name);
        const f = document.getElementById('template-form');
        // console.log(selectedForm);
        // console.log(selectedTemplate);
        f.innerHTML = selectedForm;
        selectedForm = document.getElementById('myForm');
        selectedForm.onsubmit = pushFormData;
        getInputArr();
    } catch (error) {
        console.log(error);
        return;
    }

    return;
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
    const u = document.getElementsByClassName('multi-input')[0];
    // console.log('u\n:', u);
    const l = u.children.length;
    let currentParam = {};
    for(let i= 0; i < l; i++) {
        const m = u.children[i].children.length;
        for(let n = 0; n < m; n++) {
            if(u.children[i].children[n].nodeName === 'INPUT') {
                // currentArr.push({
                //     name: u.children[i].children[n].name,
                //     value: u.children[i].children[n].value
                // });
                currentParam[u.children[i].children[n].name] = u.children[i].children[n].value;
            }
        }
    }
    multiInputArr.push(currentParam);
    u.outerHTML = multiInputModel;
    // document.getElementById('add-param').onclick = pushdataInInputArr;
    event.preventDefault();
    return;
}

async function createLI(arr, parent, action) {
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
                key: 'style',
                value: 'cursor: pointer; text-decoration: underline;'
            }
        ];
        // console.log('create')
        await createElement(parent, 'li', param);
        arr[i]['id'] = arr[i].name.split(' ').join('-');
    }
    return;
}

function pushFormData(event) {
    // const selectedForm = document.getElementById('myForm');
    const u = document.getElementsByClassName('multi-input')[0];
    const formData = {};

    if(u) {
        // console.log('inputModel: ', u);
        u.innerHTML = '';
        formData[nameOfMultiInput] = multiInputArr;
        multiInputArr = [];
    }
    const inputElmnts = ([...selectedForm.elements].flat()).filter(x => x.nodeName === 'INPUT');
    // console.log(inputElmnts)
    for(let i = 0, l = inputElmnts.length; i < l - 1; i++) {
        const c = {
            key: inputElmnts[i].name,
            value: inputElmnts[i].value
        };
        formData[c.key] = c.value;
    }

    data.push(formData);
    selectedForm.reset();
    console.log(data);
    u.outerHTML = multiInputModel;
    event.preventDefault();
    return;
}

async function getResponse(data) {
    const h = document.getElementById('result');
    
    for(let i = 0, dl = data.length; i < dl; i++) {
        const param = [
            {
                key: 'id',
                value: data[i].name.split(' ').join('-')
            },
            {
                key: 'innerHTML',
                value: '<a target="_blank" href="'+ data[i].pathOfsavedFile +'">'+ data[i].name +'</a>'
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
    const response =  await invoicejs.getAndSaveInvoice(selectedTemplate, data);
    console.log(response);
    data = [];
    getResponse(response);
}
