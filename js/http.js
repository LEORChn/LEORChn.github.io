function http(method,url,formed,dofun,dofail){
	var x=window.ActiveXObject?
		new ActiveXObject("Microsoft.XMLHTTP"):
		new XMLHttpRequest();
	x.timeout=60000;
	x.responseType="text";
	if(location.protocol.includes('https'))
		url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
