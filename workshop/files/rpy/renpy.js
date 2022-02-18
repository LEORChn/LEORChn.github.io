function Renpy(){
	if(this == self) return;
	var scripts = {};
	this.__defineGetter__('data', function(){
		return scripts;
	});
	function updateLabel(n){
		var tl = {},
			keys = [],
			nowlabel;
		scripts[n].foreach(function(e){
			if(e.cmd == 'label'){
				nowlabel = /\w*/.exec(e.args)[0];
				//tl[nowlabel] = {};
			}
			if(e.speak){
				var index = 0, key;
				while((key = `${nowlabel}_${e.hash}${index? '_' + index: ''}`) in tl) index++;
				tl[key] = [e.line, e.name, e.speak];
				keys.push(key);
			}
		});
		scripts[n + '_tl'] = tl;
		scripts[n + '_tl_keys'] = keys;
	}
	return Object.assign(this, {
		parse: function(f){
			return f.text().then(function(e){
				var retext = /(\s*)(\w*)\s*"(.*?)"\s*$/,
					recmd  = /(\s*)(\S*)\s*(.*?)\s*$/;
				scripts[f.name] = e.split('\n').map(function(e, i){
					if(e.trim() == '') return null;
					var t = retext.exec(e);
					if(t && t[2] == 'sound') t = '';
					return t? {
						line:  i + 1,
						space: t[1].length, // 前空格数量
						name:  t[2], // 说话人
						speak: t[3], // 说话内容
						hash:  md5(t[0].trim() + '\r\n').left(8)
					}: (t = recmd.exec(e), {
						line:  i + 1,
						space: t[1].length, // 前空格数量
						cmd:   t[2], // 指令名称
						args:  t[3]  // 指令参数
					});
				}).filter(function(e){
					return e;
				});
				updateLabel(f.name);
			}).catch(pl);
		}
	}) || this;
}
