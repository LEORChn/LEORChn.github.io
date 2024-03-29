
/* 浏览器兼容性报告
 *   2015年9月2日，Chrome 45 正式支持 Array.fill
 *   2015年9月2日，Chrome 45 正式支持 Object.assign
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
	pl: function(){ // named from java System.out.println
		console.log.apply(console, arguments);
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
	padLeft: function(length){ // FIXME: 函数的命名不太标准？
		return (Array(length).join('0') + this).slice(-length);
	},
	reverse: function(){
		return this.split('').reverse().join('');
	},
	asHex: function(bit){ // FIXME: 不稳定实现
		var i = parseInt(this, 16),
			keep = Math.pow(2, bit) - 1,
			nega = Math.pow(2, bit - 1) & i;
		return (keep & i) - (nega? Math.pow(2, bit): 0);
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

Object.assign.weakly(Number.prototype, { // =====-----<  Number  >-----===== //
	flag: function(fi){ // fi: flag_int
		fi = fi | 0;
		return (this | 0) & fi == fi;
	},
	padLeft: function(length){ // FIXME: 函数的命名不太标准？
		return (Array(length).join('0') + this).slice(-length);
	},
	toHex: function(bit){ // FIXME: 不稳定实现
		var _this = this | 0;
		// 只有在调用时加入位数限制参数且参数为大于0的整数才使用自定处理方法，否则使用系统的处理方法
		if(!bit || type(bit) != 'Number' || (bit |= 0) <= 0) return this.toString(16);
		// JS的最大安全整数为2的53次方减1，如果参数为14或更大，那么需要能够处理2的56次方以上才能正确完成计算操作的执行
		if(bit > 13) console.warn(`Number.toHex: calculate the param(${bit}) to 2^${bit * 4} is over than MAX_SAFE_INTERGER(2^53 -1), it might output incorrect result.`);
		if(_this < 0){ // 如果原数为负数，全部填满F再减去原数即可。
			return (Math.pow(16, bit) + _this).toString(16);
		}
		return _this & Math.pow(16, bit) - 1;
	}
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
	prepend: function(){
		var a = arguments;
		if(a.length == 0) return this;
		this.unshift.apply(this, a.length == 1 && a[0] instanceof Array? a[0]: a);
		return this;
	},
	clone: function(){
		return this.concat();
	},
	shuffle: function(){
		var a = this;
		for(var i = a.length - 1; i >= 0; i--){
			var randomIndex = Math.random()*(i+1) | 0;
			var itemAtIndex = a[randomIndex];
			a[randomIndex] = a[i];
			a[i] = itemAtIndex;
		}
		return a;
	},
	fill: Polyfill_Array_fill, // 腻子代码 Chrome < 45
	includes: generalContains,
	contains: generalContains // named from java
});

Object.assign.weakly(Uint32Array.prototype, {
	map: Polyfill_Array_map
});

Object.assign.weakly(Event.prototype, {
	block: function(){
		this.preventDefault();
		this.stopPropagation();
		this.stopImmediatePropagation();
	}
});

Object.assign.weakly(Blob.prototype, {
	// 由于File 继承 Blob，因此也可以对 File 使用这些函数
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

window.PromiseQueue = function(){
	if(this == window) return;
	var chain = [];
	this.then = then;
	function then(func){
		chain.push(func);
		if(chain.length == 1) next();
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

function registerObjectAssign(){ // 腻子代码 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#polyfill
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
function Polyfill_Array_fill(value){ // 腻子代码 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
	if(this == null) throw new TypeError('this is null or not defined');
	var O = Object(this);
	var len = O.length >>> 0;
	var start = arguments[1];
	var relativeStart = start >> 0;
	var k = relativeStart < 0 ?
		Math.max(len + relativeStart, 0) :
		Math.min(relativeStart, len);
	var end = arguments[2];
	var relativeEnd = end === undefined ?
		len : end >> 0;
	var final = relativeEnd < 0 ?
		Math.max(len + relativeEnd, 0) :
		Math.min(relativeEnd, len);
	while (k < final) {
		O[k] = value;
		k++;
	}
	return O;
}
function Polyfill_Array_map(callback){ // 腻子代码 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map
	if(typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
	var T, O = Object(this),
		len = O.length >>> 0,
		A = new Array(len),
		k = 0;
	if(arguments.length > 1) T = arguments[1];
	while(k < len) {
		if(k in O) {
			var kValue = O[k],
				mappedValue = callback.call(T, kValue, k, O);
			A[k] = mappedValue;
		}
		k++;
	}
	return A;
}

})();
