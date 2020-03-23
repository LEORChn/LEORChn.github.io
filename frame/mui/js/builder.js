(function(){
	'use strict';
	function $(v){ return document.querySelector(v); }
	
	let header, aside, siteName = '\u745E\u517D\u8C37';
	
	htmlhead.appendChild(ct('title', ui.title + ' - ' + siteName));
	
	(function(){ // 加载标题栏
		header = ct('header#header.header-shadow');
		let appbar = ct('nav#appbar.mui-container-fluid'),
			table = ct('table'),
			tr = ct('tr.mui--appbar-height'),
			tdL = ct('td'),
			menuBtnVertical = ct('a#appbar-sidenav-show.mui--visible-xs-inline-block mui--visible-sm-inline-block'),
			menuBtnVIcon = ct('i.icon-menu'),
			menuBtnHorizontal = ct('a#appbar-sidenav-hide.mui--hidden-xs mui--hidden-sm'),
			menuBtnHIcon = ct('i.icon-menu'),
			uiTitle = 'title' in ui.head? ui.head.title: ui.title,
			titleHolder = ct('a.appbar-brand', uiTitle),
			tdR = ct('td.mui--text-right');
		htmlbody.prependChild(header);
		header.appendChild(appbar);
		appbar.style.background = 'theme' in ui.head? ui.head.theme: 'linear-gradient(to left, rgb(125,127,221), rgb(0,153,255))';
		appbar.appendChild(table);
		table.setAttribute('width', '100%');
		table.setAttribute('cellspacing', '0');
		table.appendChild(tr);
		tr.appendChildren(tdL, tdR);
		tdL.appendChildren(menuBtnVertical, menuBtnHorizontal, titleHolder);
		menuBtnVertical.appendChild(menuBtnVIcon);
		menuBtnHorizontal.appendChild(menuBtnHIcon);
		if('drop' in ui.head){
			let menuDropdown = ct('div.mui-dropdown'),
				menuDropdownTrigger = ct('a#appbar-more-vert'),
				menuDropdownIcon = ct('i.icon-more-vert'),
				menuDropdownUl = ct('ul.mui-dropdown__menu mui-dropdown__menu--right');
			tdR.appendChild(menuDropdown);
			menuDropdown.appendChildren(menuDropdownTrigger, menuDropdownUl);
			menuDropdownTrigger.setAttribute('data-mui-toggle', 'dropdown');
			menuDropdownTrigger.appendChild(menuDropdownIcon);
			ui.head.drop.forEach(function(e){
				let li = ct('li'),
					a = ct('a', e.name);
				a.href = e.data;
				menuDropdownUl.appendChild(li);
				li.appendChild(a);
			});
		}
	})();
	
	(function(){ // 加载进度组件
		if('loader' in ui && !ui.loader) return; // 必须显式声明loader为false或null，才不会添加进度组件
		let onloading = ct('div.onloading'),
			progressbar = ct('div.progress'),
			progbarInner = ct('div.indeterminate'),
			progt = ct('div.progress-text');
		header.appendChild(onloading);
		onloading.appendChild(progressbar);
		progressbar.appendChild(progbarInner);
		onloading.appendChild(progt);
		if(progt){
			let r='preloader-wrapper active,spinner-layer spinner-blue-only,circle-clipper left,circle,gap-patch,circle,circle-clipper right,circle'.split(','),
				p=[0,1,2,1,4,1,6];
			for(let i=0; i<r.length; i++){
				r[i] = ct('div.'+r[i]);
				if(i) r[p[i-1]].appendChild(r[i]);
			}
			progt.appendChild(r[0]);
		}
		let r=',#component_name,,#component_percent,#component_loaded,,#component_total,'.split(','),
			s=' \u6B63\u5728\u52A0\u8F7D,\u7EC4\u4EF6,... ( ,,2, / ,0, ) '.split(','),
			p=[0,0,0,0,3,3,3,0];
		for(let i=0; i<r.length; i++){
			r[i]=ct('span', s[i]);
			(p[i]? r[p[i]]: progt).appendChild(r[i]);
		}
		//var getVarName = function(){
		//	return /at.*?\.(\S*?)\s+\(/g.exec(new Error().stack)[1]);
		//}, ;
		ui.loader={
			root: 1,
			hide: function(){
				onloading.style.display = 'none';
			},
			set title(n){ this.window.title.innerText = n; },
			get current(){ try{ return parseInt(this.window.current.innerText); }catch(x){} return 0; },
			set current(v){ this.window.current.innerText = v; },
			set total(v){ this.window.total.innerText = v; },
			window: {
				title: r[1],
				current: r[4],
				total: r[6]
			}
		};
		
		setInterval(function(){
			ui.loader.current = $$('script[src]').length;
		}, 500);
	})(); // -- END -- 加载进度组件
	
	(function(){ // 加载侧边栏
		aside = ct('div#sidedrawer');
		var sidenav = ct('div#sidenav.mui--no-user-select'),
			siteNameContainer = ct('div'),
			siteNameHolder = ct('h2.mui--appbar-line-height'),
			siteNameDisplay = ct('a', siteName),
			siteNameDivider = ct('div.mui-divider'),
			sideMenu = ct('ul.mui-expand'),
			list = sideMenu;
		htmlbody.insertAfter(aside, header);
		aside.appendChild(sidenav);
		sidenav.appendChildren(siteNameContainer, siteNameDivider, sideMenu);
		siteNameContainer.appendChild(siteNameHolder);
		siteNameHolder.appendChild(siteNameDisplay);
		siteNameDisplay.href = '/';
		
		ui.side.forEach(function(e){
			var li = ct('li');
			list.appendChild(li);
			if(!(e.data instanceof Array)){
				var a = ct('a');
				a.href = e.data;
				if('_blank' in e && e._blank) a.setAttribute('target', '_blank');
				a.appendChild(ct('strong', e.name));
				li.appendChild(a);
				if(a.href == location.href){
					a.setAttribute('onclick', 'return false');
					addClass(a, 'active');
				}
			}else{
				var strong = ct('strong'),
					table = ct('table'),
					tr = ct('tr'),
					td = ct('td.mui-caret'),
					ul = ct('ul');
				tr.appendChildren(ct('td', e.name), td);
				table.appendChild(tr);
				strong.appendChild(table);
				for(let i=0, d=e.data; i<d.length; i+=2){
					let li = ct('li'),
						a = ct('a', d[i]);
					if(d[i].startsWith('<')) a.innerHTML = d[i];
					if('_blank' in e && e._blank instanceof Array? e._blank[Math.floor(i/2)]: e._blank)
						a.setAttribute('target', '_blank');
					a.href = d[i+1];
					li.appendChild(a);
					ul.appendChild(li);
					if(a.href == location.href){
						a.setAttribute('onclick', 'return false');
						addClass(a, 'active');
					}
				}
				li.appendChildren(strong, ul);
			}
		});
	})(); // -- END -- 加载侧边栏

/* 关于 侧边栏中 _blank 的值
	不填写 = false
	是数组 = 数组与 data 子项索引 对应值
*/

	(function(){ // 加载内容容器
		var root = ui.content.root = ct('div#content-wrapper'),
			win = ui.content.window = ct('div#'+ui.content.window_name+'.mui-container-fluid.mui-col-sm-offset-1.mui-col-sm-10');
		if(ui.content.fitsSystemWindows === false); else{ // 显式声明为false才不会将标题栏padding下
			root.appendChild(ct('div#appbar-placeholder.mui--appbar-height'));
		}
		htmlbody.insertAfter(root, aside);
		root.appendChild(win);
	})();

})();

