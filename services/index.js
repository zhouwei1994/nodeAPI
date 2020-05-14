const models = require('../models');
let services = module.exports;
services.back = function (data = null, msg = "", code = 0, callback) {
    if (data) {
        code = 200;
    }
    return {
        data: data,
        code: code,
        msg: msg,
    };
}
//数据检查
services.check = function (data, must, callback) {
    return new Promise((resolve, reject) => {
        let success = true;
        for (let item of must) {
            if (data[item] == undefined) {
                success = false;
                resolve({
                    code: 0,
                    data: {},
                    msg: "缺少参数：" + item
                });
                break;
            }
        }
        if (success) {
            if (callback) {
                callback(resolve,function (data = null, msg = "", code = 0, callback) {
                        if (data) {
                            code = 200;
                        }
                        resolve({
                            data: data,
                            code: code,
                            msg: msg,
                        })
                    }
                );
            } else {
                return true;
            }
        } else {
            
        }
    });
};

require('./common/common')(services, models);
require('./common/loginRegister')(services, models);