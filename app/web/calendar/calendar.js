
var calendar_tab_salt = 'calendar-tab-';

(function(){
	ui.loader.title = '数据';
	ui.loader.total = 1;
	ui.loader.current = 0;
	var tab_panes = [];
	
	(function(){ // 载入标签：提醒、总览
		var tabroot = ct('ul.mui-tabs__bar mui-tabs__bar--justified_disable'),
			tabActive = 1,
			tabs = '提醒 总览 开发'.split(' '),
			tab_salt = calendar_tab_salt;
		tabs.foreach(function(e, i){
			var li = ct('li'),
				a = ct('a', e);
			a.setAttribute('data-mui-toggle', 'tab');
			a.setAttribute('data-mui-controls', tab_salt + i);
			li.appendChild(a);
			tabroot.appendChild(li);
			
			var pane = ct('div#' + tab_salt + i + '.mui-tabs__pane');
			tab_panes.push(pane);
			if(i == tabActive){
				pane.className += (li.className = ' mui--is-active');
			}
		});
		var rootpane = ct('div.mui-panel');
		ui.content.window.appendChildren(ct('br'), rootpane);
		rootpane.appendChild(tabroot);
		tab_panes.foreach(function(e){
			rootpane.appendChild(e);
		});
	})();
	
	httpj('get data.json', function(j){
		ui.loader.hide();
		var days = [];
		j.data.foreach(function(e){
			var obj = {},
				conv_type = {
					'节日': 'festival',
					'生日': 'birthday',
					'纪念日': 'anniversary'
				},
				conv_subtype = {
					'游戏': 'game',
					'彩虹旗': 'rainbowflag',
					'程序员': 'programmer'
				},
				conv_date = function(since, date){
					/*
						1900-1969: 
						1970-1999: 70-99
						2000-2069: 0-69
						2070-2099: 170-199
					*/
					if(since == undefined) since = 70;
					since += since < 70 && since >= 0? 2000: 1900;
					date = /(\d+)(\d{2})/.exec(date);
					pl(date);
					return new Date(since + '/' + date[1] + '/' + date[2]);
				};
			obj.type = conv_type[e.type];
			if('sub' in e) obj.subtype = conv_subtype[e.sub];
			obj.date = conv_date(e.since, e.date);
			obj.name = e.name;
			obj.desc = e.desc;
			days.push(obj);
		});
		days.sort(function(x, y){ // 先比月份后比天，防止二月29天
			var xm = x.date.getMonth(), ym = y.date.getMonth()
				xd = x.date.getDate(), yd = y.date.getDate();
			return xm != ym?
				xm > ym? 1: -1:
				xd != yd?
					xd > yd? 1: -1:
					0;
		});
		days.foreach(function(e){ // 总览
			var d = e.date,
				yyyy = d.getFullYear() == 1970? '': d.getFullYear() + '年';
			
			var pane = ct('div.mui-panel'),
				title = ct('div.mui--text-title', e.name),
				time = ct('time.mui--text-subhead', yyyy + `${d.getMonth()+1}月${d.getDate()}日`),
				desc = ct('div', (e.desc || ''));
			pane.setAttribute('type', e.type);
			if('subtype' in e) pane.setAttribute('subtype', e.subtype);
			pane.appendChildren(title, time, desc);
			tab_panes[1].appendChild(pane);
		});
	});
	
	(function(){
		var win = tab_panes[2],
			up = $('#uploader'),
			fr = new FileReader()
			allsub = up.parentNode.children;
		up.onchange = function(e){
			fr.readAsBinaryString(e.target.files[0]);
		};
		fr.onload = function(ev){
			try{
				var data = ev.target.result,
					wb = XLSX.read(data, { type:'binary' });
					fv('source').innerText = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
			}catch(e){
				msgbox('文件类型不正确', '错误');
				pl(e);
				return;
			}
		};
		arr(allsub).foreach(function(e){
			win.appendChild(e);
		});
	})();
})();