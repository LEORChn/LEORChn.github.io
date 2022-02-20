
// require base.js
// icons by https://codepen.io/yaoyi/pen/cylrx

function TreeView(){
	if(this == self) return;
	
	// ---< Exported Function >--- //
	this.setData = setData; // 输入树状图数据。可以在外部更新数据。Array 或 Object 都可以传入
	this.fromFileList = _f; // 输入文件列表数据。可以直接上传文件夹类型 input 内的 files 值
	this.setView = setView; // 输入显示区域。调用该方法后其元素内部会完全重绘
	this.refresh = refresh; // 对当前已展开的树状图进行一次完全的数据更新
	// ===< Exported Function >=== //
	
	var d, v;
	
	function setData(e){
		d = e;
		return (build(), this);
	}
	function setView(e){
		v = e;
		return (build(), this);
	}
	function build(){
		if(!(d && v)) return;
		var nodeRoot = type(d) == 'Array'? d: d.items,
			error = checkNodeData(nodeRoot);
		if(error) return console.error(`TreeView: ${error[1]}\n${error[0]}`);
		function checkNodeData(e){
			/*
				此方法主要就是校验格式。确保：
				name	String	必须存在，且必须为字符串
				items	Array	如果有此属性，则必须为数组
				size	Number	如果有此属性，则必须为数字
				length	Number	如果有此属性，则必须为数字。此属性只有在没有 size 时才需要检测是否存在
			*/
			var err;
			e.foreach(function(f, i){
				if(!('name' in f) || type(f.name) != 'String') return err = [`*.${i}`, '文件(夹)名称无效'];
				if('items' in f){
					if(type(f.items) != 'Array'){
						return err = [f.name, 'items 数据格式无效'];
					}else{
						err = checkNodeData(f.items);
						if(err) return err[0] = f.name + '/' + err[0];
					}
				}else{
					if('size length'.split(' ').foreach(function(e){
						if((e in f) && type(f[e]) != 'Number') return err = [f.name, `${e} 数据格式无效`];
					})) return true;
				}
			});
			return err;
		}
		var count = genNodeData(nodeRoot);
		if(d != nodeRoot) d.count = count;
		v.clearChildren().appendChildren(buildNode(d == nodeRoot? d: [d]));
		v.className = 'treeview';
		function buildNode(e){
			return e.map(function(e){
				var isdir = 'items' in e,
					childnodes = isdir? buildNode(e.items): null,
					classname  = isdir? 'folder': 'file',
					size       = isdir? e.count[1]: 'size' in e? e.size: 'length' in e? e.length: 0;
					desc      = (isdir? e.count[0] + ' 文件, ': '') + size.toFileSize(2),
					nameplate  = ct('div.name', e.name).appendChildren(ct('span.desc', desc)),
					collapse   = isdir? ct('input.collapse').setAttr('type', 'checkbox').setAttr(e.count[0] > 100? 'checked': ''): null,
					folderRoot = ct('div.' + classname).appendChildren(isdir?
						[nameplate, collapse, ct('div.children').appendChildren(childnodes)]:
						nameplate);
				folderRoot.onclick = onfolderclick;
				return folderRoot;
			});
		}
		function onfolderclick(){
			event.block();
			if(event.target.classList.contains('children')) return; // 如果没有这行，那么在文件夹内拖动选择文字时会意外导致折叠或展开
			var inp = this.$('.collapse'); // 先判断所点的是文件夹还是文件。能找到这个复选框那么就是文件夹
			if(inp) inp.checked ^= true; // 折叠或展开逻辑，只要异或真就可以。真异或真等于假，假异或真等于真
		}
	}
	function refresh(){
		
	}
	function genNodeData(e){
		var totalFiles = 0, totalLength = 0;
		e.foreach(function(f){
			if('items' in f){ // 当前对象是文件夹
				f.count = genNodeData(f.items); // 如果当前对象是目录则优先进入下一级路径进行统计
				totalFiles += f.count[0];
				totalLength += f.count[1];
			}else{ // 当前对象是文件
				totalFiles++;
				'size length'.split(' ').foreach(function(e){ // 从对象中查找 size 或 length 并加到当前目录信息中，如果两者都具备则优先且只使用 length，如果都找不到就算了
					if(e in f) return (totalLength += f[e], true);
				});
			}
		});
		return [totalFiles, totalLength];
	}
	function _f(fl){
		var root = [], // 用于树形表的数据
			fs = {}; // 一个文件系统的模拟
		fl.foreach(function(e, i){
			var nowpath = root;
			if('webkitRelativePath' in e){
				var paths = e.webkitRelativePath.split('/'),
					fspath = fs;
				paths.pop();
				paths.foreach(function(e){
					if(e in fspath){
						fspath = fspath[e];
						nowpath = fspath['.'].items;
					}else{
						var newobj = {
							name: e,
							items: []
						};
						nowpath.push(newobj);
						fspath[e] = {
							'.': newobj
						};
						fspath = fspath[e];
						nowpath = newobj.items;
					}
				});
			}
			nowpath.push({
				name: e.name,
				size: 'size' in e? e.size: 'length' in e? e.length: 0
			});
		});
		setData(root);
	}
}
