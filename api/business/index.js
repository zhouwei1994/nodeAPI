const express = require('express');
const services = require('./../../services');
const config = require('./../../config');
let router = express.Router();
//设置请求信息
router.all('*', function (req, res, next) {
    const urlType = req.path.split('/')[2];
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //设置允许的header类型，*代表允许任意类型
    res.header("Access-Control-Allow-Headers", "*");
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
        console.log({
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query
        });
        // 检查需要登录的接口，判断用户是否登录
        if (["user", "upload"].includes(urlType)) {
            //检查是否有user_id
            if (req.headers.user_token) {
                redis.get("businessUserInfo:" + req.headers.user_token).then(data => {
                    // 重新更新过期时间
                    redis.setExpire("businessUserInfo:" + req.headers.user_token, 7200);
                    req.userInfo = data;
                    next();
                }, err => {
                    res.send({
                        code: 1000,
                        data: {},
                        msg: "您还未登录，请先登录"
                    });
                });
            } else {
                res.send({
                    code: 1100,
                    data: {},
                    msg: "请求头请添加user_token"
                });
            }
        } else {
            next();
        }
    }
});
module.exports = router;