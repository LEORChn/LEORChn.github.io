var ofur_api = atob('aHR0cHM6Ly9hcGkub2Z1cnJ5LmNvbQ==');
var crew_log = [],
	roles_log = [];
var laststatus = '',
	lastroleids = [],
	lastroles = {},
	lastroles_textmd5 = '';
var starttime = Date.now();
function backup(){
	localStorage['ofur_crew_' + starttime] = JSON.stringify(crew_log);
	localStorage['ofur_roles_' + starttime] = JSON.stringify(roles_log);
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
		roles_log.push(lastroles);
	}, 20000);
}
function getRoleInfo(type, roleId, func){
	http(`get ${ofur_api}/getRoleInfo?type=${type}${roleId? '&roleId=' + roleId: ''}&_=${Date.now()}`, func);
}
