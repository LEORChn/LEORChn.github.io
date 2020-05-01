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
	},
	tagFilter = function(){
		for(var i=0, a=document.querySelectorAll('[people]'); i<a.length; i++)
			a[i].style.display='';
		if(this.className.contains('checked')){
			removeClassName(this, 'checked');
		}else{
			for(var i=0, a=document.querySelectorAll('.tag.checked'); i<a.length; i++)
				removeClassName(a[i], 'checked');
			this.className += ' checked';
			for(var i=0, a=document.querySelectorAll('[people]:not([people="'+this.getAttribute('for')+'"])'); i<a.length; i++)
				a[i].style.display='none';
		}
	};
	
	var w = fv('contentholder');
	var q = gquery('view');
	if(q == ''){
		publishProgress(0, '列表', 1);
		document.querySelector('ul.mui-expand>li:first-child a').className = 'active'; // todo: use addClass instead
		httpj('get', 'data.json?'+new Date().getTime(), '', function(j){
			if(j.stat == 200){
				var p = j.people;
				for(var i in p){
					var d = ct('div', p[i]);
					d.className = 'mui-panel mui--no-user-select tag';
					d.onclick = tagFilter;
					d.setAttribute('for', i);
					w.appendChild(d);
				}
				j = j.data;
				for(var i=0; i<j.length; i++){
					var k = j[i],
						ymd = /(\d+)(\d{2})(\d{2})(\.\d{2})?/.exec(k[0]);
					var d = ct('div'),
						a = ct('a'),
						title = ct('div', p[k[1]] + (k[2]==null || k[2].length==0? '': ' 【' + k[2] + '】')),
						tmr = ct('span', (parseInt(ymd[1])+2000) + '年' + parseInt(ymd[2]) + '月' + parseInt(ymd[3]) + '日');
					d.className='mui-panel';
					d.setAttribute('people', k[1]);
					a.href = '?view=' + k[1] + k[0];
					title.className='mui--text-headline';
					a.appendChild(title);
					d.appendChildren(a, tmr);
					if(k.length >= 4){
						d.appendChild(ct('span', ' ' + k[3][1]));
						switch(k[3][0]){
							case 'red':
								d.style.backgroundColor = '#ffdddd'; break;
							case 'blue':
								d.style.backgroundColor = '#cceeff';
						}
					}
					w.appendChild(d);
				}
				imageLoadingUpdater();
			}
		});
	}else{
		publishProgress(0, '数据', 1);
		http('get', 'view/'+q+'.txt?'+new Date().getTime(), '', function(){
			if(this.status == 200){
				var d = this.responseText.replace(/\r/g, '').split('\n');
				var tabl = fv('main-table'), t = tabl.getElementsByTagName('tbody')[0], th0 = tabl.getElementsByTagName('th')[0];
				tabl.style.display='';
				var addeddmk = 0, i = 0, proc = setInterval(function(){
					while(i < d.length){
						var s = /(\d+:\d+:\d+)\s:\s收到彈幕:(.*?)\s說:\s(.*)/.exec(d[i]);
						if(s != null && s.length > 1){
							var tr = ct('tr'),
								idx = ct('td', ++addeddmk),
								tmr = ct('td', s[1]),
								nm = ct('td'),
								cont = ct('td', s[3]);
							var pid = s[2];
							tr.appendChildren(idx, tmr, nm, cont);
							if((pid = pid.replace('[爺]', '[爷]')).contains('[爷]')){
								pid = pid.replace('[爷]', '');
								tr.className='dmk-sender-vip';
							}else{
								'五行缺壹|毛基阿灰|werewolf33'
								 .split('\|').foreach(function(v){
									if(pid==v) tr.className='dmk-sender-vip';
								});
							}
							if(pid.contains('[管]')){
								pid = pid.replace('[管]', '');
								tr.className='dmk-sender-manager';
							}
							if(pid=='疯狂小瑞瑞') tr.className='dmk-sender-me';
							nm.innerText = pid;
							t.appendChild(tr);
						}
						i++
						if(i % 25 == 0){
							publishProgress(i, '数据', d.length);
							th0.innerText = addeddmk;
							return;
						}
					}
					th0.innerText = addeddmk;
					imageLoadingUpdater();
					clearInterval(proc);
				}, 50);
			}else{
				w.innerText = '没有对应记录。';
				imageLoadingUpdater();
			}
		});
	}
})();