(function(){
	var launchpad = fv('msgbox-launchpad') || ct('div#msgbox-launchpad');
	var msgbox = ct('div.msgbox mui--z5 mui-container-fluid'),
		table = [ct('table'), ct('tr'), ct('td.title mui--appbar-height appbar-brand')],
		content = ct('div.content'),
		btn_positive = ct('button.btn-ok mui-btn mui-btn--flat mui-btn--primary', '\u786E\u5B9A');
	btn_positive.setAttribute('onclick', 'ui.msgbox.close()');
	table[1].appendChild(table[2]);
	table[0].appendChild(table[1]);
	msgbox.appendChildren(table[0], content, btn_positive);
	launchpad.appendChild(msgbox);
	htmlbody.appendChild(launchpad);
	
	ui.msgbox = function(title, content, onclosedo){
		if(!title) title = '';
		if(!content) content = '';
		var e = this._entity;
		e.querySelector('.title').innerText = title;
		e.querySelector('.content').innerText = content;
		mui.overlay('on', {
			onclose: function(){ // 弹出层被关闭后
				launchpad.appendChild(e); // 返回发射台
				if(onclosedo instanceof Function) onclosedo(); // 执行其他自定义行为
			}
		}, e);
	};
	ui.msgbox.prototype = {
		_entity: msgbox,
		_launchpad: launchpad
	};
	ui.msgbox.close = function(){
		mui.overlay('off');
	};
})();

