
(function(){
	'use strict';
	var loadfinish = function(){
		fc('onloading')[0].style.display='none';
		fc('mui-btn mui-btn--raised mui-btn--primary')[0].removeAttribute('disabled');
	};
	
	var canvas = ft('canvas')[0],
		c = canvas.getContext('2d'),
		limg = new Image(),
		redraw = function(){
			c.drawImage(limg, 0, 0);
		},
		lastRect = [0,0,0,0],
		fillRectBool = function(x, y, w, h){
			x = parseInt(x); y = parseInt(y); w = parseInt(w); h = parseInt(h);
			lastRect = [x, y, w, h];
			var cw = canvas.width, ch = canvas.height;
			//c.fillStyle = 'rgba(255,0,0,.75)';
			c.fillRect(0, 0, x, ch);
			//c.fillStyle = 'rgba(255,255,0,.75)';
			c.fillRect(x, 0, w, y);
			//c.fillStyle = 'rgba(0,0,255,.75)';
			c.fillRect(x, y+h, w, ch);
			//c.fillStyle = 'rgba(0,255,0,.75)';
			c.fillRect(x+w, 0, cw, ch);
			//pl('fill '+x+' '+y+' '+w+' '+h);
		};
	c.fillStyle = 'rgba(255,255,255,.75)';
	var modediv = fv('img_clipmode'),
		btn_reset = fv('clip_reset'),
		wdiv = fv('img_w'), wcap = fv('img_w_caption'),
		hdiv = fv('img_h'), hcap = fv('img_h_caption');
	var movevent = function(){
		var e = window.event || arguments[0],
			_this = e.target, wstep = wdiv.step, hstep = hdiv.step;
		if(wstep != 1 || hstep != 1){
			if(e.target == wdiv){
				hdiv.value = _this.value * hstep / wstep
			}else if(e.target == hdiv){
				wdiv.value = _this.value * wstep / hstep;
			}
		}
		hcap.innerText = hdiv.value + 'px';
		wcap.innerText = wdiv.value + 'px';
		if(!limg.src) return;
		redraw();
		var x0 = 0, x100 = 0, y0 = 0, y100 = 0;
		var mode = modediv.value.split(',');
		x0 = parseInt(mode[4]);
		x100 = parseInt(mode[5]);
		y0 = parseInt(mode[6]);
		y100 = parseInt(mode[7]);
		var xPerc = (wdiv.value - wdiv.min) / (wdiv.max - wdiv.min),
			yPerc = (hdiv.value - hdiv.min) / (hdiv.max - hdiv.min);
		//pl('xyPerc = '+xPerc+' '+yPerc);
		fillRectBool(Math.floor((x100 - x0) * xPerc + x0), Math.floor((y100 - y0) * yPerc + y0), wdiv.value, hdiv.value);
	}, evts = 'mousedown,mousemove,mouseup,touchstart,touchmove,touchend'.split(',');
	for(const item in evts){
		document.addEventListener(evts[item], movevent);
	}
	modediv.onchange = btn_reset.onclick = function(){
		var mode = modediv.value.split(',');
		wdiv.value = wdiv.min = mode[0];
		hdiv.value = hdiv.min = mode[1];
		wdiv.max = mode[2];
		hdiv.max = mode[3];
		if(mode.length > 9){
			wdiv.step = mode[8];
			hdiv.step = mode[9];
		}
		if(mode.length > 11){
			wdiv.value = mode[10];
			hdiv.value = mode[11];
		}
		return false;
	};
	
	window['_clip'] = {
		isKeyInvalid: false,
		daemonKey: function(){
			if(this.isKeyInvalid)
				if('mui' in window)
					if('msgbox' in mui)
						mui.msgbox.open('权限被拒绝', '您无权访问此页面。', function(){
							location.href = '/';
						});
		},
		exec: function(){
			var op = fv('output_canvas'),
				x = lastRect[0],
				y = lastRect[1],
				w = op.width = lastRect[2],
				h = op.height = lastRect[3],
				opc = op.getContext('2d'),
				opimg = fv('output_img');
			opc.drawImage(canvas, x, y, w, h, 0, 0, w, h);
			var a = ct('a'), s1 = modediv.querySelector('option[value="'+modediv.value+'"]').getAttribute('v');
			a.href = op.toDataURL('image/png');
			a.download = 'LEORChn_'+w+'x'+h+'_'+s1+'.png';
			a.click();
		}
	};
	
	var ddh = String(gquery('key')),
		sha = new jsSHA('SHA-256','TEXT');
	sha.update(ddh+ddh+ddh);
	var filename = sha.getHash('HEX'),
		loadper = fv('component_percent');
	fv('component_name').innerText = '图片';
	loadper.innerText = '0.00%';
	http('get', '256_'+filename, '', function(){
		if(this.status.toString().startsWith('4')){
			window._clip.isKeyInvalid = true;
			window._clip.daemonKey();
			return;
		}
		limg.src = 'data:image/png;base64,'+this.responseText;
		movevent({target:wdiv});
		loadfinish();
	}, function(){
	}, function(e){
		loadper.innerText = ((e.loaded/e.total)*100).toFixed(2) + '%';
	});
	modediv.onchange();
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
	_clip.daemonKey();
}, 500);
