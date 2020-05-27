var ws = require("nodejs-websocket");
// 建立新链接（ 完成握手后） 触发， conn 是连接的实例对象
// server.on('connection', (conn) => {
// 一个常量，表示连接的当前状态
// 值为 0， 表示正在连接
// 值为 1， 表示连接成功， 可以通信了
// 值为 2， 表示连接正在关闭。
// 值为 3， 表示连接已经关闭， 或者打开连接失败。
// console.log(conn.readyState);
// console.log("成功建立握手", conn);
// });
// console.log("WebSocket建立完毕");
// 服务端广播,可以用来广播所有消息
// server.connections.forEach(function (conn) {
//     conn.sendText(msg)
// });
// 关闭websocket服务
// server.close();
class Socket {
    constructor() {
        this.socketServer = undefined;
        // 当前聊天室的用户
        this.chatUsers = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            this.socketServer = ws.createServer(function (connection) {
                // console.log(connection);
                // 收到文本时触发
                connection.on("text", function (result) {
                    const info = JSON.parse(result);
                    console.log(info);
                    if (info.type == "text") { 
                        setTimeout(function () {
                            connection.sendText(JSON.stringify({
                                message: "收到消息【" + info.message + "】，但是我延时了4秒发送给你",
                                type: "text"
                            }));
                        }, 4000);
                    }
                });
                // 开启连接
                connection.on('connect', function (code) {
                    console.log('开启连接', code)
                })
                // 监听客户端关闭
                connection.on('close', function (code) {
                    console.log('关闭连接', code)
                })
                connection.on("error", function (code, reason) {
                    // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
                    try {
                        connection.close();
                    } catch (error) {
                        console.log('close异常', error)
                    }
                    console.log('异常关闭', code, reason)
                });
            }).listen(8001, function (res) { 
                console.log("websocket启动成功！");
                resolve();
            });
            // 创建失败的时候
            this.socketServer.on('error', () => {
                console.log("socket创建失败");
                reject();
            });
            // 所有连接释放时，清空聊天室用户
            this.socketServer.on('close', () => {
                this.chatUsers = [];
            });
        });   
    }
    // 广播通知
    boardcast(data) {
        this.socketServer.connections.forEach(function (conn) {
            conn.sendText(JSON.stringify(data));
        });
    }
    // 给指定人群发送消息
    sendMsg(users,data) { 
        this.socketServer.connections.forEach(function (conn) {
            if (users.includes(conn.id)) { 
                conn.sendText(JSON.stringify(data));
            }
        });
    }
}
const socketServer = new Socket();
module.exports = socketServer;