// loadjs.js
loadjs=function(){function e(e,n){e=e.push?e:[e];var t,r,i,c,o=[],f=e.length,a=f;for(t=function(e,t){t.length&&o.push(e),--a||n(o)};f--;)r=e[f],i=s[r],i?t(r,i):(c=u[r]=u[r]||[],c.push(t))}function n(e,n){if(e){var t=u[e];if(s[e]=n,t)for(;t.length;)t[0](e,n),t.splice(0,1)}}function t(e,n,r,i){var o,s,u=document,f=r.async,a=(r.numRetries||0)+1,h=r.before||c;i=i||0,/(^css!|\.css$)/.test(e)?(o=!0,s=u.createElement("link"),s.rel="stylesheet",s.href=e.replace(/^css!/,"")):(s=u.createElement("script"),s.src=e,s.async=void 0===f||f),s.onload=s.onerror=s.onbeforeload=function(c){var u=c.type[0];if(o&&"hideFocus"in s)try{s.sheet.cssText.length||(u="e")}catch(e){u="e"}if("e"==u&&(i+=1)<a)return t(e,n,r,i);n(e,u,c.defaultPrevented)},h(e,s)!==!1&&u.head.appendChild(s)}function r(e,n,r){e=e.push?e:[e];var i,c,o=e.length,s=o,u=[];for(i=function(e,t,r){if("e"==t&&u.push(e),"b"==t){if(!r)return;u.push(e)}--o||n(u)},c=0;c<s;c++)t(e[c],i,r)}function i(e,t,i){var s,u;if(t&&t.trim&&(s=t),u=(s?i:t)||{},s){if(s in o)throw"LoadJS";o[s]=!0}r(e,function(e){e.length?(u.error||c)(e):(u.success||c)(),n(s,e)},u)}var c=function(){},o={},s={},u={};return i.ready=function(n,t){return e(n,function(e){e.length?(t.error||c)(e):(t.success||c)()}),i},i.done=function(e){n(e,[])},i.reset=function(){o={},s={},u={}},i.isDefined=function(e){return e in o},i}();

// loadwindow.js
window.addEventListener('load', function() {
	loadjs("https://cdn.muicss.com/mui-0.9.41/js/mui.min.js", "mui", {numRetries: 3});
	loadjs("https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js", "jquery", {numRetries: 3});
	//loadjs("https://www.muicss.com/static/cache/vendor/jquery-2.1.4/jquery-f9c7afd057.min.js", "jquery", {numRetries: 3});
	loadjs("/frame/mui/js/script-272177dc8a.min.js", "script", {numRetries: 3});
});
