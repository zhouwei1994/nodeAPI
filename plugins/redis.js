//引入redis
const redis = require("redis");
class Redis { 
    constructor() { 
        this.client = undefined;
        this.successStart = false;
    }
    init(config) { 
        return new Promise((resolve, reject) => {
            //创建redis客户端
            this.client = redis.createClient(config.redis_port, config.redis_host);
            //鉴权处理(如果redis设置密码的话)
            this.client.auth(config.redis_password);
            //连接成功处理
            this.client.on("ready", () => {
                this.successStart = true;
                console.log("redis连接成功！");
                resolve();
            });
            //连接错误处理
            this.client.on("error", (error) => {
                this.successStart = false;
                console.log(error);
                reject();
            });
        });
    }
    set(key, value, time) {
        return new Promise((resolve, reject) => {
            if (value && typeof (value) == "object") {
                value = JSON.stringify(value);
            }
            this.client.set(key, value, (error, res) => {
                if (error) {
                    reject(error.message);
                    console.log(error);
                } else {
                    resolve(res);
                };
                //判断是否设置过期时间
                if (time) {
                    this.client.expire(key, time);
                }
            });
        });
    }
    get(key) { 
        return new Promise((resolve, reject) => {
            this.client.get(key, function (error, res) {
                if (error) {
                    reject(error.message);
                    console.log(error);
                } else {
                    if (res) {
                        resolve(res);
                    } else {
                        reject("未找到数据");
                    }
                };
            });
        });
    }
    // 设置过期时间
    setExpire(key, time) {
        if (key && time) {
            this.client.expire(key, time);
        } else {
            console.log("redis设置过期时间缺少key和time参数");
        }
    }
    endRedis() { 
        //关闭redis连接
        this.client.end(true);
    }
}
const redisServer = new Redis();
module.exports = redisServer;