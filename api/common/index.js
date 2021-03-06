const express = require('express');
const services = require('./../../services');
const config = require('./../../config');
let router = express.Router();
//设置请求信息
router.all('*', function (req, res, next) {
    const urlType = req.path.split('/')[2];
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", config.allowOrigin);
    //设置允许的header类型，*代表允许任意类型
    res.header("Access-Control-Allow-Headers", config.allowHeaders);
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (["upload"].includes(urlType)) {
        res.header("Content-Type", "multipart/form-data;charset=utf-8");
    } else {
        res.header("Content-Type", "application/json;charset=utf-8");
    }
    if (req.method == 'OPTIONS') {
        //让options请求快速返回
        res.send(200);
    } else {
        next();
    }
});
//引入路由文件
require('./common.js')(router, services);
module.exports = router;