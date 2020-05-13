module.exports = function (router, services) { 
    //随便返回数据
    router.get('/public/casual', function (req, res) {
        res.send({
            a: 1,
            b: 2,
            c: 3
        });
    });
}