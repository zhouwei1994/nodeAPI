// debug模式
const debug = require('debug')('expressapp:server');
const loaders = require('./plugins/loaders');
const config = require('./config');
///=======路由信息 （接口地址）开始 存放在./routes目录下===========//
const routes = require('./api/index'); 
const redis = require('./plugins/redis');
const socket = require('./plugins/socket');
const mysql = require('./models');
//常用工具
require('./plugins/utils');

const httpServer = loaders(config, function (app) { 
    console.log('访问地址 => http://localhost:' + config.port);
    //连接redis
    redis.init(config);
    // 创建socket
    socket.init();
    // 连接mysql数据库
    mysql.init(config);
    //在app中注册routes该接口
    routes(app)
});


/**
 * HTTP服务器“错误”事件的事件侦听器。
 */
httpServer.on('error', function (error) {
    console.error(error);
    if (error.syscall !== 'listen') {
        throw error;
    }
});



/**
 * HTTP服务器“侦听”事件的事件侦听器。
 */
httpServer.on('listening', function (res) { 
    console.log(res);
    var addr = http.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
});