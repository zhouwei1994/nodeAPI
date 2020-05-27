module.exports = function (services, models) {
    // 最新APP版本
    services.getAppVersion = function (data) {
        return services.check(data, ["type", "version"], function (resolve, callback) {
            models.getAppVersion(data).then(res => {
                if (res.length > 0) {
                    let updateVersion = null;
                    res.forEach(item => {
                        if (!updateVersion || updateVersion.versionCode < item.versionCode) {
                            if (item.forceUpdate == 1) { 
                                item.forceUpdate = true;
                            } else {
                                item.forceUpdate = false;
                            }
                            updateVersion = item;
                        }
                    });
                    if (updateVersion) {
                        callback(updateVersion);
                    } else {
                        callback(null, "暂无新版本");
                    }
                } else {
                    callback(null, "暂无新版本");
                }
            }, err => {
                callback(null, err);
            });
        });
    }
    // 地区三级联动
    services.getRegion = function (data) {
        return services.check(data, ["pid"], function (resolve, callback) {
            models.getRegion(data).then(res => {
                if (res.length > 0) {
                    let regionList = [];
                    res.forEach(item => {
                        regionList.push({
                            objId: item.id,
                            pid: item.pid,
                            level: item.level,
                            name: item.name
                        });
                    });
                    callback(regionList);
                } else {
                    callback(null, "未找到地区数据");
                }
            }, err => {
                callback(null, err);
            });
        });
    }
    // 平台协议
    services.getProtocol = function (data) {
        return services.check(data, ["type"], function (resolve, callback) {
            models.getProtocol(data).then(res => {
                if (res.length > 0) {
                    callback(res[0].content);
                } else {
                    callback(null, "未找到协议数据");
                }
            }, err => {
                callback(null, err);
            });
        });
    }
}