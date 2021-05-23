var requiredModule = (
	'zip zipHandler ' +
	'fv'
).split(' ');

document.body.ondragover = function(){
	event.block();
	event.dataTransfer.dropEffect = 'link';
	return false; // 增加此函数并返回 false，让浏览器识别到该元素的拖放操作已被接管，从而让浏览器取消默认操作
}
document.body.ondrop = function(){
	event.block();
	drive.files = window.event.dataTransfer.files; // 在元素的 ondrop 事件中，通过获取 event.dataTransfer.files 获取文件列表 FileList 对象
	try{
		main();
	}catch(e){}
	return false; // 然后返回 false，避免执行到默认操作
};

window.onload = function(){
	console.clear();
	drive.onchange = main;
	if(drive.files.length) main(); // 在网页加载完之前，用户就已经输入文件
}
function isModuleLoading(){
	for(var i=0, r=requiredModule; i<r.length; i++){
		if(!(r[i] in window)) return true;
	}
}
function main(){
	if(isModuleLoading()){
		console.log('please wait..');
		return setTimeout(main, 500);
	}
	var file = drive.files || f;
	if(type(file) != 'FileList') return;
	var pt = 'c2lseXVpdGkgMDA4MDAgbWltYSB3d3cuYnVoYW8uc2hvcA';
	callback.pt = atob(pt + '  == ='.split(' ')[pt.length % 4]).split(' ');
	var ext = /\.([\d\w]*)$/.exec(file[0].name);
	if(!(ext && ext[1])){
		alert('暂不支持忽略后缀，请检查文件类型并手动更改后缀');
	}
	switch(ext[1].toLowerCase()){
		case 'zip':
			zipHandler(file[0], callback);
			break;
		case 'rar':
		case '7z':
		case 'cab':
		case 'lzma':
			alert(ext[1] +'\n已知文件类型，但功能暂未实现');
			break;
		default:
			alert('未知文件类型 ' + ext[1]);
	}
	function callback(urlobj, progress){
		var content = $('#content'),
			loadinglabel = $('#loadinglabel');
		if(!content.hasAttribute('loading')){
			while(content.children.length) content.children[0].remove();
		}
		content.setAttribute('loading', '');
		loadinglabel.innerText = parseInt(progress / urlobj.length * 100) + '%';
		if(progress == urlobj.length){
			urlobj.foreach(function(e){
				var img = ct('img');
				img.src = e.url;
				content.appendChild(img);
			});
		}
		
		if(progress == urlobj.length) content.removeAttribute('loading');
	}
}
