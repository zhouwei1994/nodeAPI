const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
//密文
const ciphertext = 'hex';
//解决中文不同的问题
exports.md5Pay = function (str) {
    var str = (new Buffer(str)).toString("binary");
    return crypto.createHash('md5').update(str).digest(ciphertext);
}
//正常字符串加密
exports.md5 = function (str) {
    return crypto.createHash('md5').update(str.toString()).digest();
}
//sha1加密
exports.sha1 = function (str) {
    return crypto.createHash('sha1').update(str.toString()).digest(ciphertext);
}
//生成验证码
exports.createCode = function (len = 6) {
    const x = "0123456789";
    let code = "";
    for (let i = 0; i < len; i++) {
        code += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return code;
}
// 生成用户token
exports.createUserToken = function (len = 21) {
    const x = "q4wer0ty3ui9oplkj6h7gf2dsaz5xc8vbn1m";
    let code = "";
    for (let i = 0; i < len; i++) {
        code += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    const getTime = new Date().getTime();
    getTime.split('').forEach(item => {
        code = x.charAt(item) + code;
    });
    return code;
}
// 创建多级目录
exports.makeDir = function (dirpath) {
    if (fs.existsSync(dirpath)) {
        return true;
    } else {
        let pathtmp = "";
        dirpath.split("/").forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else if (dirname) {
                //如果在linux系统中，第一个dirname的值为空，所以赋值为"/"
                pathtmp = dirname;
            } else {
                pathtmp = "/";
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
}
/**
 * 时间戳转换为想要的时间格式
 */
//时间戳转换为时间 format('yyyy-MM-dd hh:mm:ss')
//时间格式转换
Date.prototype.format = function (fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}