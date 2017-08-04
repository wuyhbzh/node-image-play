var express = require('express');
var router = express.Router();
var formidable = require('formidable');

var fs = require('fs');
var tsharp = require('./PlistShears');

var _pngPath = 'static/dingque.png';

/* 上传页面 */
router.get('/', function (req, res, next) {
    res.sendfile('views/UploadView.html');
});

/* 上传*/
router.post('/uploadfile', function (req, res, next) {
    console.log("ok");

    var form = new formidable.IncomingForm(); //创建上传表单  
    form.encoding = 'utf-8'; //设置编辑  
    form.uploadDir = 'static'; //设置上传目录  
    form.keepExtensions = true; //保留后缀  
    form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小 k  
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.send(err);
            return;
        }
        // console.log(fields, "-------------", files);
        console.log(files.fileUpload.name);
        console.log(files.fileUpload.path);
        tsharp.dojob(files.fileUpload.path, _pngPath);
        res.send("ok la");
    });  

});

module.exports = router;