var ID_UPLOAD_BUTTON = 'upload-btn-big',
	ID_TABLE_HOLDER = 'xls_pane1',
	ID_TABLE_CAPTION = 'xls_caption',
	ID_SOURCE_HOLDER = 'xls_pane2',
	ID_SOURCE_TEXTAREA = 'xls_source',
	TAG_VIRTUAL_TH_ROW = 'wikitable-thr',
	TAG_VIRTUAL_TH_COL = 'wikitable-thc';
defHex26();
(function(){
	fv(ID_UPLOAD_BUTTON).removeAttribute('disabled');
	fc('onloading')[0].style.display='none';
	
	// 预备
	var fr = new FileReader();
	fv('uploader').onchange = function(e){
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
			// 表1 结束（在v2.0解锁多表解析）
			break;
		}
		fv(ID_TABLE_HOLDER).querySelector('table').remove();
	};
	
	// 转换到 Wiki源码
	document.querySelector('[data-mui-controls^="'+ID_SOURCE_HOLDER+'"]').addEventListener('mui.tabs.showend', function(){
		var tb = fv(ID_SOURCE_TEXTAREA),
			table = document.querySelector('#'+ID_TABLE_HOLDER+'>.wikitable'),
			caption = fv(ID_TABLE_CAPTION);
		tb.innerText = '';
		if(!table) return;
		var res = '{| class="wikitable"',
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
					style = '',
					isThisHead = td.hasAttribute(TAG_VIRTUAL_TH_COL) || td.hasAttribute(TAG_VIRTUAL_TH_ROW), // 首行加深
					next = itds+1>=tds.length? '': isThisHead? itrs>0 || (!tds[itds+1].hasAttribute(TAG_VIRTUAL_TH_ROW))? '\n|': ' ||': ' ||';
				if(td.hasAttribute('rowspan')) span[0] = parseInt(td.getAttribute('rowspan'));
				if(td.hasAttribute('colspan')) span[1] = parseInt(td.getAttribute('colspan'));
				if(span[0] > 1 || span[1] > 1)
					style = (span[0]>1? ' rowspan="'+span[0]+'"': '') + (span[1]>1? ' colspan="'+span[1]+'"': '') + ' |';
				res += style + ' ' + td.innerText + next;
			}
		}
		tb.innerText = res + '\n|}';
	});
})();
var _xls = {
	copy: function(){
		fv(ID_SOURCE_TEXTAREA).select();
		var succ;
		try{
			succ = document.execCommand('copy');
		}catch(e){}
		if(!succ) alert('无法一键复制，请手动复制。');
	},
	caption: function(){
		var inp = fv(ID_TABLE_CAPTION);
		if((inp.style.display = inp.style.display == ''? 'none': '') == '') inp.focus();
	},
	tr: function(){
		pl('tr runs');
		var table = fv(ID_TABLE_HOLDER).querySelector('table.wikitable');
		if(!table) return;
		var rows = table.rows,
			cells = rows[0].children,
			mode_addition = !cells[0].hasAttribute(TAG_VIRTUAL_TH_ROW);
		pl('tr runs2 '+mode_addition);
		for(var i=0; i<cells.length; i++)
			if(mode_addition) cells[i].setAttribute(TAG_VIRTUAL_TH_ROW, '');
			else cells[i].removeAttribute(TAG_VIRTUAL_TH_ROW);
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
	}
};
function defHex26(){
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
}