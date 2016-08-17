var parse = require("fontpath/lib/index");
var path = require("path"); 
var fs = require("fs");
var proc = require("child_process");

exports.convert = function (dir, fontName, callback){
	var clb = callback || function(){};
	var ttf = path.join(dir, fontName);
	var fontpathOptions = { 
		output: path.join(dir, fontName, fontName+".json"),
		resolution: 72,
  		size: 64,
  		charcodes: 'all' 
  	}
  	var fontpathReady = false;
  	var fontConverterReady = false;
  	var error = null;

  	fs.readFile(ttf+".ttf", function(err, buffer) {
		if (err) {
			error = err;
			fontpathReady = true;
			return;
		}
		parse(buffer, fontpathOptions);
		fontpathReady = true;
	});
  	var cmd = "java -jar \""+path.join(__dirname, "converter.jar") + "\" \""+fontName+"\""+" \""+path.join(__dirname, "chars.txt") + "\"";
  	var converter = proc.exec(cmd, {cwd: dir}, function(err, stdout, stderr){
		if (err){
			error = err;
		}
		fontConverterReady = true;
	});

	while(!fontpathReady && !fontConverterReady) {
    	require('deasync').runLoopOnce();
  	}

  	callback(error, path.join(dir, fontName));
}