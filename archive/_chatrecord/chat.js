(function(){
	var publishProgress = function(l, n, t){
		fv('component_loaded').innerText = l;
		if(n) fv('component_name').innerText = n;
		if(t) fv('component_total').innerText = t;
	},
	imageLoadingUpdater = function(){
		var imgs = document.images,
			len = imgs.length
			loadedimgs = 0;
		for(var i=0; i<len; i++)
			if(imgs[i].complete) loadedimgs++;
		if(loadedimgs < len){
			publishProgress(loadedimgs, '图片', len); 
			setTimeout(imageLoadingUpdater, 2000);
		}else{
			fc('onloading')[0].style.display='none';
		}
	};
	
	var w = fv('chat-window');
	var q = gquery('view');
	if(q == ''){
		var d = ct('div', '站长正在逐步迁移聊天记录，请耐心等待一段时间再来。');
		d.className = 'chat-system';
		w.appendChild(d);
	}else{
		publishProgress(0, '数据', 1);
		httpj('get', 'view/'+q+'.json', '', function(j){
			if(j.stat == 200){
				var rTable = {},
					msgprocess = function(m){
						return m.replace(/\{_img_\}/g, 'img/'+q+'/');
					};
				for(var i=0; i<j.msg.length; i++){
					var m = j.msg[i],
						d;
					if(m[0] == 0){ // system
						d = ct('div', m[3]);
						d.className = 'chat-system';
					}else{ // people
						d = ct('table');
						d.className = 'chat';
						var speaker = j.speaker[m[0]],
							tr = ct('tr'),
							td1 = ct('td'),
							headdiv = ct('div'),
							td2 = ct('td', speaker[0]),
							msgdiv = ct('div');
						var headimg = ct('img');
						headimg.src = 'img/_people/'+speaker[1];
						headimg.style.display = 'none';
						td1.appendChild(headimg);
						headdiv.style.backgroundImage = 'url(img/_people/'+speaker[1]+')';
						td1.appendChild(headdiv);
						msgdiv.className = 'mui-panel area-parse-emoji';
						msgdiv.innerHTML = msgprocess(m[3]);
						td2.appendChild(msgdiv);
						if(m[2].i) rTable[m[2].i] = i; // reply defintion
						if(m[2].r){ // reply extraction
							var rid = rTable[m[2].r],
								rm = j.msg[rid],
								rmsgdiv = ct('table'),
								rtr = ct('tr'),
								rtd1 = ct('td', '"'),
								rtd2 = ct('td');
							rmsgdiv.className = 'mui--divider-bottom';
							rtd2.innerHTML =  j.speaker[rm[0]][0]+' '+rm[1]+'<br>'+msgprocess(rm[3]);
							rtr.appendChild(rtd1);
							rtr.appendChild(rtd2);
							rmsgdiv.appendChild(rtr);
							msgdiv.insertBefore(rmsgdiv, msgdiv.childNodes[0]);
						}
						tr.appendChild(td1);
						tr.appendChild(td2);
						d.appendChild(tr);
					}
					w.appendChild(d);
				}
				var finmsg = ct('div', '记录加载完毕。');
				finmsg.className = 'chat-system';
				w.appendChild(finmsg);
				for(var i=0,a=document.getElementsByClassName('area-parse-emoji'); i<a.length; i++)
					a[i].innerHTML = twemoji.parse(a[i].innerHTML);
			}else{
				w.innerText = '没有对应记录。';
			}
			imageLoadingUpdater();
		});
	}
})();

var _chat = {
	onShowMembers: function(){
		var memberPanel = fv('panel_root_member'),
			option = {
				onclose: function(){
					htmlbody.appendChild(memberPanel);
					memberPanel.style.display = 'none';
				}
			};
		memberPanel.style.display = '';
		mui.overlay('on', option, memberPanel);
	}
};
