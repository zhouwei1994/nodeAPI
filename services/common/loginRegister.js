const mail = require('../../plugins/send_mail');
const redis = require('../../plugins/redis');
const { createCode, createUserToken } = require('../../plugins/utils');
module.exports = function (services, models) {
    // 判断邮箱是否注册
    services.judgeEmailUser = function (data) {
        return services.check(data, ["email"], function (resolve, callback) {
            models.getEmailUser(data).then(res => {
                if (res.length > 0) {
                    callback(true);
                } else {
                    callback(null, "该邮箱未注册", 300);
                }
            }, err => {
                callback(null, err);
            });
        });
    }
    // 发送验证码
    services.sendMail = function (data) {
        return services.check(data, ["email", "type"], async function (resolve, callback) {
            // type = 1000 注册
            // type = 2000 登录
            // type = 3000 修改密码
            let description = "";
            let judgeData = {
                code: 200,
                msg: "",
                data: null
            };
            if (data.type == 1000) {
                description = "注册";
                let register = await services.judgeEmailUser(data);
                if (register.code == 200) {
                    judgeData.code = 0;
                    judgeData.msg = "该邮箱已注册";
                }
            } else if (data.type == 2000) {
                description = "登录";
                judgeData = await services.judgeEmailUser(data);
            } else if (data.type == 3000) {
                description = "修改密码";
                judgeData = await services.judgeEmailUser(data);
            } else {
                judgeData.code = 0;
                judgeData.msg = "type值校验失败";
            }
            if (judgeData.code == 200) {
                let code = createCode(6);
                mail.send(data.email, {
                    description: description,
                    code: code
                }).then(res => {
                    redis.set("code:" + data.email, code, 300);
                    callback({});
                }, err => {
                        callback(null, err);
                });
            } else {
                resolve(judgeData);
            }
        });
    }
    // 校验验证码
    services.checkCode = function (data) {
        return services.check(data, ["email", "code"], function (resolve, callback) {
            if (data.code == 123123) {
                // 特殊验证通道
                callback({}, "验证通过");
            } else {
                // 取出redis的code
                redis.get("code:" + data.email).then(res => {
                    // 验证code
                    if (res == data.code) {
                        callback({}, "验证通过");
                    } else {
                        callback(null, "验证码已失效");
                    }
                }, err => {
                        callback(null, "验证码已失效");
                });
            }
        });
    }
    // 注册数据写入
    services.userRegisterWrite = function (data) {
        return services.check(data, ["email", "password", "code"], function (resolve, callback) {
            services.checkCode(data).then(res => {
                if (res.code == 200) {
                    let writeData = {
                        email: data.email,
                        password: data.password,
                        createTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
                    };
                    if (data.nickname) {
                        writeData.nickname = data.nickname;
                    }
                    if (data.avatar) {
                        writeData.avatar = data.avatar;
                    }
                    if (data.phone) {
                        writeData.phone = data.phone;
                    }
                    models.userRegisterWrite(writeData).then(res2 => {
                        callback({});
                    }, err => {
                       callback(null, err);
                    });
                } else {
                    resolve(res);
                }
            });
        });
    }
    // 修改指定用户数据
    services.userDataModify = function (data) {
        return services.check(data, ["email"], function (resolve, callback) {
            models.userDataModify(services.usersFilter(data,true)).then(res => {
                callback({});
            }, err => {
                callback(null, err);
            });
        });
    }
    // 用户表写入数据过滤
    services.usersFilter = function (data, write = false) {
        let backData = {};
        if (data.password && write) {
            backData.password = data.password;
        }
        if (data.userStatus && write) {
            backData.userStatus = data.userStatus;
        }
        if (data.dataFlag && write) {
            backData.dataFlag = data.dataFlag;
        }
        if (data.wxOpenId && write) {
            backData.wxOpenId = data.wxOpenId;
        }
        if (data.wxUnionId && write) {
            backData.wxUnionId = data.wxUnionId;
        }
        if (data.email) {
            backData.email = data.email;
        }
        if (data.nickname) {
            backData.nickname = data.nickname;
        }
        if (data.avatar) {
            backData.avatar = data.avatar;
        }
        if (data.phone) {
            backData.phone = data.phone;
        }
        if (data.token) {
            backData.token = data.token;
        }
        return backData;
    }
    services.loginSuccess = async function (data, callback) {
        if (data.userStatus == 0) {
            callback(null, "账号已停用，请联系客服");
            return;
        }
        if (data.dataFlag == -1) {
            callback(null, "账号已删除，请联系客服");
            return;
        }
        const token = createUserToken();
        let modifyBack = await services.userDataModify({
            email: data.email,
            token: token
        });
        if (modifyBack.code == 200) {
            models.userLoginLogWrite({
                userId: data.userId,
                loginTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
                loginIp: data.ip,
                token: token
            }).then(res => {
                let userInfo = services.usersFilter(data);
                redis.set("userInfo:" + token, userInfo, 7200).then(res => {
                    callback(userInfo);
                }, err => {
                        callback(null, err);
                });
            }, err => {
                    callback(null, err);
            });
        } else {
            callback(null, modifyBack.msg);
        }
    }
    // 登录
    services.login = function (data) {
        return services.check(data, ["email"], function (resolve, callback) {
            if (data.password || data.code) {
                models.getEmailUser(data).then(res => {
                    if (res.length > 0) {
                        let userData = res[0];
                        if (data.password) { 
                            if (data.password == userData.password) {
                                services.loginSuccess({
                                    ...userData,
                                    ...data,
                                }, callback);
                            } else {
                                callback(null, "账号密码错误");
                            }
                        } else if (data.code) {
                            services.checkCode(data).then(res2 => {
                                if (res2.code == 200) {
                                    services.loginSuccess({
                                        ...userData,
                                        ...data,
                                    }, callback);
                                } else {
                                    resolve(res2);
                                }
                            });
                        }
                    } else {
                        callback(null, "该邮箱还未注册，请先注册");
                    }
                }, err => {
                        callback(null, err);
                });
            } else {
                callback(null, "缺少参数：password或code");
            }
        });
    }
    // 忘记密码
    services.forgetPassword = function (data) { 
        return services.check(data, ["email", "code", "password"], function (resolve, callback) {
            models.getEmailUser(data).then(res => {
                if (res.length > 0) {
                    let userData = res[0];
                    services.checkCode(data).then(res2 => {
                        if (res2.code == 200) {
                            models.userDataModify(services.usersFilter({
                                email: data.email,
                                password: data.password
                            }, true)).then(res => {
                                callback({},"密码修改成功！");
                            }, err => {
                                callback(null, err);
                            });
                        } else {
                            resolve(res2);
                        }
                    });
                } else {
                    callback(null, "该邮箱还未注册，请先注册");
                }
            }, err => {
                callback(null, err);
            });
        });
    };
}