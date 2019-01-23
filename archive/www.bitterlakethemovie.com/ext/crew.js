imports('/js/http, mapTips, navigation, langSwitch, betterScaleTips');

var lastHash;
function regOnLocationChanged(){
	if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
    	window.onhashchange = onLocationChanged;
	}else{
		lastHash=window.location.hash;
		setInterval(function(){
			if(lastHash != window.location.hash){
				lastHash=window.location.hash;
				onLocationChanged();
			}
    	}, 300);
	}
}
function onLocationChanged(){
	var hashlist=['','2011','2013','shay','ezwolf','foxamoore','tigertom','rin','stoelbank','forfaox','tillikum','nikoshi','kwisa','lucy'],
		hash=window.location.hash.replace('#',''),
		index=0,
		switcher=fc('switchhide');
	for(var i=0;i<hashlist.length;i++){
		if(hashlist[i]==hash){
			index=i;
			break;
		}
	}
	for(var i=0;i<switcher.length;i++){
		switcher[i].style.display= index==i? 'block': '';
	}
	var homenavigator=fv('backabout');
	homenavigator.getElementsByTagName('h2')[0].className='crew '+(index>2? hashlist[index]: 'about');
	
	fv('logo').className='side';
	
	switch(index){
		case 0: // 2013-8
			fv('logo').className='';
			fv('dvd').removeAttribute('href');
			break;
		case 1: // 2011-10
			fv('dvd').href='dvd.html';
			break;
		case 2: //2013-1
			fv('dvd').href='';
	}
}
regOnLocationChanged();
onLocationChanged();

//	<!--此处以下增加一个不怎么显眼的小提示-->
var multiVersionPagesButton=[];
addMultiVersionPages();
function addMultiVersionPages(){
	var r=ct('div');
	r.style.cssText='position:fixed; right:0; bottom:0';
	var n=null, c='color:#fff', p='cursor:default', dat=[
		['“关于” 页面的多个版本：','2011年10月',' ','2013年1月',' ','2013年8月'],
		[p,c,p,c,p,c],
		[n,'#2011',n,'#2013',n,'#']
	];
	for(var ds=0;ds<dat[0].length;ds++){
		var d=ct('a', dat[0][ds]);
		if(dat[1][ds]) d.style.cssText=dat[1][ds];
		if(dat[2][ds]){
			d.href=dat[2][ds];
			multiVersionPagesButton[multiVersionPagesButton.length]=d;
		}
		r.appendChild(d);
	}
	htmlbody.appendChild(r);
}