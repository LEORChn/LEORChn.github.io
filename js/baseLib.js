var htmlhead=document.head,
 htmlbody=document.body;
(function(){
	if(!('innerText' in document.body)){
		HTMLElement.prototype.__defineGetter__("innerText", function(){ return this.textContent; });
		HTMLElement.prototype.__defineSetter__("innerText", function(s){ return this.textContent=s; });
	}
})();
function isReady(){return document.readyState.toLowerCase()=='complete'}
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag, t){var d=document.createElement(tag); if(t)d.innerText=t; return d;}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function vaild(o){return!(o==undefined||o==null||isNaN(o));}
function gquery(n){
	var r=location.search.match(new RegExp("[\?\&]"+n+"=([^\&]+)","i"));
	return r==null||r.length<1?'':r[1];
}

(function(){for(var i=0,a=fc('webp');i<a.length;i++) webpReplace(a[i]);})();
function webpReplace(e,u){
	var a=new Image();
	a.src=/url\(\"?([^\"]*)\"?\)/.exec(e.style.backgroundImage)[1];
	a.onerror=function(){
		e.style.backgroundImage=u? u: 'url('+this.src.replace(/\.webp$/,'.png')+')';
		if(!fv('webpnotice')){
			var n=ct('div','您的浏览器不支持 WebP。'),m=ct('a','维基百科');
			n.id='webpnotice'; n.style.cssText='position:fixed; right:0; top:0; background-color:#fff; z-index:999';
			m.href="https://en.wikipedia.org/wiki/WebP"; m.target="_blank";
			n.appendChild(m); htmlbody.appendChild(n);
		}
	}
}

function getAbsMousePos(){ // 相对于页面获取的光标和触摸位置，适用于属性 position 的值是 absolute 的元素（相对于整个文档根部） // TODO: 总感觉这个有BUG没修
	var x,y,r=document.documentElement, e = window.event;
	if(e instanceof MouseEvent){
		x=e.clientX+htmlbody.scrollLeft+r.scrollLeft,
		y=e.clientY+htmlbody.scrollTop+r.scrollTop; 
	}else if(e instanceof TouchEvent){
		e=e.touches[0];
		x=e.pageX;
		y=e.pageY;
	}
	return{ x:x, y:y };
}
function getFixMousePos(){ // 相对于屏幕获取的光标和触摸位置，适用于属性 position 的值是 fixed 的元素
	var x,y,r=document.documentElement, e = window.event;
	if(e instanceof MouseEvent){
		x=e.clientX,
		y=e.clientY; 
	}else if(e instanceof TouchEvent){
		e=e.touches[0];
		x=e.clientX;
		y=e.clientY;
	}
	return{ x:x, y:y };
}

function hasClass(e,n){ return !!e.className.match(new RegExp("(\\s|^)"+n+"(\\s|$)")); }
function addClass(e,n){ if(!hasClass(e,n)) e.className+=' '+n; }
function removeClass(e,n){ if(hasClass(e,n)) e.className=e.className.replace(new RegExp('(\\s|^)'+n+'(\\s|$)'), ' '); }

function imports(){
	if(arguments.length == 1) arguments = arguments[0].split(',');
	if(arguments[0] instanceof Array) arguments = arguments[0];
	for(var i=0,a=arguments;i<a.length;i++) addJs(a[i]);
}
function addJs(url,async){
	var d=ct('script');
	if(async) d.async='async';
	d.type='application/javascript';
	d.src= /\$$/.test(url)?
		url.trim().replace(/\$$/,''):
		url.trim()+(/\.js$/i.test(url)?'':'.js');
	htmlbody.appendChild(d);
}
function addCss(url) {
	var link = ct('link');
	link.type='text/css';
	link.rel ='stylesheet';
	link.href= url;
	htmlhead.appendChild(link);
}

function cok_a(n,v,timeExpire,timeShift){
	if(timeExpire || timeShift){
		if(!(timeExpire instanceof Number || timeExpire instanceof Date)) timeExpire=new Date().getTime();
		if(!timeShift instanceof Number) timeShift=0;
		document.cookie=n+'='+escape(v)+';expires='+new Date(timeExpire+timeShift).toGMTString();
	}else
		document.cookie=n+'='+escape(v);
	return cok(n);
}
function cok(n){
	var k=document.cookie.match(new RegExp('(^| )'+n+'=([^;]*)(;|$)'));
	if(k)return unescape(k[2]);
	else return'';
}
function cok_d(n){
	var e=new Date();
	e.setTime(e.getTime()-1);
	document.cookie=n+'=0;expires='+e.toGMTString();
}
