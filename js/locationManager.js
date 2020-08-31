curpage=-1;
function initLocation(){
	regOnLocationChanged();
	if(tryOldPath())return;
	onLocationChanged();
	//setATagLinks
}
function onLocationChanged(){
	if(tryOldPath())return; //如果是老版路径，在那个方法里替换为新版路径并退出当前事件，由下一个当前事件来进行触发
	// 判断导航栏是否应该亮
	var afterPath=location.href.split('#'),
		aflen=afterPath.length,
		afkey=aflen>1?getNavigateMapKey(afterPath[1]):undefined;
	//pl(afterPath+'\n'+aflen+'\n'+afkey);
	remove();
	if(vaild(afkey) && afkey >= 0) set(afkey);
	// 加载网页
	fv('page_loading').style.display='';
	fv('brows').className='blur3';
	http('get',location.href.replace('#',''),'',function(){
		var brows=fv('brows');
		brows.innerHTML = '';
		if(this.status == 404){
			var iframe = ct('iframe');
			iframe.srcdoc = this.responseText;
			iframe.style.cssText = 'width:100%; height:calc(100vh - 400px); border:0; background:#fff';
			brows.appendChild(iframe);
		} else
		brows.innerHTML = this.responseText;
		// 开始加载页面CSS
		var css=brows.getElementsByTagName('css');
		for(var i=0;i<css.length;i++){
			if(fv(css[i].className)) continue; // 已添加过了
			var nsc=ct('link');
			nsc.type='text/css';
			nsc.rel ='stylesheet';
			nsc.href= css[i].title;
			ft('head')[0].appendChild(nsc);
		}
		// 开始加载页面JS，通过重新载入JS文件的方式
		var scs=brows.getElementsByTagName('script');
		for(var i=0,len=scs.length;i<len;i++){
			var nsc=ct('script');
			nsc.src=scs[i].src;
			//nsc.innerText=scs[0].innerText.replace('<br>','');
			brows.appendChild(nsc);
		}
		setTimeout(function(){
			fv('page_loading').style.display='none';
			brows.className='';
		}, 1000);
	},function(){
		msgbox('Resourse load error.\nRefresh to retry.');
	});
}
var lastHash;
function regOnLocationChanged(){
	if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
    	window.onhashchange = onLocationChanged;
	}else{
		lastHash=window.location.hash;
		setInterval(function(){ // 检测hash值或其中某一段是否更改的函数， 在低版本的iE浏览器中通过window.location.hash取出的指和其它的浏览器不同，要注意
			if(lastHash != window.location.hash){
				lastHash=window.location.hash;
				onLocationChanged();
			}
    	}, 300);
	}
}
function tryOldPath(){ // 如果成功匹配自定捷径，则返回 true
	if(location.href.includes('/?'));// 包含 ? 捷径命令，则不再判空
	else if(location.hash==''){ // 不包含捷径命令，但是路径也是空的
		url(getNavigateMapKey(0));
		return true;
	}else return false; // 没有任何可能的自定捷径，返回 false
	var u=gquery('p')||location.href.split('?')[1];
	//history.replaceState(history.state,'',location.origin);
	switch(u){
		case'about': url('home/about.html');break;
		case'agreement_1': url('home/agreement_1.html');break;
		case'archive_lic': url('home/licensed.html');break;
		default: return false;
	}
	return true;
}
function changeLocation(u){
	
}
function jump(i){ // 控制导航栏的跳转事件
	if(i==curpage)return;
	url(getNavigateMapKey(i));
}
function getNavigateMapKey(intOrStr){ // 如果传入数字，返回导航栏对应的网址；如果传入网址，返回导航栏对应的数字索引
	var t=['home/','artwork/','home/news.html','home/about.html','archive/','home/myactivities.html','home/myactivities.html'];
	if(isNaN(intOrStr)){
		for(var i=0;i<=t.length;i++)
			if(i==t.length)
				return -1;
			else if(intOrStr==t[i])
				return i;
	}else if(intOrStr >= 0 && intOrStr <=t.length)
		return t[intOrStr];
	return null;
}
function set(i){ // 设置导航栏蓝条
	ft('fl')[i].className="curPage";
	curpage=i;
}
function remove(){ // 移除导航栏蓝条
	if(curpage==-1)return;
	ft('fl')[curpage].className="";
	curpage=-1;
}
function url2(e){
	if(e.nodeName.toUpperCase()!="A")return;
	if(e.href.includes('#'))
		url(e.href.split('#')[1]);
}
function url(u){
	toTopIfNeeded();
	location.href='/#'+u;
	
}
function toTopIfNeeded(){
	
}
function totop(){scrollTo(0,0);}
