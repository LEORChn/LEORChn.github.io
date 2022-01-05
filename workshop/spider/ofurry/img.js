var z = new JSZip();
function fetch_next_img(){
	var oj = $('[origin-src]:not([src])');
	if(oj.getAttribute('origin-src').contains('ofur.cc/')){
		oj.src = '/';
		return fetch_next_img();
	}
	http('get ' + oj.getAttribute('origin-src'), 'referer: https://ofurry.com/', ArrayBuffer, function(){
		oj.src = new Blob([this.response]).toURL();
		fetch_next_img();
	});
}
function exportImages(){
	return JSON.stringify($$('[origin-src][src]').map(function(e, i){
		return {
			url: e.src,
			name: i + '_' + e.parentNode.parentNode.className + '_' + e.parentNode.className,
			note: e.getAttribute('origin-src')
		}
	}));
}
function containToZip(obj){
	obj.foreach(function(e){
		impl(e.url, e.name, e.note);
	});
	function impl(bloburl, name, note){
		http('get ' + bloburl, ArrayBuffer, function(){
			z.file(name, this.response, {
				comment: note
			});
		});
	}
}
function exportZip(){
	z.generateAsync({
		type: "blob",
	    compression: "DEFLATE",
	    compressionOptions: {
	        level: 9
	    }
	}, function(meta){
		pl(`压缩进度：${Math.floor(meta.percent)}%`);
	}).then(function(e){
		window.zipfile = e;
	});
}
