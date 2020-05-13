(function(){
	httpj('get /api/rss.json',function(jr){
		if(jr.stat != 200) return;
		jr = jr.data;
		for(var i=0; i<jr.length;i++){
			var j=jr[i],
				l=fv('blog'),
				a=ct('div'),
				fcn=null; // final class name
			switch(j[0]){
				case 0:
					a.className = 'recent_desc';
					a.innerHTML = j[3];
					break;
				case 3:
					fcn = 'recent_desc'; // enhanced diary
				case 1:
					a.className = 'recent_time';
					a.innerHTML = j[1];
					l.appendChild(a);
					a=ct('div');
					a.className = fcn? fcn: 'recent_desc diary';
					a.innerHTML = j[3];
			}
			l.appendChild(a);
		}
		fv('blog').getElementsByTagName('loader')[0].remove();
	},function(){});
})();