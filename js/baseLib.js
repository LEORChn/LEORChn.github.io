function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function vaild(o){return!(o==undefined||o==null||isNaN(o));}
function gquery(n){
	var r=location.search.match(new RegExp("[\?\&]"+n+"=([^\&]+)","i"));
	return r==null||r.length<1?'':r[1];
}
function addClass(element,name){
	if(!existsClass(element,name))
		element.className+=' '+name;
}
function removeClass(element,name){//这个之后再说
	if(existsClass(element,name));
		element.className=element.className.replace(new RegExp('\\s?'+name+'\\s?'),' ');
}
function existsClass(element,name){
	return new RegExp('\\s?'+name+'\\s?').test(element.className);
}
function dynamicLoadCss(url) {
	var link = ct('link');
	link.type='text/css';
	link.rel ='stylesheet';
	link.href= url;
	ft('head')[0].appendChild(link);
}
