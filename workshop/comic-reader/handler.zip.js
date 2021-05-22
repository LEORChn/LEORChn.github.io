
function zipHandler(f, cb){ //gildas-lormeau.github.io/zip.js/demos/demo-read-file.html 2020-5-20
	var entries = new zip.ZipReader(new zip.BlobReader(f)).getEntries();
	entries.then(function(a, pr){
		a.foreach(function(f){
			if(f.directory) return;
			if(f.encrypted) return pr = true;
		});
		if(!pr){ // !!! encrypted
			gotdata(a);
			return;
		}
		cb.pt.foreach((e) => { // !! encrypted !!
			a[0].getData(
				new zip.BlobWriter(),
				opjMaker(e)
			).then((f) => {
				gotdata(a, opjMaker(e));
			}).catch(function(){});
			function opjMaker(e, p = {}){
				p[atob('cGFzc3dvcmQ=')] = e;
				return p;
			}
		});
	});
	function gotdata(e){
		if(gotdata.closed) return;
		gotdata.closed = arguments;
		extor.aa = e.map(function(e){
			if(e.directory) return null;
			var f = e.getData(
				new zip.BlobWriter(),
				gotdata.closed[1]
			).then(function(e){
				f.url = URL.createObjectURL(e);
			});
			return f;
		}).filter((e) => e != null);
		extor();
	}
	function extor(){
		var c = extor.aa.length;
		extor.aa.foreach(function(e){
			if(e.url) c--;
		});
		cb(extor.aa, extor.aa.length - c);
		if(c) return setTimeout(extor, 500);
	}
}
