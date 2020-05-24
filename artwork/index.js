(function(){
	httpj('get /artwork/my.json', function(e){
		if(e.stat != 200) return;
		var ls = $('#brows .ls_my');
		e.data.foreach(function(j){
			var outside = ct('div'),
				a = ct('a'),
				panel = ct('div.mui-panel'),
				title = ct('div.mui--text-headline'),
				title_ico = ct('img.icon'),
				title_txt = ct('div'),
				desc = ct('div');
			
			a.href = j[0] instanceof Array? '#app/web/'+j[1]+'.html': 'app/{0}/{1}/'.format(j[0], j[1]);
			if(j[0] instanceof Array){
				title_ico.src = '/app/web/'+j[1]+'_icon.png';
				//title_ico.setAttribute('dragable', 'false');
			}
			title_txt.innerText = j[2];
			desc.innerText = j[3];
			
			title.appendChildren(title_ico, title_txt);
			panel.appendChildren(title, desc);
			a.appendChild(panel);
			outside.appendChild(a);
			ls.appendChild(outside);
		});
	});
})();

