var express = require("express");
var app = express();
app.use('/', require('./src/UploadView'));
var server = app.listen(3000, function(){});