function http(method,url,formed,dofun,dofail){
	var x=window.ActiveXObject?
		new ActiveXObject("Microsoft.XMLHTTP"):
		new XMLHttpRequest();
	if(location.protocol.includes('https'))
		url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.timeout=60000;
	x.responseType="text"; // IE要求先open才能设置timeout和responseType
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
function httpj(method, url, formed, dofun, dofail){
	http(method, url, formed, 
		function(){
			var j = eval('('+ (this.responseText || '{}') +')');
			if(!Array.isArray(j)) j.stat = this.status;
			dofun(j);
		},
		dofail);
}
