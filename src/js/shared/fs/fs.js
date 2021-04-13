const fs = require('fs/promises');
const {resolve} = require('path');

exports.fileExist = async (path) => {
    path = resolve(path);
    try {
        const file = await fs.open(path);
        let res;
        if ((await file.stat()).size > 0) {
            res = true;
        } else {
            res = false;
        }
        await file.close();
        return res;
    } catch (error) {
        throw new Error(error);
    }
}

exports.delete = async (path) => {
    path = resolve(path);
    try {
        const res = await fs.rm(data);
        return res === undefined ? true : false;
    } catch (error) {
        throw new Error(error);
    }
}

exports.append = async (path, data) => {
    path = resolve(path);
    try {
        const file = await fs.open(path, 'a');
        const res = await file.appendFile(data);
        await file.close();
        return res;
    } catch (error) {
        throw new Error(error);
        
    }
}

exports.overwrite = async (path, data) => {
    path = resolve(path);
    try {
        const res = await fs.writeFile(path, data);
        return res;
    } catch (error) {
        throw new Error(error);
    }
}