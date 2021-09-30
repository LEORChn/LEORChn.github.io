(function(){
// 窗体拖动（基础、鼠标）
var windowdrag = [];
setInterval(function(){
	$$('[window]').foreach(function(e){
		if('dragwindow' in e) return;
		e.addEventListener('mousedown', tryStartingDragWindow);
		e.dragwindow = true;
	});
}, 500);
function tryStartingDragWindow(compatEvent){
	var e = compatEvent || event;
	if(e.button != 0) return;
	windowdrag = [this, e.layerX, e.layerY];
	this.setAttr('drag');
}
function verifyDragWindow(compatEvent){
	var e = compatEvent || event;
	if(!windowdrag.length) return;
	//windowdrag[1]
	if(!e.buttons.flag(1)){
		windowdrag[0].removeAttribute('drag');
		windowdrag = [];
		return;
	}
	var s = windowdrag[0].style;
	s.left = e.pageX - windowdrag[1] + 'px';
	s.top  = e.pageY - windowdrag[2] + 'px';
}
// 窗体拖动（扩展、触屏）
document.body.addEventListener('mousemove', verifyDragWindow);
'touchstart touchmove touchend'.split(' ').foreach(function(e){
	document.addEventListener(e, function(){
		if(!event.target.hasAttribute('window')) return;
		(event.type == 'touchstart'? tryStartingDragWindow: verifyDragWindow).apply(event.target, [event.toMouseEvent()]);
	});
})
Object.assign(TouchEvent.prototype, {
	toMouseEvent: function(){
		var pg = this.touches.length? [this.touches[0].pageX, this.touches[0].pageY]: [];
		return this.type == 'touchend'? {
			button: 0,
			buttons: 0,
			target: this.target
		}: {
			button: 0,
			buttons: 1,
			pageX: pg[0],
			pageY: pg[1],
			layerX: pg[0] - this.target.offsetLeft,
			layerY: pg[1] - this.target.offsetTop,
			target: this.target
		};
	}
});
// 窗体拖动（扩展、窗体大小）
// TODO
})();
