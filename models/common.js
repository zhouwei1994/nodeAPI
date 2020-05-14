module.exports = function (model) {
    // 查询APP最新版本
    model.getAppVersion = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("app_version").where({
                type: data.type,
                versionCode: {
                    gt: data.version
                }
            }).select()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
    // 地区三级联动
    model.getRegion = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("areas").where({
                pid: data.pid
            }).select()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
    // 平台协议
    model.getProtocol = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("protocol").where({
                type: data.type
            }).select()).then(res => {
                console.log(res);
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
}