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
        if (["audio", "video", "text", "application"].includes(fileType)) {
            return true;
        } else {
            res.json({
                code: 302,
                msg: '请上传音频、视频、文本、文件',
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
    let allFiles = [];
    let fileData = [];
    let allow = true;
    const form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = "public/" + userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024; //文件大小 默认是20mb，超出后会触发form上的error事件
    form.addListener('file', function (name, file) {
        allFiles.push(file.path);
        if (allow) {
            allow = false;
            // 下一步如果报错就不继续处理了
            if (filterBcak(file.type)) {
                allow = true;
                if (file.name) {
                    fs.renameSync(file.path, form.uploadDir + file.name); //重命名
                    let path = "/" + userDirPath + file.name;
                    fileData.push({
                        url: config.host + ":" + config.port + path,
                        path: path,
                        name: file.name
                    });
                } else {
                    let path = file.path.replace(/^public/, "");
                    fileData.push({
                        url: config.host + ":" + config.port + path,
                        path: path
                    });
                }
            }
        }
    });
    form.addListener('end', function () {
        if (allow) {
            if (fileData.length > 0) {
                callback({
                    code: 200,
                    data: fileData,
                    msg: "上传成功"
                });
            } else {
                callback({
                    code: 0,
                    data: null,
                    msg: "上传失败"
                });
            }
        } else {
            setTimeout(() => {
                allFiles.forEach(url => {
                    // 上传失败后删除掉文件
                    fs.unlinkSync(url);
                });
            },500);
        }
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
    });
};