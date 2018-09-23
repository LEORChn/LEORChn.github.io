var artwork_item_count=0,
	artwork_page_now=1,
	artwork_page_total=0,
	artwork_data_sort=0,
	artwork_data_sort_random=[],
	artwork_data_sort_rank=[],
	artwork_data_sort_newadd=[],
	j;
(function(){
	initUi();
})();
function initUi(){
	initPageFlipper();
	addItems();
	initLoveSort();
}
function initLoveSort(){
	fv('sort_love').onclick=function(){
		if(artwork_data_sort==parseInt(this.value))return;
		artwork_data_sort=parseInt(this.value);
		artwork_page_now=1;
		if(fv('type_love').checked) itemPageLoad();
	}
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
		//开始 初始化 排序
		for(var i=0;i<j.length;i++){
			artwork_data_sort_rank[i] = artwork_data_sort_random[i] = artwork_data_sort_newadd[i] = i;
		}
		artwork_data_sort_random.sort(function(){return Math.random()>.5? -1: 1;});
		artwork_data_sort_rank.sort(function(){return Math.random()>.5? -1: 1;});
		artwork_data_sort_rank.sort(function(a,b){return j[a].s > j[b].s? -1: 1;});
		artwork_data_sort_newadd.sort(function(a,b){return a > b? -1: 1;});
		//初始化 排序 结束
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
	var sortway=[artwork_data_sort_random, artwork_data_sort_rank, artwork_data_sort_newadd][artwork_data_sort];
	for(var i=0,s=(artwork_page_now-1)*artwork_item_count,k=s+6;i+s<k;i++){
		if( (i+s) >= j.length ){
			g[i].style.display='none'
			continue;
		}else g[i].style.display='';
		var p=j[sortway[i+s]];
		g[i].getElementsByClassName('item_id_image')[0].style.backgroundImage='url('+location.href.replace('#','')+encodeURI(p.p)+'/index.webp)';
		g[i].getElementsByClassName('item_id_title')[0].innerText=p.n;
		g[i].getElementsByClassName('item_id_desc')[0].innerHTML=p.d;
		g[i].getElementsByClassName('item_id_score')[0].innerText=processScore(p.s);
		g[i].getElementsByClassName('item_id_length')[0].innerText=p.l? p.l: '';
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
