var ID_UPLOAD_FILE = 'uploader',
	ID_UPLOAD_BUTTON = 'upload-btn-big',
	ID_UPLOAD_BUTTON_MORE = 'upload-btn-dropdown',
	ID_TABLE_PANEL = 'xls_pane1',
	ID_TABLE_HOLDER = 'xls_table_holder',
	ID_TABLE_CAPTION = 'xls_caption',
	ID_SOURCE_HOLDER = 'xls_pane2',
	ID_SOURCE_TEXTAREA = 'xls_source',
	TAG_SORTABLE = 'sortable',
	TAG_UNSORTABLE = 'unsortable',
	TAG_VIRTUAL_TH_ROW = 'wikitable-thr',
	TAG_VIRTUAL_TH_COL = 'wikitable-thc';
(function(){
	fv(ID_UPLOAD_BUTTON).removeAttribute('disabled');
	fv(ID_UPLOAD_BUTTON_MORE).removeAttribute('disabled');
	fc('onloading')[0].style.display='none';
	
	// 预备
	var fr = new FileReader();
	fv(ID_UPLOAD_FILE).onchange = function(e){
		fr.readAsBinaryString(e.target.files[0]);
	};
	
	// 加载 Xlsx文件
	fr.onload = function(ev){
		try{
			var data = ev.target.result,
				wb = XLSX.read(data, { type:'binary' });
		}catch(e){
			pl('文件类型不正确');
			pl(e);
			return;
		}
		mui.tabs.activate(ID_TABLE_PANEL);
		var p1 = fv(ID_TABLE_HOLDER);
		for(var sheet in wb.Sheets){
			var sh = wb.Sheets[sheet],
				area = sh['!ref'];
			if(!area) continue;
			var cr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/.exec(area),
				row = cr[4] - cr[2] + 2, // 总行数
				col = hex26_xls(cr[3]) - hex26_xls(cr[1]) + 2; // 总列数
				table = ct('table');
			table.className = 'wikitable';
			for(var irow=0; irow<row; irow++){
				var r = ct('tr');
				table.appendChild(r);
				for(var icol=0; icol<col; icol++)
					r.appendChild(ct('td'));
			}
			pl(sh);
			for(var k in sh){
				var b = sh[k];
				if(k.startsWith('!')) continue; // later
				var pos = /([A-Z]+)([0-9]+)/.exec(k);
				if(pos.length < 3) continue;
				var r = pos[2] - 1,
					c = hex26_xls(pos[1]) - 1;
				try{
					table.children[r].children[c].innerText = b.w;
				}catch(e){
					pl('Error at row '+r+', col '+c);
					pl('total row '+row+', col '+col);
					pl(e);
				}
			}
			p1.appendChild(table);
			// 文本输入完毕，输入表格合并信息
			var merges = sh['!merges'],
				TAG_MERGED_CELLS = 'pre-delete-merged-cell';
			if(merges) merges.forEach(function(v, i){
				var pos = [v.s.r, v.s.c],
					endpos = [v.e.r, v.e.c],
					size = [endpos[0]-pos[0]+1, endpos[1]-pos[1]+1],
					firstcell = table.rows[pos[0]].children[pos[1]];
				for(var irow=pos[0]; irow<endpos[0]+1; irow++)
					for(var icol=pos[1]; icol<endpos[1]+1; icol++)
						table.rows[irow].children[icol].className = TAG_MERGED_CELLS;
				firstcell.className = '';
				if(size[0] > 1) firstcell.setAttribute('rowspan', size[0]);
				if(size[1] > 1) firstcell.setAttribute('colspan', size[1]);
			});
			// 应用表格合并
			var allpredelete = table.querySelectorAll('.'+TAG_MERGED_CELLS);
			for(var i=allpredelete.length; i>0; i--)
				allpredelete[i-1].remove();
			// 绑定点击事件
			table.onclick = function(e){
				if(!this.hasAttribute(TAG_SORTABLE)) return;
				e = window.event || e;
				e = e.target;
				if(!e.hasAttribute(TAG_VIRTUAL_TH_ROW)) return;
				if(e.hasAttribute(TAG_UNSORTABLE))
					e.removeAttribute(TAG_UNSORTABLE);
				else if(e.parentElement.children.length - this.querySelectorAll('[' + TAG_UNSORTABLE + ']').length > 1) // 必须至少保留一个
					e.setAttribute(TAG_UNSORTABLE, '');
			};
			// 表1 结束（在v2.0解锁多表解析）
			break;
		}
		fv(ID_TABLE_HOLDER).querySelector('table').remove(); // 移除之前添加的table
	};
	
	// 转换到 Wiki源码
	document.querySelector('[data-mui-controls^="'+ID_SOURCE_HOLDER+'"]').addEventListener('mui.tabs.showend', function(){
		var tb = fv(ID_SOURCE_TEXTAREA),
			table = document.querySelector('#'+ID_TABLE_HOLDER+'>.wikitable'),
			caption = fv(ID_TABLE_CAPTION);
		tb.innerText = '';
		if(!table) return;
		var res = '{| class="wikitable' + (table.hasAttribute(TAG_SORTABLE)? ' '+TAG_SORTABLE: '') + '"',
			trs = table.rows,
			cap = fv(ID_TABLE_CAPTION);
		if(cap.style.display != 'none' && cap.value.length > 0) res += '\n|+ ' + cap.value;
		for(var itrs=0; itrs<trs.length; itrs++){
			var tr = trs[itrs],
				tds = tr.children;
			res += '\n|-\n' + (tds[0].hasAttribute(TAG_VIRTUAL_TH_COL) || tds[0].hasAttribute(TAG_VIRTUAL_TH_ROW)? '!': '|'); // 首列加深
			for(var itds=0; itds<tds.length; itds++){
				var td = tds[itds],
					span = [1, 1],
					unsortable = td.hasAttribute(TAG_UNSORTABLE),
					style = '',
					isThisHead = td.hasAttribute(TAG_VIRTUAL_TH_COL) || td.hasAttribute(TAG_VIRTUAL_TH_ROW), // 首行加深
					next = itds+1>=tds.length? '': isThisHead? itrs>0 || (!tds[itds+1].hasAttribute(TAG_VIRTUAL_TH_ROW))? '\n|': ' ||': ' ||';
				if(td.hasAttribute('rowspan')) span[0] = parseInt(td.getAttribute('rowspan'));
				if(td.hasAttribute('colspan')) span[1] = parseInt(td.getAttribute('colspan'));
				if(span[0] > 1 || span[1] > 1 || unsortable)
					style = (span[0]>1? ' rowspan="'+span[0]+'"': '') + (span[1]>1? ' colspan="'+span[1]+'"': '') + 
						(unsortable? ' class="unsortable"': '') + ' |';
				res += style + ' ' + td.innerText + next;
			}
		}
		tb.innerText = res + '\n|}';
	});
})();
var _xls = {
	open: function(s){
		var f = fv(ID_UPLOAD_FILE),
			xls = '.xls,application/vnd.ms-excel,application/x-xls',
			xlsx = '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
		if(s=='xls') f.accept = xls;
		else if(s=='xlsx') f.accept = xlsx;
		else f.accept = xls+','+xlsx;
		f.click();
	},
	copy: function(){
		fv(ID_SOURCE_TEXTAREA).select();
		var succ;
		try{
			succ = document.execCommand('copy');
		}catch(e){}
		if(!succ) alert('无法一键复制，请手动复制。');
	},
	caption: function(){
		var inp = fv(ID_TABLE_CAPTION),
			painp = inp.parentElement;
		if((painp.style.display = painp.style.display == ''? 'none': '') == '') inp.focus();
	},
	tr: function(appoint){
		var table = fv(ID_TABLE_HOLDER).querySelector('table.wikitable');
		if(!table) return;
		var rows = table.rows,
			cells = rows[0].children,
			mode_addition = appoint==undefined || appoint==null? !cells[0].hasAttribute(TAG_VIRTUAL_TH_ROW): appoint;
		if(!mode_addition) this._cleansortable(table);
		for(var i=0; i<cells.length; i++)
			if(mode_addition) cells[i].setAttribute(TAG_VIRTUAL_TH_ROW, '');
			else cells[i].removeAttribute(TAG_VIRTUAL_TH_ROW);
	},
	sortable: function(){
		var table = fv(ID_TABLE_HOLDER).querySelector('table.wikitable');
		if(!table) return;
		var isOpen = table.hasAttribute(TAG_SORTABLE) && table.rows[0].children[0].hasAttribute(TAG_VIRTUAL_TH_ROW);
		if(isOpen) this._cleansortable(table);
		else table.setAttribute(TAG_SORTABLE, '');
		this.tr(!isOpen);
	},
	_cleansortable: function(table){
		table.removeAttribute(TAG_SORTABLE);
		for(var i=0, a=table.querySelectorAll('[' + TAG_UNSORTABLE + ']'); i<a.length; i++)
			a[i].removeAttribute(TAG_UNSORTABLE);
	},
	tc: function(){
		var table = fv(ID_TABLE_HOLDER).querySelector('table.wikitable');
		if(!table) return;
		var rows = table.rows,
			mode_addition = !rows[0].firstChild.hasAttribute(TAG_VIRTUAL_TH_COL);
		for(var i=0; i<rows.length; i++){
			var cell = rows[i].firstChild;
			if(mode_addition){
				cell.setAttribute(TAG_VIRTUAL_TH_COL, '');
				if(cell.hasAttribute('rowspan')) i += parseInt(cell.getAttribute('rowspan')) - 1;
			}else cell.removeAttribute(TAG_VIRTUAL_TH_COL);
		}
	},
	clean: function(){
		var table = fv(ID_TABLE_HOLDER).querySelector('table.wikitable');
		if(!table) return;
		var run = function(confirmcleanmode){ // 开始从最后一行清理
			var trs = table.rows,
				tr = trs[trs.length-1],
				tds = tr.children;
			if(confirmcleanmode){
				tr.remove();
				return;
			}else{
				for(var i=0; i<tds.length; i++){
					if(tds[i].innerText != '') return false;
				}
				run(true);
				return true;
			}
		},
		run2 = function(confirmcleanmode){ // 开始从最后一列清理
			var trs = table.rows;
			for(var i=0; i<trs.length; i++){
				var tr = trs[i],
					tds = tr.children,
					last_td = tds[tds.length-1];
				if(confirmcleanmode){
					last_td.remove();
				}else if(last_td.innerText != '') return false;
			}
			if(!confirmcleanmode){
				run2(true);
				return true;
			}
		},
		start = function(){
			var a=run(), b=run2(), c=5;
			while((c > 0) && (a || b)){
				a=run(); b=run2();
				c--;
			}
			if(a || b) setTimeout(start, 50);
		};
		start();
	},
	help: {
		sortable: function(){
			mui.msgbox.open('用户排序', '允许用户通过点击表头中的某一列，对每一行的内容进行排序。\n\n注意：\n1.排序后，所有合并的表格都将会自动分离。\n2.排序操作是临时发生的，表格将会在刷新页面时重置回初始状态。\n3.在本编辑器中，点击表头某一列，可以使该列单独禁用排序功能。');
		}
	}
};
var BTN_GO_TOP = fv('goto_top'), IS_ANIMATIONING_GO_TOP = false;
setInterval(function(){
	if(IS_ANIMATIONING_GO_TOP) return;
	BTN_GO_TOP.style.bottom=window.scrollY<100? '100%': '';
	if(window['mui']==undefined) return;
	if(mui.msgbox) return;
	mui.msgbox = {
		_entity: fc('msgbox')[0],
		open: function(title, content){
			var e = this._entity;
			mui.overlay('on', this, e);
			e.querySelector('.title').innerText = title;
			e.querySelector('.content').innerText = content;
		},
		close: function(){
			mui.overlay('off');
		},
		onclose: function(){
			htmlbody.appendChild(this._entity);
		}
	};
}, 500);
function scroll_top(btn){ // 右下角按钮，点击后滚动页面到顶部。
	btn.style.bottom='100%'; // 按钮飞走飞回的动画是在赋值位置参数时由 MUI 实现的，此处只是做延时赋值
	IS_ANIMATIONING_GO_TOP = true;
	setTimeout(function(){ IS_ANIMATIONING_GO_TOP=false; }, 1000);
	$('html,body').animate({ scrollTop: 0 }, 900);
}
(function(){ // 用于计算 Excel列 数值，A=1，Z=26，AA=27，没有零
	window['hex26_xls'] = function(n){
		var res = 0, mtp = 0;
		try{
			n = /[A-Z]*/.exec(n.toUpperCase())[0];
			for(var i=n.length-1; i>=0; i--){
				res += (n.charCodeAt(i) - 64) * Math.pow(26, mtp);
				mtp++;
			}
		}catch(e){}
		return res;
	}
})();
