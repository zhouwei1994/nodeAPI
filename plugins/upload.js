const formidable = require('formidable');
// 路径操作
const path = require('path');
const fs = require('fs');
// 创建多级目录
function makeDir(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split("/").forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
                if (dirname) {
                    pathtmp = dirname;
                } else {
                    pathtmp = "/";
                }
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}
// 上传图片到本地
exports.uploadImage = function (req, res) {
    console.log(req);
    const userDirPath = 'public/images/';
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
    const userDirPath = 'public/file/';
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
    console.log(userDirPath);
    makeDir(userDirPath);
    const form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编辑
    form.uploadDir = userDirPath; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024; //文件大小 默认是20mb，超出后会触发form上的error事件
    form.addListener('file', function (name, file) {
        // do something with uploaded file
        console.log(name, file);
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
            // const avatarName = Date.now() + '.' + extName;
            const newPath = form.uploadDir + '/' + files.file.name;
            fs.renameSync(files.file.path, newPath); //重命名
            callback({
                code: 200,
                data: newPath,
                msg: "上传成功"
            });
        }
    });
};