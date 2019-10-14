var ID_TABLE_HOLDER = 'xls_pane1',
	ID_TABLE_CAPTION = 'xls_caption',
	ID_SOURCE_HOLDER = 'xls_pane2',
	ID_SOURCE_TEXTAREA = 'xls_source';
defHex26();
(function(){
	fc('onloading')[0].style.display='none';
	var fr = new FileReader();
	fv('uploader').onchange = function(e){
		fr.readAsBinaryString(e.target.files[0]);
	};
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
				pl('create row #'+irow);
				for(var icol=0; icol<col; icol++)
					r.appendChild(ct('td'));
			}
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
			break;
		}
		fv(ID_TABLE_HOLDER).querySelector('table').remove();
	};
	document.querySelector('[data-mui-controls^="'+ID_SOURCE_HOLDER+'"]').addEventListener('mui.tabs.showend', function(){ pl('mui.tabs.showend called');
		var tb = fv(ID_SOURCE_TEXTAREA),
			table = document.querySelector('#'+ID_TABLE_HOLDER+'>.wikitable'),
			caption = fv(ID_TABLE_CAPTION);
		tb.innerText = '';
		if(!table) return;
		var res = '{| class="wikitable"',
			trs = table.querySelectorAll('tr'); pl('check wikitable ok');
		for(var itrs=0; itrs<trs.length; itrs++){
			var tr = trs[itrs],
				tds = tr.children;
			res += '\n|-\n|';
			for(var itds=0; itds<tds.length; itds++){
				var td = tds[itds];
				res += (itds==0? '': ' ||') + ' ' + td.innerText;
			}
		} pl('output  ok');
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
		inp.style.display = inp.style.display == ''? 'none': '';
	},
	clean: function(){
		var table = fv(ID_TABLE_HOLDER).querySelector('table');
		if(!table) return;
		t = table.querySelector('tr').parentElement;
		var run = function(confirmcleanmode){ // 开始从最后一行清理
			var trs = t.children,
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
			var trs = t.children;
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
			var a=run(), b=run2();
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