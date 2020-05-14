
module.exports = function (router, services) {
    // APP版本更新
    router.get('/api/common/v1/app_version', async function (req, res) {
        let data = await services.getAppVersion(req.query);
        res.json(data);
    });

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
}