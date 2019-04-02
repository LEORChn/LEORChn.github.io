(function(){
	http('get',location.origin+'/api/rss.php','',function(){
		var t=this.responseText,
			r=newXML(t),
			x=r.get()[0].get()[0].get('item');
		for(var i=0;i<x.length;i++){
			var j=x[i],
				l=fv('blog');
			switch(j.get('c:type')[0].text()){
				case '0':
					var a=ct('div');
					l.appendChild(a);
					a.outerHTML='<div class="recent_desc">'+j.get('description')[0].text()+'</div>';
					break;
				case '1':
					var a=ct('div');
					l.appendChild(a);
					a.outerHTML='<div class="recent_time">'+j.get('c:time')[0].text()+'</div>';a=ct('ss');
					a=ct('ss');
					l.appendChild(a);
					a.outerHTML='<ss>'+unescape('%u201c')+'</ss>';
					a=ct('div');
					l.appendChild(a);
					a.outerHTML='<div class="recent_desc">'+j.get('description')[0].text()+'</div>';
			}
			l.appendChild(ct('d'));
		}
		r.finish();
		fv('blog').getElementsByTagName('loader')[0].remove();
	},function(){});
})();