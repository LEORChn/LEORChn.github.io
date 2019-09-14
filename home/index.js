(function(){
	httpj('get',location.origin+'/api/rss.json','',function(jr){
		if(jr.stat != 200) return;
		jr = jr.data;
		for(var i=0; i<jr.length;i++){
			var j=jr[i],
				l=fv('blog'),
				a=ct('div');
			switch(j[0]){
				case 0:
					a.className = 'recent_desc';
					a.innerHTML = j[3];
					break;
				case 1:
					a.className = 'recent_time';
					a.innerHTML = j[1];
					l.appendChild(a);
					a=ct('div');
					a.className = 'recent_desc diary';
					a.innerHTML = j[3];
			}
			l.appendChild(a);
		}
		fv('blog').getElementsByTagName('loader')[0].remove();
	},function(){});
})();