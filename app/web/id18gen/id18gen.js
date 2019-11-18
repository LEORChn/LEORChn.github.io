function pad(num, n){
	return Array(n>String(num).length?(n-(''+num).length+1):0).join(0)+num;
}
(function(){
	'use strict';
	var loadfinish = function(){
		fc('onloading')[0].style.display='none';
		fc('mui-btn mui-btn--raised mui-btn--primary')[0].removeAttribute('disabled');
	};
	
	var fm = fc('mui-form scoped1')[0],
		v1 = fv('verify1'),
		v2 = fv('verify2'),
		v3 = fv('verify3'), v4 = fv('verify4'),
		tYear = function(e){
			var v = e.valueAsDate;
			if(v == null) return false;
			var v21 = pad(v.getFullYear(), 4),
				v22 = pad(v.getMonth()+1, 2),
				v23 = pad(v.getDate(), 2);
			return v21 + v22 + v23;
		};
	var movevent = function(){
		var e = window.event || arguments[0],
			_this = e.target;
		if(e.target == v1) v1.parentElement.querySelector('label+label').innerText = v1.value.length + ' / (6 or 17)';
		if(e.target == v2) v2.previousElementSibling.innerText = '= '+ (tYear(v2) || '00000000');
		if(e.target == v3) v3.previousElementSibling.innerText = '= '+pad(v3.value, 2);
		if(e.target == v4){
			document.querySelector('.mui-form .mui-select label+label').innerText = '= '+v4.value;
			document.querySelector('.mui-form .mui-select select').value = ['even', 'odd'][parseInt(v4.value) % 2];
			pl(v4.value+' = '+['even', 'odd'][parseInt(v4.value) % 2]);
		}
	}, evts = 'mousedown,mousemove,mouseup,touchstart,touchmove,touchend'.split(','),
	evts2 = 'keyup,keydown,keypress,change'.split(',');
	for(const item in evts){
		document.addEventListener(evts[item], movevent);
	}
	for(const item in evts2)
		fm.addEventListener(evts2[item], movevent);
	
	fv('submit').onclick = function(){
		var v0,
			_v1 = v1.value,
			_v2 = tYear(v2),
			_v3 = pad(v3.value, 2),
			_v4 = v4.value;
		if(v1.validity.valid)
			if(_v1.length == 6){
				if(!_v2) return;
				v0 = '' + _v1 + _v2 + _v3 + _v4;
			}else if(_v1.length == 17) v0 = _v1;
			else return;
		else return;
		_v1 = 0;
		for(var i=0; i<17; i++){
			_v1 += Math.pow(2, 17-i) % 11 * parseInt(v0[i]);
		}
		_v1 = (12 - (_v1 % 11)) % 11;
		fv('output').value = v0 + (_v1 > 9? 'X': _v1);
	};
	loadfinish();
})();

setInterval(function(){
	if(!('mui' in window)) return;
	if(mui.msgbox) return;
	mui.msgbox = {
		_entity: fc('msgbox')[0],
		open: function(title, content, onclosedo){
			mui.msgbox.devonclosedo = onclosedo;
			var e = this._entity;
			mui.overlay('on', this, e);
			e.querySelector('.title').innerText = title;
			e.querySelector('.content').innerText = content;
		},
		close: function(){
			mui.overlay('off');
		},
		devonclosedo: null,
		onclose: function(){
			htmlbody.appendChild(mui.msgbox._entity);
			if(mui.msgbox.devonclosedo) mui.msgbox.devonclosedo();
		}
	};
}, 500);
