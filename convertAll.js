var converter = require("./index.js");
var fs = require("fs");

var files = fs.readdirSync("fonts");
for (var i = 0; i < files.length; i++){
	var fname = files[i];
	var fstats = fs.statSync("fonts/"+fname);
	if (!fstats.isDirectory()){
		converter.convert("./fonts", fname.split('.')[0], function(err, font){
			if (err){
				console.log(err);
			} else {
				console.log("Ready: ", font);
			}
		});
	}
}