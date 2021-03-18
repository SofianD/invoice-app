const invoicejs = require('@sofiand/invoice');
const PARAMS = [
    {
        name: 'invoiceJS-lib',
        url_api: 'https://api.github.com/repos/SofianD/invoicejs-lib/git/trees/master',
        url: 'https://github.com/SofianD/invoiceJS-lib/tree/master/lib'
    }
];
let allTemplates = [];

window.onload = async function() {
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
    allTemplates = []
    const t = PARAMS.filter(x => x.id === el.target.id);
    try {
        allTemplates = await invoicejs.getListOfTemplates(t[0].url_api);
    } catch (error) {
        console.log(error);
        return;
    }
    // console.log(allTemplates);
    // console.log(el)
    const a = document.getElementById('list-of-template');
    a.innerHTML = '';
    await createLI(allTemplates, a, getTemplate);
    return;
}

async function getTemplate(el) {
    const t = allTemplates.filter(x => x.id === el.target.id);
    console.log(t);
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
                key: 'id',
                value: arr[i].name.split(' ').join('-')
            },
            {
                key: 'onclick',
                value: action
            },
            {
                key: 'style',
                value: 'cursor: pointer; text-decoration: underline;'
            }
        ]
        console.log('create')
        await createElement(parent, 'li', param);
        arr[i]['id'] = arr[i].name.split(' ').join('-');
    }
    return;
}