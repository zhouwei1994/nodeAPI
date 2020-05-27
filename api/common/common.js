const qnUpload = require('../../plugins/qnUpload');
module.exports = function (router, services) {
    // 地区三级联动
    router.get('/api/common/v1/region', async function (req, res) {
        let data = await services.getRegion(req.query);
        res.json(data);
    });
    
    // 平台协议
    router.get('/api/common/v1/protocol', async function (req, res) {
        let data = await services.getProtocol(req.query);
        res.json(data);
    });

    // 七牛云上传
    router.get('/api/common/v1/qn_upload', async function (req, res) {
        res.json(services.back(qnUpload()));
    });
}