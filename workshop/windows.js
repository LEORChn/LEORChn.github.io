(function(){
// 初始化窗体排列
var default_pos_count = 0;
function resizeDefaultPosition(e){ // 这是一个默认的位置重置方法，当新建窗口时位置设置为 Windows 系统默认，那么他的实际位置就是这样计算的
	var shifting = 24; // 窗口间的位置相互偏移 24像素，从左上到右下依次排列，10个窗口计一次循环
	e.style.left = e.style.top = `${default_pos_count++ % 10 * shifting + shifting}px`;
}
$$('[window]').foreach(function(e){
	resizeDefaultPosition(e);
});
// 窗体拖动（基础、鼠标）
var windowdrag = [];
var zidx = 0; // 窗体图层顺序存储
setInterval(function(){
	$$('[window]').foreach(function(e){
		// 这是一个只有重新加载网页或新加入窗体时才会判定成功的标记，不会记录在DOM中，目的是表示窗体拖动逻辑已注入到窗体元素
		if('dragwindow' in e) return;
		e.dragwindow = true;
		// 开始注入窗体拖动逻辑
		e.addEventListener('mousedown', tryStartingDragWindow);
	});
}, 500);
// tryStartingDragWindow方法，用于判定该事件是否使某窗口进入拖移模式，以及在进入拖移模式前进行一些初始化操作
// compatEvent参数，指优先使用兼容性事件。因为兼容性事件是将触屏事件通过下方的函数转换到光标事件的，这样可以只适配光标事件而暂时无需考虑原生触屏事件
function tryStartingDragWindow(compatEvent){
	var e = compatEvent || event;
	if(e.button != 0) return;
	// 重新设置所被拖移的窗体，存入值为：所响应拖移事件的窗体，以及光标相对于该窗体之内的坐标
	windowdrag = [this, e.layerX, e.layerY];
	// 在进入拖移模式时，将伪元素覆盖住整个窗体（主要是iframe上方），防止拖移事件误传递到iframe内导致事件没有被正确响应
	this.setAttr('drag');
	// 将焦点窗体激活到顶部图层
	this.style.zIndex = zidx++;
}
// verifyDragWindow方法，用于判定该事件是否对窗体造成有效拖移，以及计算对窗体的拖移偏移值
function verifyDragWindow(compatEvent){
	var e = compatEvent || event;
	if(!windowdrag.length) return;
	if(!e.buttons.flag(1)){ // 鼠标左键的激活状态已失效
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
// 这是一个将光标事件转换为触屏事件的工具函数（只响应第一个触屏点）
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
