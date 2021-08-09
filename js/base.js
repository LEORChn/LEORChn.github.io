
/* 浏览器兼容性报告
 *   2016年3月8日，Firefox 45 正式支持 HTMLElement.innerText。新于此时间的浏览器支持率为100%
 *   
 */
(function(){

registerObjectAssign(); // Compat target: IE 9
registForArrayLike();

Object.assign.weakly(window, { // global vars
	hhead: document.head,
	hbody: document.body,
	$: function(e){ // named from jQuery
		return document.querySelector(e);
	},
	$$: function(e){ // named from jQuery
		return document.querySelectorAll(e);
	},
	type: function(e){
		var t = typeof(e);
		return t == 'object'? e == null? 'Null': e.constructor.name: t.replace(t[0], t[0].toUpperCase());
	},
	arr: function(e){
		return Array.prototype.slice.call(e);
	},
	pl: function(e){ // named from java System.out.println
		console.log(e);
	},
	_GET: function(n){ // named from php $_GET
		var r = location.search.match(new RegExp('[\?\&]' + n + '=([^\&]+)', 'i'));
		return r == null || r.length < 1? '': r[1];
	},
	ct: function(css, innerText){ // TODO: tagName、id 或 class 中是否仅局限于数字、字母、连字符和下划线？有待验证
		// 第1版本：参数1为tag名称（必填），参数2为css（可选），参数3为innerText（可选）
		// 第2版本：将tag名称与css并入参数1，只要传入两个参数即可
		// 第3版本新增功能：有参数2时，参数1不为必填。如果是这样没有参数1的情况，则转为创建文本节点（TextNode）
		if(arguments.length > 2) pl(new Error('Somewhere might using old version to create Elements. PLEASE UPDATE YOUR CODE.'));
		var entity,
			re = /(^|#|\.|\s)([\w-]+)/g, // 备注：\w 包括 字母、数字和下划线
			r;
		looper: while(r = re.exec(css)){
			switch(r[1]){
				case '':
					entity = document.createElement(r[2]);
					break;
				case '#':
					if(!entity && illegalElementCreationStepWarning()) break looper;
					entity.id = r[2];
					break;
				case '.': case ' ':
					if(!entity && illegalElementCreationStepWarning()) break looper;
					entity.classList.add(r[2]);
					break;
			}
		}
		if(innerText || innerText === '' || innerText === 0){
			if(entity) entity.innerText = innerText;
			else entity = document.createTextNode(innerText);
		}
		return entity;
		function illegalElementCreationStepWarning(){
			console.warn('ct() didnt create an Element but TextNode.\nPlease check the first symbol of css parameter is write for TagName of an Element.\ne.g. should not a space character.');
			return true;
		}
	}
	
});

Object.assign.weakly(String.prototype, { // =====-----<  String  >-----===== //
	left: function(){ // named from vb
		
	},
	right: function(){ // named from vb
		
	},
	format: function(){
		
	},
	copy: function(){
		
	},
	toBlob: function(){
		return new Blob([this]);
	},
	toWorker: function(){
		return new Worker(this.toBlob().toURL());
	},
	includes: generalContains,
	contains: generalContains // named from java
});

Object.assign.weakly(Array.prototype, { // =====-----<  Array  >-----===== //
	foreach: function(func){
		for(var i=0; i < this.length; i++)
			try{
				if(func(this[i], i, this)) return true;
			}catch(e){
				console.warn(e);
			}
	},
	unique: function(){
		var _this = this;
		return this.filter(function(e, i){
			return _this.indexOf(e) == i;
		});
	},
	includes: generalContains,
	contains: generalContains // named from java
});

Object.assign.weakly(Blob.prototype, {
	toURL: function(){
		return URL.createObjectURL(this);
	}
});

Object.assign.weakly(URL.prototype, {
	toAnchor: function(name){
		var a = ct('a', name || this.href);
		a.target = '_blank';
		a.rel = 'nofollow noreferrer noopener';
		a.href = this.href;
		return a;
	}
});

Object.assign.weakly(HTMLElement.prototype, {
	appendChildren: function(){
		var _this = this, a = arguments;
		a = type(a[0]) == 'Array'? a[0]: arr(a);
		a.foreach(function(e){
			_this.appendChild(e);
		});
		return this;
	},
	clearChildren: function(){
		while(this.childNodes.length) this.childNodes[0].remove();
		return this;
	},
	setAttr: function(key, value){
		this.setAttribute(key, value);
		return this;
	}
});

Object.assign.weakly(window, { // old css
	fv: old('fv'),
	ft: old('ft'),
	fc: old('fc'),
	gquery: _GET // @deprecated name
});

window.PromiseChain = function(){
	if(this == window) return;
	var chain = [];
	this.then = then;
	function then(func){
		chain.push(func);
		if(chain.length == 1) next(); // 只有当
	}
	function next(){
		if(!chain.length) return;
		var p = new Promise(chain[0]);
		p.then(function(){
			chain.shift();
			next();
		});
	}
};

function old(fn){
	return document[({
		fv: 'getElementById',
		ft: 'getElementsByTagName',
		fc: 'getElementsByClassName'
	})[fn]];
}

function generalContains(s){ // 用于字符串和数组的，判断自身是否包含给定参数值的函数
	return this.indexOf(s) != -1;
}

function sameas(name){
	return function(){
		return this[name].apply(null, arguments);
	};
}

function registForArrayLike(){
	var listObj = [
		Array, String, HTMLCollection, NodeList
	];
	for(var i=0; i<listObj.length; i++){
		Object.assign.weakly(listObj[i].prototype, {
			foreach: function(func){
				for(var i=0; i < this.length; i++)
					try{
						if(func(this[i], i, this)) return true;
					}catch(e){
						console.warn(e);
					}
			},
			includes: generalContains,
			contains: generalContains // named from java
		});
	}
}

function registerObjectAssign(){
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill
	if(typeof Object.assign === 'function') return registerObjectAssignWeakly();
	Object.defineProperty(Object, 'assign', {
		configurable: true,
		writable: true,
		value: function(target, vars){
			if (target === null || target === undefined){
				throw new TypeError('Cannot convert undefined or null to object');
			}
			var to = Object(target);
			for(var index = 1; index < arguments.length; index++){
				var nextSource = arguments[index];
				if(nextSource !== null && nextSource !== undefined);
				else continue;
				for(var nextKey in nextSource){
					// Avoid bugs when hasOwnProperty is shadowed
					if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)){
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
	});
	registerObjectAssignWeakly();
	function registerObjectAssignWeakly(){
		Object.defineProperty(Object.assign, 'weakly', {
			configurable: true,
			writable: true,
			value: function(target, vars){
				if (target === null || target === undefined){
					throw new TypeError('Cannot convert undefined or null to object');
				}
				var to = Object(target);
				for(var index = 1; index < arguments.length; index++){
					var nextSource = arguments[index];
					if(nextSource !== null && nextSource !== undefined);
					else continue;
					for(var nextKey in nextSource){
						// Avoid bugs when hasOwnProperty is shadowed
						if(!Object.prototype.hasOwnProperty.call(nextSource, nextKey)) continue;
						if(Object.prototype.hasOwnProperty.call(to, nextKey)) continue;
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		});
	}
}

})();
