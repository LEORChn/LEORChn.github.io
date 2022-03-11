var ofur_api = atob('aHR0cHM6Ly9hcGkub2Z1cnJ5LmNvbQ==');
var crew_log = [],
	roles_log = [];
var laststatus = '',
	lastroleids = [],
	latestroleid = 0,
	lastroles = {},
	lastroles_textmd5 = '';
var starttime = Date.now();
function backup(){
	//localStorage['ofur_crew_' + starttime] = JSON.stringify(crew_log);
	//localStorage['ofur_roles_' + starttime] = JSON.stringify(roles_log);
	var crewzip = new JSZip();
	crewzip.file(Date.now() + '.json', JSON.stringify(crew_log));
	crewzip.generateAsync({
		type: "base64",
	    compression: "DEFLATE",
	    compressionOptions: {
	        level: 9
	    }
	}).then(function(e){
		localStorage['ofur_crew_' + starttime] = e;
	});
	
	var rolezip = new JSZip();
	rolezip.file(Date.now() + '.json', JSON.stringify(roles_log));
	rolezip.generateAsync({
		type: "base64",
	    compression: "DEFLATE",
	    compressionOptions: {
	        level: 9
	    }
	}).then(function(e){
		localStorage['ofur_roles_' + starttime] = e;
	});
}
function claw(){
	getRoleInfo(0, null, function(){
		if(laststatus != this.responseText){
			laststatus = this.responseText;
			crew_log.push({
				ts: Date.now(),
				text: laststatus
			});
			console.info(laststatus.length, [laststatus]);
		}
		claw_roles();
	});
}
var roles_outofdate = Date.now();
function claw_roles(){
	var nowlatestid = Math.max.apply(null, lastroleids);
	if(Date.now() - starttime > 7200000 && latestroleid < nowlatestid){
		roles_outofdate = 0;
		latestroleid = nowlatestid;
		// 这个块在开始2小时之后才被允许运行，届时有新注册就会马上结束冷却，并读取新注册的详细信息
	}
	if(Date.now() < roles_outofdate) return;
	roles_outofdate = Date.now() + 3600000;
	var roles = JSON.parse(laststatus).content;
	if(type(roles) != 'Array') return;
	lastroleids = roles.map(function(e){
		return e.roleId;
	});
	lastroleids.foreach(function(e){
		getRoleInfo(1, e, function(){
			try{
				lastroles[e] = this.responseText;
				lastroles[e] = JSON.parse(this.responseText);
			}catch(e){}
		});
	});
	setTimeout(function(){
		var tmp = md5(JSON.stringify(lastroles));
		if(lastroles_textmd5 == tmp) return;
		lastroles_textmd5 = tmp;
		roles_log.push(JSON.parse(JSON.stringify(lastroles)));
	}, 20000);
}
function getRoleInfo(type, roleId, func){
	http(`get ${ofur_api}/getRoleInfo?type=${type}${roleId? '&roleId=' + roleId: ''}&_=${Date.now()}`, func);
}
