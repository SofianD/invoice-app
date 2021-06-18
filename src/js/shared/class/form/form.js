const {resolve} = require('path');
const viewjs = require(resolve('src/js/shared/view/view'));

class Form {
    constructor (doc) {
        this.document = doc;
        this.container = doc.getElementById('form-container');
    }

    createForm() {
        viewjs.createElement(
            this.container,
            'div',
            [
                {
                    key: 'id',
                    value: 'myForm'
                },
                {
                    key: 'className',
                    value: 'container grid m-50'
                }
            ]
        );
        this.form = this.document.getElementById('myForm');
        viewjs.createElement(
            this.form,
            'div',
            [
                {
                    key: 'id',
                    value: 'form-body'
                },
                {
                    key: 'className',
                    value: 'container purple-bg m-50'
                }
            ]
        );
    }

    createInputs () {

    }
}

module.exports.Form = Form;
