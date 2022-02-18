function setDragSelectionHandler(e, a, f){
	var startpos = 0;
	e.addEventListener('mousedown', function(){
		var calculatedOffset = [0, 0],
			offsetTarget = event.target;
		while(offsetTarget != e){
			calculatedOffset[0] += offsetTarget.offsetLeft;
			calculatedOffset[1] += offsetTarget.offsetTop;
			offsetTarget = offsetTarget.offsetParent;
		}
		startpos = [
			event.offsetX + calculatedOffset[0],
			event.offsetY + calculatedOffset[1]
		]; // 可能还要减个 scrollTop and scrollLeft
		e.setAttr('dragselect');
	});
	e.addEventListener('mousemove', function(){
		if(!startpos || event.target != e) return;
		if(!event.buttons) return e.dispatchEvent(new CustomEvent('mouseup')); // 这个解决了如果在拖拽识别区域外松手再进入时的界面BUG
		var areashift = [
			event.offsetX - startpos[0],
			event.offsetY - startpos[1]
		];
		Object.assign(a.style, {
			left: (areashift[0] > 0? 0: 1) * areashift[0] + startpos[0] + 'px',
			top:  (areashift[1] > 0? 0: 1) * areashift[1] + startpos[1] + 'px',
			width:  Math.abs(areashift[0]) + 'px',
			height: Math.abs(areashift[1]) + 'px',
			display:  'block',
			position: 'absolute'
		});
	});
	e.addEventListener('mouseup', function(){
		startpos = 0;
		Object.assign(a.style, {
			width: 0,
			height: 0,
			display: 'none'
		});
		e.removeAttribute('dragselect');
	});
}

// 在鼠标移动时，检测上次所点击的文件和进行点击的时间，文件相同且必须在0.5秒内松开才进行文件打开
function setDragSelectionChildrenClickHandler(e, f){
	e.addEventListener('mousedown', onclickready);
	e.addEventListener('mousemove', onclickraise);
	var readyclick = [0, 0];
	function onclickready(){
		if(!(event.buttons && 1)) return; // 必须是左键点击，但暂且忽略功能键组合
		readyclick = [this, Date.now()];
	}
	function onclickraise(){
		if(readyclick[0] != this || Date.now() - readyclick[1] > 500) return;
		readyclick = [0, 0];
		f.apply(e);
	}
}
