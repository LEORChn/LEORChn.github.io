var artwork_item_count=0,
	artwork_page_now=1,
	j;
(function(){
	initUi();
})();
function initUi(){
	addItems();
}
function addItems(){
	http('get',location.href.replace('#','')+'listsub_artwork.xml','',function(){
		var g=fv('group_artwork')
		h='';
		for(i=0;i<6;i++){
			artwork_item_count++;
			h+=this.responseText;
		}
		g.innerHTML=h;
		itemWidthAdaption();
		itemDataLoad();
	},function(){
		addItems();
	});
}
function itemWidthAdaption(){
	var m=fv('blog'), // 取得Item的容器
	r=/[0-9]*/, // 部分给出px字符串导致无法计算，因此要用正则取出
	w=m.offsetWidth-r.exec(m.style.paddingLeft)-r.exec(m.style.paddingRight), // 算出总可用宽度
	c=Math.floor(w/350), // 可放置的列数
	ew=w/c; // 每个列应该的宽度
	for(var i=0,e=fc('item_artwork_root');i<e.length;i++){
		if(!e[i].parentNode.className.includes('item_artwork'))
			e[i].style.width=ew+'px';
	}
}
function itemDataLoad(){
	http('get',location.href.replace('#','')+'love.json','',function(){
		j=eval('('+this.responseText+')');
		itemPageLoad();
	},function(){
		itemDataLoad();
	});
}
function itemPageLoad(m){
	if(m && !isNaN(m)) artwork_page_now += m;
	artwork_page_now=Math.max(artwork_page_now,1);
	artwork_page_now=Math.min(artwork_page_now,Math.ceil(j.length/artwork_item_count));
	var g=fc('item_artwork_root');
	for(var i=0,s=(artwork_page_now-1)*artwork_item_count,k=s+6;i+s<k;i++){
		var p=j[i+s];
		g[i].getElementsByClassName('item_id_image')[0].style.backgroundImage='url('+location.href.replace('#','')+encodeURI(p.p)+'/index.png)';
		g[i].getElementsByClassName('item_id_title')[0].innerText=p.n;
		g[i].getElementsByClassName('item_id_desc')[0].innerText=p.d;
		g[i].getElementsByClassName('item_id_score')[0].innerText=p.s;
	}
}
