// const express = require('express');
// const config = require('./../../config');
// const redis = require('./../../plugins/redis');
// const services = require('../services');
// let router = express.Router();
// //设置请求信息
// router.all('*', function (req, res, next) {
//     //设置允许跨域的域名，*代表允许任意域名跨域
//     res.header("Access-Control-Allow-Origin", config.allowOrigin);
//     //设置允许的header类型，*代表允许任意类型
//     res.header("Access-Control-Allow-Headers", config.allowHeaders);
//     //跨域允许的请求方式
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1');
//     if (/\/upload\//g.test(req.path)) {
//         res.header("Content-Type", "multipart/form-data;charset=utf-8");
//     } else {
//         res.header("Content-Type", "application/json;charset=utf-8");
//     }
//     if (req.method == 'OPTIONS') {
//         //让options请求快速返回
//         res.send(200);
//     } else { 
//         next();
//     }
// });
// router.use(function (req, res, next) {
//     const urlType = req.path.split('/')[3];
//     // 检查需要登录的接口，判断用户是否登录
//     let userRedisName = "";
//     if (/\/client\//g.test(req.path)) {
//         userRedisName = "clientUserInfo";
//     } else if (/\/business\//g.test(req.path)) {
//         userRedisName = "businessUserInfo";
//     }
//     if (userRedisName && ["user", "upload"].includes(urlType)) {
//         //检查是否有user_id
//         if (req.headers.user_token) {
//             redis.get(userRedisName + ":" + req.headers.user_token).then(data => {
//                 // 重新更新过期时间
//                 redis.setExpire(userRedisName + ":" + req.headers.user_token, 7200);
//                 req.userInfo = data;
//                 next();
//             }, err => {
//                 res.send({
//                     code: 1000,
//                     data: {},
//                     msg: "您还未登录，请先登录"
//                 });
//             });
//         } else {
//             res.send({
//                 code: 1100,
//                 data: {},
//                 msg: "请求头请添加user_token"
//             });
//         }
//     } else {
//         next();
//     }
// });
const business = require('./business');
const client = require('./client');
const common = require('./common');
module.exports = function (app) {
    app.use('/project/common/api/', common);
    app.use('/project/client/api/', client);
    app.use('/project/business/api/', business);
};