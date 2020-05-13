const { upload } = require('../../plugins/upload');
module.exports = function (router, services) {

    // router.post('/public/login', router.check(["username", "password", "code"], function (req, res) {
    //     if (req.cookies.captcha == req.data.code || req.data.code == 123123) {
    //         loginDao(req.data.username, req.data.password).then(
    //             data => {
    //                 if (data.length <= 0) {
    //                     res.result({}, 1001, "用户名或密码错误");
    //                 } else {
    //                     let userInfo = data[0];
    //                     //设置cookie
    //                     res.cookie('token', userInfo.id, {
    //                         maxAge: 900000,
    //                         path: '/'
    //                     });
    //                     //返回数据时，请求头携带token
    //                     res.setHeader("token", userInfo.id);
    //                     userInfo.redDot = 5;
    //                     //把用户信息缓存到redis
    //                     redis.set("userInfo:" + userInfo.id, JSON.stringify(userInfo)).then(da => {
    //                         //查询缓存里面是否有项目
    //                         redis.get("project:" + userInfo.id).then(data => {
    //                             let projectData = JSON.parse(data);
    //                             console.log(projectData);
    //                             let resData = {
    //                                 ...userInfo,
    //                                 projectUrl: "pages/"+userInfo.id+"/"+projectData.pages[0].pageName+".html"
    //                             };
    //                             res.result(resData);
    //                         }, err => {
    //                             let resData = {
    //                                 ...userInfo,
    //                                 projectUrl: ""
    //                             };
    //                             res.result(resData);  
    //                         });
    //                     }, err => {
    //                         res.result({}, 2002, err);
    //                     });
    //                 }
    //             }
    //         );
    //     } else {
    //         res.result({}, 1002, "验证码不正确");
    //     }
    // }));
    // //图片验证码
    // router.get('/public/setCode', check([], function (req, res) {
    //     var captcha = svgCaptcha.create({
    //         // 翻转颜色 
    //         inverse: false,
    //         // 字体大小 
    //         fontSize: 36,
    //         // 噪声线条数 
    //         noise: 2,
    //         // 宽度 
    //         width: 106,
    //         // 高度 
    //         height: 36,
    //     });
    //     // 保存到session,忽略大小写 
    //     req.session = captcha.text.toLowerCase();
    //     //保存到cookie 方便前端调用验证
    //     res.cookie('captcha', req.session);
    //     res.setHeader('Content-Type', 'image/svg+xml');
    //     res.write(String(captcha.data));
    //     res.end();
    // }));

    // //随便返回数据
    // router.get('/public/casual', check([], function (req, res) {
    //     res.result({
    //         a: 1,
    //         b: 2,
    //         c: 3
    //     });
    // }));
    router.get('/public/casual1', function (req, res) {
        res.json({
            data: [{
                "id": "10001",
                "username": "杜甫",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "点击此处，显示更多。当内容超出时，点击单元格会自动显示更多内容。",
                "experience": "116",
                "ip": "192.168.0.8",
                "logins": "108",
                "joinTime": "2016-10-14"
            }, {
                "id": "10002",
                "username": "李白",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "君不见，黄河之水天上来，奔流到海不复回。 君不见，高堂明镜悲白发，朝如青丝暮成雪。 人生得意须尽欢，莫使金樽空对月。 天生我材必有用，千金散尽还复来。 烹羊宰牛且为乐，会须一饮三百杯。 岑夫子，丹丘生，将进酒，杯莫停。 与君歌一曲，请君为我倾耳听。(倾耳听 一作：侧耳听) 钟鼓馔玉不足贵，但愿长醉不复醒。(不足贵 一作：何足贵；不复醒 一作：不愿醒/不用醒) 古来圣贤皆寂寞，惟有饮者留其名。(古来 一作：自古；惟 通：唯) 陈王昔时宴平乐，斗酒十千恣欢谑。 主人何为言少钱，径须沽取对君酌。 五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。",
                "experience": "12",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14",
                "LAY_CHECKED": true
            }, {
                "id": "10003",
                "username": "王勃",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "65",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }, {
                "id": "10004",
                "username": "李清照",
                "email": "xianxin@layui.com",
                "sex": "女",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "666",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }, {
                "id": "10005",
                "username": "冰心",
                "email": "xianxin@layui.com",
                "sex": "女",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "86",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }, {
                "id": "10006",
                "username": "贤心",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "12",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }, {
                "id": "10007",
                "username": "贤心",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "16",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }, {
                "id": "10008",
                "username": "贤心",
                "email": "xianxin@layui.com",
                "sex": "男",
                "city": "浙江杭州",
                "sign": "人生恰似一场修行",
                "experience": "106",
                "ip": "192.168.0.8",
                "logins": "106",
                "joinTime": "2016-10-14"
            }],
            total: 900
        });
    });
    //根据用户ID搜索用户
    router.get('/public/set_user_info', function (req, res) {
        var id = req.query.id;
        getUserInfoService(id).then(data => {
            res.send(data);
        });
    });
    //上传图片到本地
    router.post('/public/upload_file', upload);
    //修改用户资料
    router.post('/public/modify_user_info', function (req, res) {
        var userId = req.body.userId;
        var headImg = req.body.headImg;
        var nickname = req.body.nickname;
        modifyUserInfo(userId, headImg, nickname).then(data => {
            res.send(data);
        });
    });
    //申请添加好友
    router.get('/public/add_friend', function (req, res) {
        var userId = req.query.userId;
        var acceptID = req.query.acceptID;
        var reason = req.query.reason;
        addFriendService(userId, acceptID, reason).then(data => {
            res.send(data);
        });
    });
    //同意|拒绝添加好友
    router.get('/public/agree_add_friend', function (req, res) {
        var userId = req.query.userId;
        var id = req.query.id;
        var state = req.query.state;
        agreeAddFriendService(userId, id, state).then(data => {
            res.send(data);
        });
    });
    //好友申请列表
    router.get('/public/add_friend_list', function (req, res) {
        var userId = req.query.userId;
        addFriendListService(userId).then(data => {
            res.send(data);
        });
    });
    // // /user 节点接受 PUT 请求
    // router.put('/user', function (req, res) {
    //     res.send('Got a PUT request at /user');
    // });

    // // /user 节点接受 DELETE 请求
    // router.delete('/user', function (req, res) {
    //     res.send('Got a DELETE request at /user');
    // });

    // //不管使用 GET、POST、PUT、DELETE 或其他任何 http 模块支持的 HTTP 请求，句柄都会得到执行
    // router.all('/secret', function (req, res, next) {
    //     console.log('Accessing the secret section ...');
    //     next(); // pass control to the next handler
    // });
}