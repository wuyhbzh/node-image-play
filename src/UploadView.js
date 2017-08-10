var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var tsharp = require('./PlistShears');

var _pngPath = 'static/dingque.png';

router.get('/', function (req, res, next) {
    res.send('image play');
});

router.get('/plist', function (req, res, next) {
    res.sendfile('views/UploadView.html');
});

/* 上传*/
router.post('/uploadplist', function (req, res, next) {

    var form = formidable.IncomingForm({
        encoding: 'utf-8',//上传编码
        uploadDir: "upload",//上传目录，指的是服务器的路径，如果不存在将会报错。
        keepExtensions: true,//保留后缀
        maxFieldsSize: 2 * 1024 * 1024//byte//最大可上传大小
    });

    var allFile = [];

    form.on('progress', function (bytesReceived, bytesExpected) {//在控制台打印文件上传进度
        var progressInfo = {
            value: bytesReceived,
            total: bytesExpected
        };
        console.log('[progress]: ' + JSON.stringify(progressInfo));
        res.write(JSON.stringify(progressInfo));
    });

    form.on('file', function (filed, file) {
        allFile.push([filed, file]);//收集传过来的所有文件
    });

    form.on('end', function () {
        res.end('上传成功！');
    });

    form.on('error', function (err) {
        console.error('上传失败：', err.message);
        next(err);
    });

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        }
        allFile.forEach(function (file, index) {
            var fieldName = file[0];
            var types = file[1].name.split('.');
            var date = new Date();
            var ms = Date.parse(date);
            fs.renameSync(file[1].path, form.uploadDir + "/" + fieldName + "." + String(types[types.length - 1]));//重命名文件，默认的文件名是带有一串编码的，我们要把它还原为它原先的名字。
        });
    });

});

module.exports = router;