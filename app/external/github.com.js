/*
	adapting: Github
	compatbility: Chrome 43
	update: 2020-11-1
*/

if(location.host == 'github.com'){
	setInterval(function(){
		commitDetailExpandButton();
		regDetailsMenu();
		regDetails_IncludeFragment();
	}, 2000);
}

// ===== ===== // 仓库提交记录页面、搜索结果页面
function commitDetailExpandButton(){
	arr($$('button.ellipsis-expander')).foreach(function(e){
		e.onclick = commitDetailExpandButtonImpl;
	});
}
function commitDetailExpandButtonImpl(){
	var c = this.parentNode.parentNode.parentNode.parentNode.classList,
		cn = 'Details--on';
	if(!c.contains('Details')) return;
	if(c.contains(cn)) c.remove(cn); else c.add(cn);
}

// ===== ===== // 仓库分支切换、
function regDetailsMenu(){
	arr($$('details-menu[preload]:not([processing]), details[open] > details-menu[src]:not([processing])')).foreach(function(e){
		e.setAttribute('processing', '');
		http('get ' + e.getAttribute('src'), function(elem){
			e.querySelector('.SelectMenu-modal').innerHTML = this.responseText;
		});
	});
}

// ===== ===== // 
function regDetails_IncludeFragment(){
	arr($$('details[open][data-deferred-details-content-url] include-fragment:not([processing])')).foreach(function(e){
		e.setAttribute('processing', '');
		var _this = e;
		while(_this.nodeName != 'DETAILS') _this = _this.parentNode;
		http('get ' + _this.getAttribute('data-deferred-details-content-url'), function(elem){
			e.outerHTML = this.responseText;
		});
	});
}
