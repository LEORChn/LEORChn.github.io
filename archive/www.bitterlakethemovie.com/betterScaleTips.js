var scaleSaveKey='scale_bitterlake';
pendingCheckIsBetterScreenScale();
function pendingCheckIsBetterScreenScale(){
	if(!isReady()){
		setTimeout(pendingCheckIsBetterScreenScale, 1000);
		return;
	}
	checkIsBetterScreenScale();
}
function checkIsBetterScreenScale(){
	var currScale = screen.width / Math.max(1,screen.height);
	if(currScale < 0.665){ // check if is bad scale
		if(!cok(scaleSaveKey)){
			cok_a(scaleSaveKey, '30min', null, 1000*60*30); // alert it later 30min
			alert('Horizontal screen to browse please.\n请横屏浏览以获得更佳体验。\n\nThis hint will popup again 30 minutes later.\n本提示每30分钟出现一次。\n\n屏幕底部的选择器可切换语言。');
		}
	}
}