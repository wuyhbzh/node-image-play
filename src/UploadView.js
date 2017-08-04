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
    console.log("ok");

    // var form = new formidable.IncomingForm(); //创建上传表单  
    // form.encoding = 'utf-8'; //设置编辑  
    // form.uploadDir = 'upload'; //设置上传目录  
    // form.keepExtensions = true; //保留后缀  
    // form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小 k  
    // form.parse(req, function (err, fields, files) {
    //     if (err) {
    //         res.send(err);
    //         return;
    //     }

    //     console.log(files.fileUpload.name);
    //     console.log(files.fileUpload.path);

    //     // tsharp.dojob(files.fileUpload.path, _pngPath);

    //     // res.send(files.fileUpload.name);
    //     // res.send(files.fileUpload.path);
    //     res.send("ok la");
    // });  

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
    })
        .on('file', function (filed, file) {
            allFile.push([filed, file]);//收集传过来的所有文件
        })
        .on('end', function () {
            res.end('上传成功！');
        })
        .on('error', function (err) {
            console.error('上传失败：', err.message);
            next(err);
        })
        .parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
            }
            allFile.forEach(function (file, index) {
                var fieldName = file[0];
                var types = file[1].name.split('.');
                var date = new Date();
                var ms = Date.parse(date);
                fs.renameSync(file[1].path, form.uploadDir + "/" + types[0] + "." + String(types[types.length - 1]));//重命名文件，默认的文件名是带有一串编码的，我们要把它还原为它原先的名字。
            });
        });
});

module.exports = router;