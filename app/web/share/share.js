(function(){
	ui.loader.hide();
	var cr = $('#content-root'),
		win = $('#share-window');
	while(cr.children.length)
		win.appendChild(cr.children[0]);
})();
