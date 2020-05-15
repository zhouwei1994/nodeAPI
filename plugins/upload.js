const formidable = require('formidable');
const config = require('./../config');
const { makeDir } = require('./utils');
const fs = require('fs');
// 上传图片到本地
exports.uploadImage = function (req, res) {
    const userDirPath = 'images/';
    upload(req, userDirPath, function (type) {
        if (type.split('/')[0] == "image") {
            return true;
        } else {
            res.json({
                code: 302,
                msg: '请上传图片',
                data: null
            });
            return false;
        }
    }, function (msg) {
            res.json(msg);
    });
}
// 上传文件到本地
exports.uploadFile = function (req, res) {
    const userDirPath = 'file/';
    upload(req, userDirPath, function (type) {
        let fileType = type.split('/')[0];
        if (["audio", "video",  "text"].includes(fileType)) {
            return true;
        } else {
            res.json({
                code: 302,
                msg: '请上传音频、视频、文本',
                data: null
            });
            return false;
        }
    }, function (msg) {
            res.json(msg); 
    });
}
function upload(req, userDirPath, filterBcak, callback) {
    userDirPath = userDirPath + (new Date().format("yyyy/MM-dd")) + "/";
    makeDir("public/" + userDirPath);
    const form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = "public/" + userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024; //文件大小 默认是20mb，超出后会触发form上的error事件
    form.addListener('file', function (name, file) {
        // do something with uploaded file
        // console.log(name, file);
    });

    form.addListener('end', function () {
        // res.end();
    });
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
            callback({
                code: 0,
                data: null,
                msg: err.message
            });
            return;
        }
        console.log(files.file);
        if (filterBcak(files.file.type)) {
            if (files.file.name) {
                fs.renameSync(files.file.path, form.uploadDir + files.file.name); //重命名
                let path = "/" + userDirPath + files.file.name;
                callback({
                    code: 200,
                    data: {
                        url: config.host + ":" + config.port  + path,
                        path: path,
                        name: files.file.name
                    },
                    msg: "上传成功"
                });
            } else {
                let path = files.file.path.replace(/^public/, "");
                callback({
                    code: 200,
                    data: {
                        url: config.host + ":" + config.port + path,
                        path: path
                    },
                    msg: "上传成功"
                });
            }
        }
    });
};