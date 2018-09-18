function http(method,url,formed,dofun,dofail){
	var x=window.ActiveXObject?
		new ActiveXObject("Microsoft.XMLHTTP"):
		new XMLHttpRequest();
	x.timeout=60000;
	x.responseType="text";
	x.open(method.toUpperCase(),url,true);
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
