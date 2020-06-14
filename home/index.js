(function(){
	httpj('get /api/rss.json',function(jr){
		if(jr.stat != 200) return;
		jr = jr.data;
		var diarys = ct('div.grid');
		fv('blog').appendChild(diarys);
		var sizer = ct('div.sizer.mui-panel');
		diarys.appendChild(sizer);
		
		for(var i=0; i<jr.length;i++){
			var j=jr[i],
				r = ct('div.post.grid-item.mui-panel'),
				t = ct('div.title'),
				c = ct('div.content');
			t.innerText = j[2];
			c.innerHTML = j[3];
			r.appendChildren(t, c);
			diarys.appendChild(r);
		}
		fv('blog').getElementsByTagName('loader')[0].remove();
		setTimeout(function(){
			var msnry = new Masonry(diarys, {
			  gutter: 10,
			  itemSelector: '.grid-item',
			  columnWidth: '.sizer'
			});
		}, 2000);
	});
})();