imports('/js/http, mapTips, navigation, langSwitch, betterScaleTips');

var loadedFunctions=0,
	delayFunctions={
		base:'images/',
		pics:[
			['media-top.jpg', fv('media')],
			['map-bottom-media.jpg', fv('map-bottom')],
			['map.jpg', fv('map')],
			['../../i.vimeocdn.com/video/cover.jpg', fv('videocover')],
			['media-bottom.jpg', fv('media-strip')]
		],
		fin: loadVideoAndBackground
	},
	loadingImages=[],
	loadingInterval;
delayItemLoads();

function loadingStatusChange(){
	if(loadedFunctions < delayFunctions.pics.length){
		//delayFunctions[loadedFunctions]();
		var curFun=delayFunctions.pics[loadedFunctions]
		setLoadingImages(delayFunctions.base + curFun[0]);
		unblockImage(curFun[1]);
		loadedFunctions++;
	}else{
		delayFunctions.fin();
		clearInterval(loadingInterval);
		loadBottomThumbs();
	}
	pl('status: '+ loadedFunctions);
}
function checkImagesLoaded(){
	for(var i=0;i<loadingImages.length;i++) if(!loadingImages[i].complete) return;
	loadingStatusChange();
}
function unblockImage(){
	for(var i=0;i<arguments.length;i++) removeClass(arguments[i],'delayLoadImage');
}
function setLoadingImages(){
	loadingImages=[];
	for(var i=0;i<arguments.length;i++){
		loadingImages[i]=new Image();
		loadingImages[i].src=arguments[i];
	}
}
function delayItemLoads(){
	setLoadingImages('images/logo.jpg');
	loadingInterval=setInterval(checkImagesLoaded, 500);
}

var isMobilePlay = false,
	isIE = false;
var playerIframe;
function loadVideoAndBackground(){
	unblockImage(document.body);
	setLoadingImages('images/bg.jpg');
	
	isMobilePlay = window.navigator.userAgent.toLowerCase().contains('mobile'); // wasted
	isIE = 'ActiveXObject' in window;
	var f=playerIframe=ct('iframe');
	f.className='bilibili-player';
	f.setAttribute('onload','onvideopageload()');
	configPlayer.index(isIE? 1: 2)(f);
	fc('bilibili-player-holder')[0].appendChild(f);
	vlcd();
}
var configPlayer={
	index: function(i){ return [this.mobile, this.html5, this.html5][i]; },
	mobile: function(f){
		f.src='https://m.bilibili.com/video/av22182802.html';
		f.sandbox='allow-scripts';// block app opening-require when mobile browser
		f.setAttribute('border',"0");
		f.setAttribute('frameborder','no');
		f.setAttribute('scrolling',"no");
	},
	flash: function(f){
		f.src='videoplay.html';
		f.setAttribute('border',"0");
		f.setAttribute('frameborder','no');
		f.setAttribute('framespacing','0');
		f.setAttribute('allowfullscreen','true');
		f.scrolling="no";
	},
	html5: function(f){
		f.src='videoplayh5_referrer.html';
		f.setAttribute('border',"0");
		f.setAttribute('frameborder','no');
		f.setAttribute('framespacing','0');
		f.setAttribute('allowfullscreen','true');
		f.scrolling="no";
	}
};
function loadBottomThumbs(){
	var thumbs=fv('thumbImages').getElementsByTagName('img');
	for(var i=0;i<thumbs.length;i++){
		thumbs[i].src=thumbs[i].title;
	}
}

var vlcdn=100;
var vlcd=function(){
	var cdiv=fv('videoloadingcountdown');
	cdiv.innerText=vlcdn;
	vlcdn--;
	if(vlcdn<0){
		cdiv.style.display='none';
		fv('videoplay').style.display='';
	}else setTimeout(vlcd,1000);
};
function hideplayhint(){
	fv('videoplayhint').style.display=
	fv('videocover').style.display='none';
}
function onvideopageload(){
	/*setIframe.onClick(playerIframe, function(){
		setTimeout(hideplayhint, 300);
	});*/
	if(isMobilePlay || !isIE){
		onFlashDelayed();
	}else{
		vlcdn=3;
		setTimeout(onFlashDelayed, 3000);
	}
}
function onFlashDelayed(){
	fv('videoloadinggroup').style.display='none';
	fv('videoplay').style.display='';
}

addYoutubePlayButton();
function addYoutubePlayButton(){
	if(!('http' in window)){
		pl('media > addYoutubePlayButton(): waiting for http.js');
		setTimeout(addYoutubePlayButton, 500);
		return;
	}
	http('get','youtubeplaybutton.xml','',function(){
		fv('videoplayhint').innerHTML=this.responseText;
	});
}

//	<!--此处以下增加一个不怎么显眼的小提示-->
addBugTips();
function addBugTips(){
	if(!('mapTips' in window)){
		pl('media > addBugTips(): waiting for mapTips.js');
		setTimeout(addBugTips, 500);
		return;
	}
	htmlbody.appendChild(ct('style',".thumb_blocker:after{content:'Unfortunately, the full version of those pictures cannot be viewed because the files was lost.'}"));
	htmlbody.appendChild(ct('script',"fv('thumb_blocker').onmousemove=mapTips; // mapTips.js"));
}
