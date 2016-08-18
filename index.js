var parse = require("fontpath/lib/index");
var path = require("path"); 
var fs = require("fs");
var proc = require("child_process");
var Promise = require('promise');

exports.convert = function (dir, fontName, callback){
	var clb = callback || function(){};
	var ttf = path.join(dir, fontName);
	var fontpathOptions = { 
		output: path.join(dir, fontName, fontName+".json"),
		resolution: 72,
  		size: 64,
  		charcodes: 'all' 
  	}
  	var error = null;

  	var fontpathPromise = new Promise (
  		function (resolve, reject) {
  			fs.readFile(ttf+".ttf", function(err, buffer) {
				if (err) {
					reject(err)
				} else {
					parse(buffer, fontpathOptions);
					resolve(buffer);
				}
			});
  	});

  	var converterPromise = new Promise (
  		function (resolve, reject){
		  	var cmd = "java -jar \""+path.join(__dirname, "converter.jar") + "\" \""+fontName+"\""+" \""+path.join(__dirname, "chars.txt") + "\"";
		  	var converter = proc.exec(cmd, {cwd: dir}, function(err, stdout, stderr){
				if (err){
					reject(err);
				}
				resolve(stdout);
			});
		}
  	);

  	Promise.all([fontpathPromise, converterPromise]).done(function(results){
  		console.log("YAY");
	  	callback(null, path.join(dir, fontName));
  	}, function (err){
	  	callback(err);
  		console.log("SUK, pzdc", err);
  	});
  	//callback(error, path.join(dir, fontName));
}