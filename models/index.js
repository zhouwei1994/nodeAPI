let { init, exec, sql, transaction } = require('mysqls');
class Models {
    constructor() {
        this.exec = exec;
        this.sql = sql;
        this.transaction = transaction;
    }
    init(config) { 
        // 可在项目的启动时初始化配置
        init({
            host: config.mysql_host,
            user: config.mysql_user,
            password: config.mysql_password,
            database: config.mysql_database,
            port: config.mysql_port,
        });
        console.log("mysql数据库连接成功！");
    }
}
let model = new Models();
require('./users.js')(model);
module.exports = model;
