module.exports = function (model) {
    // 根据邮箱查询用户数据
    model.getEmailUser = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("users").where({
                email: data.email
            }).select()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
    // 用户注册写入
    model.userRegisterWrite = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("users").data(data).insert()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
    // 修改用户信息
    model.userDataModify = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("users").data(data).where({ email: data.email }).update()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
    // 写入用户登录信息
    model.userLoginLogWrite = function (data) {
        return new Promise((resolve, reject) => {
            model.exec(model.sql.table("user_login_logs").data(data).insert()).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err.message);
            });
        });
    }
}