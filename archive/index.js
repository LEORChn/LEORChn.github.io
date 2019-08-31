var listsub_archive;
(function(){
	initArchiveListsub();
})();
function initArchiveListsub(){
	http('get',location.href.replace('#','')+'listsub_archive.xml?'+new Date().getTime(),'',function(){
		listsub_archive=this.responseText;
		initArchiveListData();
	});
}
function initArchiveListData(){
	http('get',location.href.replace('#','')+'data.json','',function(){
		var g=fv('group_archive'),
			j=eval('('+this.responseText+')');
		for(var i=0;i<j.length;i++){
			var t=ct('div');
			g.appendChild(t);
			t.outerHTML=listsub_archive;
		}
		for(var i=0;i<j.length;i++){
			if(j[i].img)
				fc('item_id_image')[i].style.background='url('+j[i].img+')';
			else{
				fc('item_archive_image_loader')[i+1].style.display=
				fc('item_id_image')[i].style.display='none';
			}
			fc('item_id_title')[i].innerText=j[i].title;
			fc('item_id_desc')[i].innerText=j[i].desc;
			if(j[i].linkdisplay)
				fc('item_id_length')[i].innerText=j[i].linkdisplay;
			else
				fc('item_archive_score_hint')[i].style.display='none';
			g.getElementsByClassName('item_archive_root')[i].href='/archive/'+j[i].src;
		}
	},function(){
	});
}
/*function itemDataLoad(){
	
		
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
*/