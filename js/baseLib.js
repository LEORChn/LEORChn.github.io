var htmlhead=document.head,
 htmlbody=document.body;
(function(){
	// IE Method Compat pak 1
	var string_includes = function(s){ return this.indexOf(s)>-1; };
	_proto(String, 'contains', string_includes);
	_proto(String, 'includes', string_includes);
	
	/* 这个IF里面判断的东西可以在不需要兼容IE9时删除。。 */
	if(window['ActiveXObject']){
		var varprop = function(name, type, func){
			if(!('__var_pool' in this)) this['__var_pool'] = {};
			if(!(name in this.__var_pool)){
				Object.defineProperty(this, name,
					this.__var_pool[name] = {
						get: function(){},
						set: function(){}
					}
				);
			}
			this.__var_pool[name][type] = func;
		};
		Object.prototype['__defineGetter__'] = function(name, func){
			varprop(name, 'get', func);
		};
		Object.prototype['__defineSetter__'] = function(name, func){
			varprop(name, 'set', func);
		}
		// window.File 最低支持：IE10
		if(!('File' in window))
			window.File = function(){};
		// window.HTMLInputElement 继承到 Object 的最低支持：IE9
		_proto(HTMLInputElement, '__defineGetter__', function(){});
		_proto(HTMLInputElement, '__defineSetter__', function(){}); // TODO：其实是无效的
		// window.HTMLElement 最低支持：IE9
		if(!('HTMLElement' in window))
			window.HTMLElement = function(){};
		// document.getElementsByClassName 最低支持：IE9
		if(!('getElementsByClassName' in document))
			document.getElementsByClassName = function(n){
				var res = [];
				for(var i=0, a=document.all; i<a.length; i++)
					if((' '+a[i].className+' ').includes(' '+n+' '))
						res.push(a[i]);
				return res;
			};
	}
	/* 上面这个IF里面判断的东西可以在不需要兼容IE9时删除。。 */
	
	// Generic Method Compat
	var imed=false;
	HTMLInputElement.prototype.__defineGetter__('imeDisabled',function(){ return imed? true: false; });
	HTMLInputElement.prototype.__defineSetter__('imeDisabled',function(s){
		imed = s? true: false;
		this.onkeyup = imed? function(){
			var sel = this.selectionStart,
				sav = this.value,
				right = sav.substr(sel),
				lef = sav.substr(0, sel),
				aft = lef.replace(/'/g, ''),
				wipecount = lef.length - aft.length;
			if(sel != this.selectionEnd) return;
			this.blur();
			this.focus();
			this.value = aft + right;
			this.selectionStart = this.selectionEnd = sel - wipecount;
		}: undefined;
	});
	
	// Firefox Method Compat
	if(!('innerText' in document.body)){
		HTMLElement.prototype.__defineGetter__("innerText", function(){ return this.textContent; });
		HTMLElement.prototype.__defineSetter__("innerText", function(s){ return this.textContent=s; });
	}
	
	// Constom Method Modify
	_proto(Array, 'foreach', function(func){ for(var i=0; i<this.length; i++) try{ if(func(this[i], i, this)) return true; }catch(e){ pl(e); } }, true);
	var norepeat = function(){
		return (_this = this).filter(function(e, i){
			return _this.indexOf(e) == i;
		});
	};
	_proto(Array, 'filterRepeat', norepeat);
	_proto(Array, 'removeRepeat', norepeat);
	
	_proto(HTMLElement, 'appendChildren', function(){ var t = this; arr(arguments).foreach(function(e){ t.appendChild(e); }); });
	_proto(HTMLElement, 'prependChild', function(e){
		var f=this.firstElementChild;
		if(f) this.insertBefore(e,f); else this.appendChild(e);
	});
	_proto(HTMLElement, 'insertAfter', function(e,f){
		f=f.nextElementSibling;
		if(f) this.insertBefore(e,f); else this.appendChild(e);
	});
	_proto(Event, 'block', function(){ this.preventDefault(); this.stopPropagation(); });
	_proto(File, 'readAsText', function(f){ // 最低支持：IE10
		switch(true){
			case f.constructor.name=='Function':
				var r=f;
				f=new FileReader();
				f.onload=function(p){
					r(p.target.result, p);
				};
			case f instanceof FileReader:
				f.readAsText(this);
				return f; // FileReader
		}
	});
	_proto(String, 'format', function(){
		_this = this;
		var args = arr(arguments);
		if(args[0].constructor === Array) args = args[0];
		args.foreach(function(e, i){
			_this = _this.replace(new RegExp("\\{" + i + "\\}", "gm"), e);
		});
		
		// 检查有没有没替换的可能
		var res = /\{(\d+)\}/gm.exec(_this);
		if(res) console.warn('文本：'+this.left(10)+'... 格式化时可能出现问题，未包含第'+res[1]+'号参数。');
		
		return _this;
	});
	
	// Visual Basic
	_proto(String, 'left', function(n){ return this.substr(0, Math.abs(n)); });
	_proto(String, 'right', function(n){ n=Math.abs(n); return this.substr(-n, n); });
	
	// IE Method Compat pak 2
	_proto(HTMLElement, 'remove', function(){ try{this.parentElement.removeChild(this);}catch(e){} });
	if('EventTarget' in window)
		_proto(EventTarget, 'addEventListener', function(n,f){ this.attachEvent('on'+n, f); });
	if(!('startsWith' in String)){
		_proto(String, 'startsWith', function(s){ return this.left(s.length) == s; });
		_proto(String, 'endsWith', function(s){ return this.right(s.length) == s; });
	}
})();
function _proto(obj, name, fun, force){
	if(obj instanceof Function && obj.name == 'Object'){
		pl('不能修改 Object 基类，因为这会导致 jQuery 异常。');
		return;
	}
	if(!(name in obj.prototype) || force){
		obj.prototype[name] = fun;
		console.debug('baseLib - 已修改方法：' + obj.name + '.' + name);
	}else{
		console.info('baseLib - 未修改方法：' + obj.name + '.' + name);
	}
}
function isReady(){return document.readyState.toLowerCase()=='complete'}
function $(e){return document.querySelector(e);}
function $$(e){return document.querySelectorAll(e);}
function arr(o){return Array.prototype.slice.call(o);}
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag, t){
	if(arguments.length > 2) pl(new Error('Somewhere might using old version to create Elements. PLEASE UPDATE YOUR CODE.'));
	tag = {
		entity: null,
		raw: tag,
		data: tag.split(/[#\.\s]/g)
	};
	var nextStart = 0;
	tag.data.foreach(function(e){
		nextStart ++;
		if(e.length == 0) return; // continue
		nextStart --;
		switch(tag.raw.charAt(nextStart)){
			case ' ': case '.':
				addClass(tag.entity, e); break;
			case '#':
				tag.entity.id = e; break;
			default:
				tag.entity = document.createElement(e);
				nextStart --;
		}
		nextStart += e.length + 1;
	});
	if(t) tag.entity.innerText = t;
	return tag.entity;
}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function vaild(o){return!(o==undefined||o==null||isNaN(o));}
function gquery(n){ return _GET(n); } // get Query
function _GET(n){
	var r=location.search.match(new RegExp("[\?\&]"+n+"=([^\&]+)","i"));
	return r==null||r.length<1?'':r[1];
}
/*	patch() 参数情况：
	单个EventTarget：直接返回本体
	单个EventTarget但是用数组封装：返回该数组
	多个EventTarget：返回封装数组
	其他情况比如数组和EventTarget混用等：不管他
*/
function patch(){
	var args = arguments,
		insideSelf = args.length==1 && args[0] instanceof EventTarget;
	if(args.length==1 && args[0] instanceof Array) args = args[0]; // 如果参数只是一个数组而且没有别的东西，就分离解析
	for(var i=0; i<args.length; i++){
		args[i].on = function(){
			var prog = 0;
			do{
				var arglen = arguments.length;
				switch(arglen){
					case undefined:
					case 0: return;
					case 1:
						arguments = arguments[0];
						break;
					default:
						if(arguments[arglen-1] instanceof Function); else return; // 最后一个必须是 function
						var event_name = arguments[prog],
							befor_func = this['on'+event_name], // replaceable static function
							after_func = arguments[arglen-1];
						this['on'+event_name] = after_func;
						if(this instanceof EventTarget); else return;
						this['on'+event_name] = befor_func;
						this.addEventListener(event_name, after_func);
						if( ++prog == arglen ) return;
				}
			}while(true);
		}
	}
	if(insideSelf){
		args.on = function(){
			for(var i=0; i<this.length; i++) if(this[i].on) this[i].on(arguments);
		}
	}
	return insideSelf? args[0]: args;
}

(function(){for(var i=0,a=fc('webp');i<a.length;i++) webpReplace(a[i]);})();
function webpReplace(e,u){
	var a=new Image();
	a.src=/url\(\"?([^\"]*)\"?\)/.exec(e.style.backgroundImage)[1];
	a.onerror=function(){
		e.style.backgroundImage=u? u: 'url('+this.src.replace(/\.webp$/,'.png')+')';
		if(fv('webp-notice')) return;
		var root = ct('div'),
			style = ct('style', '#webp-notice{display:none} #webp-notice:checked+div{transform:translateY(-100%); transition:2s}'),
			inp = ct('input#webp-notice'),
			hint = ct('span', '您的浏览器不支持 WebP。'),
			wiki = ct('a','维基百科'),
			btn = ct('label', '关闭提示');
		root.style.cssText = 'position:fixed; right:0; top:0; background-color:#fff; z-index:999';
		wiki.href = "https://en.wikipedia.org/wiki/WebP";
		wiki.target = '_blank';
		inp.type = 'checkbox';
		btn.setAttribute('for', 'webp-notice');
		root.appendChildren(style, hint, wiki, btn);
		htmlbody.appendChildren(inp, root);
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

function hasClass(e,n){ return new RegExp("(\\s|^)"+n+"(\\s|$)").test(e.className); }
function addClass(e,n){ if(!hasClass(e,n)) e.className=(e.className+' '+n).trim(); }
function removeClass(e,n){ removeClassName(e,n); }
function removeClassName(e,n){ if(hasClass(e,n)) e.className=e.className.replace(new RegExp('(\\s|^)'+n+'(\\s|$)'), ''); }

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

function copy(text){
	var ta = document.createElement("textarea");
	ta.style.position = 'fixed';
	ta.style.top = ta.style.left = '100%';
	ta.value = text;
	document.body.appendChild(ta);
	ta.select();
	try{
		var successful = document.execCommand('copy');
		var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
		pl(msg)
	}catch(e){
		alert('浏览器不支持点击复制到剪贴板');
	}
	document.body.removeChild(textArea);
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
