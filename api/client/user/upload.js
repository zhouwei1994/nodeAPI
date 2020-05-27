const { uploadImage, uploadFile } = require('../../../plugins/upload');
module.exports = function (router, services) { 
    //上传图片到本地
    router.post('/api/upload/v1/upload_image', function (req, res) {
        console.log("----------------");
        uploadImage(req, res);
    });
    // 上传文件到本地
    router.post('/api/upload/v1/upload_file', function (req, res){
        uploadFile(req, res);
    });
}