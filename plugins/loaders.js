// express配置文件
const express = require('express');
const bodyParser = require('body-parser');
// 路径操作
const path = require('path');
// 日志中间件
const logger = require('morgan');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const http = require('http');
module.exports = function(config, callback) {
    const app = express();
    //定义模板（views ）搜索路径，在根目录的 views 文件夹下,可自定义
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    // 使用app.use(logger('dev'));可以将请求信息打印在控制台
    app.use(logger('dev'));
    //打印到log日志
    const accessLog = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });
    app.use(logger('combined', { stream: accessLog }));
    // 修改bodyParser接收的最大值, 不然会报错
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: false
    }));
    app.use(bodyParser.json()); //数据JSON类型
    app.use(cookieParser());
    //指定静态文件名称是 public, 文件夹名可自定义
    app.use(express.static(path.join(__dirname, '../public')));


    //为 Express 设置代理
    app.set('trust proxy', function (ip) {
        console.log("访问的IP", ip);
        // 受信的 IP 地址
        return config.trustProxy.includes(ip);
    });

    // 错误处理程序
    // app.use(function (err, req, res, next) {
    //     console.log(err,req, res);
    //     res.locals.message = err.message;
    //     res.locals.error = req.app.get('env') === 'development' ? err : {};
    //     // 呈现错误页面
    //     res.status(err.status || 500);
    //     res.send({
    //         code: err.status,
    //         data: null,
    //         msg: err.message
    //     });
    // });
    app.set('port', config.port);
    const httpServer = http.createServer(app);
    /**
     * 在所有网络接口上监听提供的端口。
     */
    app.listen(config.port, function () {
        callback && callback(app);
    });
    return httpServer;
};