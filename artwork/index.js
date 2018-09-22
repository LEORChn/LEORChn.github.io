var artwork_item_count=0,
	artwork_page_now=1,
	artwork_page_total=0,
	j;
(function(){
	initUi();
})();
function initUi(){
	initPageFlipper();
	addItems();
}
function initPageFlipper(){
	for(var i=0,a=fc('pagePrev');i<a.length;i++) a[i].onclick= function(){ itemPageLoad(-1); };
	for(var i=0,a=fc('pageNext');i<a.length;i++) a[i].onclick= function(){ itemPageLoad(1); };
	updatePageFlipper();
}
function updatePageFlipper(){
	for(var i=0,a=fc('pagePrev');i<a.length;i++) a[i].disabled= artwork_page_now <= 1;
	for(var i=0,a=fc('pageNext');i<a.length;i++) a[i].disabled= artwork_page_now >= artwork_page_total;
	for(var i=0,a=fc('pageDisplay');i<a.length;i++) a[i].innerText= artwork_page_now + '/' + artwork_page_total;
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
	if(!m || isNaN(m)) m = 0;
	artwork_page_now += m;
	artwork_page_total=Math.ceil(j.length/artwork_item_count);
	artwork_page_now=Math.max(artwork_page_now,1);
	artwork_page_now=Math.min(artwork_page_now,artwork_page_total);
	var g=fc('item_artwork_root');
	for(var i=0,s=(artwork_page_now-1)*artwork_item_count,k=s+6;i+s<k;i++){
		if( (i+s) >= j.length ){
			g[i].style.display='none'
			continue;
		}else g[i].style.display='';
		var p=j[i+s];
		g[i].getElementsByClassName('item_id_image')[0].style.backgroundImage='url('+location.href.replace('#','')+encodeURI(p.p)+'/index.webp)';
		g[i].getElementsByClassName('item_id_title')[0].innerText=p.n;
		g[i].getElementsByClassName('item_id_desc')[0].innerText=p.d;
		g[i].getElementsByClassName('item_id_score')[0].innerText=processScore(p.s);
	}
	if(m != 0)
		if(m > 0)
			smoothScrollToVisit(fv('pageTop'),500);
		else
			smoothScrollToVisit(fv('pageFlipBottom'),500);
	updatePageFlipper();
}
function processScore(i){
	i=i.toString();
	if(!i.includes('.'))
		i+='.0';
	return i;
}
