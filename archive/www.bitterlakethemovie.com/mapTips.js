var mapTipsBox;
initMapTips();
function initMapTips(){
	htmlbody.appendChild(ct('style',
	'.maptipsbox{position:fixed;border:2px solid #81512d;padding:8px;background:#c0a377;color:#fff;display:none}'+
	'.area-synopsis:after{content:\'Synopsis\'}'+
	'.area-characters:after{content:\'Characters\'}'+
	'.area-castcrew:after{content:\'Cast, crew & About\'}'+
	'.area-media:after{content:\'Media\'}'));
	var inText=['Synopsis', 'Characters', 'Cast, crew & About', 'Media'],
	 mapids=['area-synopsis','area-characters','area-castcrew','area-media'],
	 box=mapTipsBox=ct('div');
	box.className='maptipsbox';
	htmlbody.appendChild(box);
	
	for(var i=0;i<4;i++){
		var t=fv(mapids[i]);
		t.onmousemove = mapTips;
		if(applicationCache){
			t.addEventListener('touchstart', mapTips);
			t.addEventListener('touchmove', mapTips);
		}
	}
}
function mapTips(){
	var t=mapTipsBox,
	 s=t.style;
	t.className='maptipsbox '+event.srcElement.id;
	var pos = getFixMousePos();
	s.left = pos.x + 'px';
	s.top = pos.y + 20 + 'px';
	s.display = 'block';
	event.srcElement.onmouseout=mapTipsExit;
}
function mapTipsExit(){
	mapTipsBox.style.display = '';
}
