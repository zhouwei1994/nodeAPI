const qnUpload = require('../../../plugins/qnUpload');
module.exports = function (router, services) {
    // APP版本更新
    router.get('/api/common/v1/app_version', async function (req, res) {
        let data = await services.getAppVersion(req.query);
        res.json(data);
    });
}