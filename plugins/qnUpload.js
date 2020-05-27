const qiniu = require('qiniu');
const config = require('./../config');
// 获取储存路径
function getUploadPath() { 
    return "files/" + (new Date().format("yyyy/MM-dd"));
}
module.exports = function () { 
    const mac = new qiniu.auth.digest.Mac(config.qn_accessKey, config.qn_secretKey);
    const options = {
        scope: config.qn_bucket,
        expires: 7200
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    console.log("七牛云上传信息",uploadToken);
    return {
        token: uploadToken,
        visitPrefix: config.qn_domainName,
        folderPath: getUploadPath()
    };
}