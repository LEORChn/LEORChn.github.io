var windows=[], timers=[];
(function(){
	/*	页面组件 */
	var inp = fv('qunNumber'), 
		mask = patch(fv('lostFocusMask')),
		btn_open_cancel = patch(fv('qunNumberCancel')), btn_open_prev = patch(fv('qunNumberUseLastest')),
		text_qun_prev = fv('qunNumberLatest');
	/*	其他变量
		window_login 登录窗口
		call_func 记忆所点击的功能按钮
		window_latest 操作已确认，但是需要在事件触发时先打开窗口，然后才能验证数据。
		success_prev 上次群号 string
	*/
	var window_login, call_func, window_new, success_prev;
	/*	组件事件 */
	inp.onchange = inp.onmousemove = inp.onkeyup = function(){
		var n = this.value = this.value.replace(/[^0-9]*/g, ''),
			b = /^[0-9]{5,12}$/.test(n);
		this.style.backgroundColor = n.length==0 || b? '':  'rgb(255,204,204)';
		return b;
	}
	btn_open_cancel.on('click', function(){ onDropTextReceived('000000'); });
	btn_open_prev.on('click', function(){ new_Window(); onDropTextReceived(success_prev); });
	
	var g=document.querySelectorAll('a[function-qun]'); // 功能按钮注册点击
	for(var i=0;i<g.length;i++)
		g[i].addEventListener('click',function(){
			call_func = this;
			window_login = window.open('//qun.qq.com/member.html', '_blank', 'location=no,resizable=no,width=850,height=550,left='+screenX+',top='+screenY, false);
			window_login.onunload = updateBackMask;
			windows.push(window_login);
			updateBackMask();
		});
	/*	其他事件 */
	// 初始化遮罩监听器
	function updateBackMask(){ // 刷新遮罩状态
		mask.onclick = function(e){ e.stopPropagation(); };
		mask.style.display = !window_login || window_login.closed? 'none': 'table';
		btn_open_prev.style.display = success_prev? '': 'none';
		text_qun_prev.innerText = success_prev;
	}
	setTimer(updateBackMask, 500);
	var eventBlocker = function(e){ // 监听拖拽事件
			e.preventDefault();
    		e.stopPropagation();
		}; // 此处似乎需要三号参数为false
	mask.on('dragenter', 'dragover', 'dragleave', eventBlocker);
	mask.on('drop', function(e){
		eventBlocker(e);
		new_Window();
		e.dataTransfer.items[0].getAsString(onDropTextReceived);
	});
	function onDropTextReceived(s){ // 数据传入，但是并不在此验证是否是有效群号
		inp.value=s;
		if(inp.onchange()) window_login.close();
		try{
			var qn=parseInt(inp.value);
			if(qn > 10000){
				windows.push(window_new);
				window_new.location.href = call_func.getAttribute('function-qun').replace('%s', qn);
				success_prev = qn;
			}else{
				window_new.close();
			}
			window_new = undefined;
		}catch(e){}
	}
	
	function new_Window(){
		var p = (call_func.hasAttribute('p')? call_func.getAttribute('p'): '').split(','),
			w = p[0] || 800, h = p[1] || 600,
			il = (screenX+(outerWidth-w)/2), it = (screenY+(outerHeight-h)/2);
		return window_new = window.open('', '_blank', 'location=no,width='+w+',height='+h+',left='+il+',top='+it, false);
	}
	
	setTimer(function(){ // 释放内存
		var n=[];
		for(var i=0;i<windows.length;i++) if(!windows[i].closed) n.push(windows[i]);
		windows=n;
	}, 5000);
	patch(window).on('unload', function(){ // 主页面被关闭时关闭所有子窗口
		for(var i=0;i<timers.length;i++) clearInterval(timers[i]);
		for(var i=0;i<windows.length;i++) windows[i].close();
	});
	
	function setTimer(fun, delay){ // override-library: interval
		var t = setInterval(fun, delay);
		timers.push(t);
		return t;
	}
	patch(window).on('message', function(){
		pl('-----args start-----');
		for(var i=0;i<arguments.length;i++)
			pl(arguments[i]);
		pl('-----args end-----');
	});
})();
function restoreWindow(){
	
}
function maxWindow(){
	fv('win_maincontain').style.position='fixed';
}
