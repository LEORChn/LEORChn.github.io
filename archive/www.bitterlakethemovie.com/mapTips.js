initMapTips();
function initMapTips(){
	htmlbody.appendChild(ct('style','.maptipsbox{position:absolute;border:2px solid #81512d;padding:8px;background:#c0a377;color:#fff;display:none}'));
	var inText=['Synopsis', 'Characters', 'Cast, crew & About', 'Media'],
	 mapids=['area-synopsis','area-characters','area-castcrew','area-media'];
	for(var i=0;i<4;i++){
		var t=ct('div', inText[i]);
		t.id='maplocal'+i;
		t.className='maptipsbox';
		htmlbody.appendChild(t);
		regMapTips(t, fv(mapids[i]));
	}
}

function regMapTips(){
	for(var i=0;i<arguments.length;i+=2){
		var t=arguments[i],
		 s=t.style,
		 b=arguments[i+1];
		b.onmousemove=function(e){
			var pos = _maptips_getMousePos(e);
			s.left = pos.x + 'px';
			s.top = pos.y + 20 + 'px';
			s.display = 'block';
		}
		b.onmouseout=function(){ 
			s.display = 'none'; 
		}; 
	}
}

function _maptips_getMousePos(e){
	var x,y, r=document.documentElement,
	 e = e||window.event; 
	return{
		x:e.clientX+htmlbody.scrollLeft+r.scrollLeft,
		y:e.clientY+htmlbody.scrollTop+r.scrollTop
	};
}