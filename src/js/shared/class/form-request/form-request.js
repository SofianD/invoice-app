class FormRequest {
    constructor (parent, request, type, childs = undefined) {
        this.request = request;
        this.type = type;
        this.childs = childs;
    }
}

module.exports.FormRequest = FormRequest;
