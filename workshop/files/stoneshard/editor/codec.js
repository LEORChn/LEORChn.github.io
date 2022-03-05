var fs = {};
var saltfmt = 'rd shA !{0}! 1 s_v cter ra cha One! st';
function filesInput(f){
	fs = files2fs(f).characters_v1;
}
function files2fs(files){
	var fs = {};
	files.foreach(function(e){
		var fspath = fs, paths = e.webkitRelativePath.split('/');
		paths.pop();
		paths.foreach(function(e){
			if(!(e in fspath)) fspath[e] = {};
			fspath = fspath[e];
		});
		fspath[e.name] = e;
		e.load = function(){
			fileOpen(this, parseToUI);
		};
	});
	saltfmt = saltfmt.split(' ').reverse().join('');
	return fs;
}
function fileOpen(f, fun){
	var path = /[a-z]+_\d+\/[a-z]+_\d+/.exec(f.webkitRelativePath);
	var salt = saltfmt.format((path || [''])[0].replace('/', '!'));
	f.toArrayBuffer().then(function(e){
		try{
			var json_bin = pako.inflate(new Uint8Array(e)),
				json_n_hash_str = new TextDecoder().decode(json_bin),
				j_str = json_n_hash_str.left(json_n_hash_str.lastIndexOf('}') + 1);
			fun(JSON.parse(j_str));
		}catch(e){
			pl(e);
		}
	});
}
function fileSave(s){
	
}
