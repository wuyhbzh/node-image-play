var fs = require("fs");
var sharp = require('sharp');
var parseString = require('xml2js').parseString;


exports.dojob = function(xmlPath, pngPath){
    var xmldoc = fs.readFileSync(xmlPath);

    parseString(xmldoc, function (err, result) {
        console.log(result);
        var pnglist = result.plist.dict[0].dict[0].dict;
        for (var key in pnglist) {
            var numstr = pnglist[key].string[0];
            var numarr = numstr.match(/\d+(\.\d+)?/g);
            console.log(numarr);

            sharp(pngPath)
                .extract({ left: parseInt(numarr[0]), top: parseInt(numarr[1]), width: parseInt(numarr[2]), height: parseInt(numarr[3]) })
                .toFile('static/' + key + "new.png", function (err) { });
        }
    })
};

var names = '.plist';

var patt1 = new RegExp(names);
console.log(patt1.test('sdfasdf.plist'));