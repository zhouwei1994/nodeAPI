module.exports = function (router, services) {
    //注册
    router.post('/api/common/v1/register', async function (req, res) {
        let data = await services.judgeEmailUser(req.body);
        if (data.code == 300) {
            let data = await services.userRegisterWrite(req.body);
            res.json(data);
        } else {
            res.json(data);
        }
    });
    // 发送验证码
    router.post('/api/common/v1/send_sms', async function (req, res) {
        let data = await services.sendMail(req.body);
        res.json(data);
    });
    //登录
    router.post('/api/common/v1/login', async function (req, res) {
        let data = await services.login({
            ...req.body,
            ip: req.ip
        });
        res.json(data);
    });
    // 修改密码
    router.post('/api/common/v1/forget_password', async function (req, res) {
        let data = await services.judgeEmailUser(req.body);
        if (data.code == 200) {
            let data = await services.checkCode(req.body);
            if (data.code == 200) {
                let data = await services.userDataModify({
                    email: req.body.email,
                    password: req.body.password 
                });
                res.json(data);
            } else {
                res.json(data);
            }
        } else {
            res.json(data);
        }
    });
}