function flvanalysis(file){
	var fr = new FileReader(),
		pointer = 0;
	var debugtime = 0,
		ts = 0;
	fr.onload = loader;
	seeknext();
	function loader(){
		if(Date.now() - debugtime > 60000){
			debugtime = Date.now();
			pl(new Date().format('HH:mm') + ' ' + ts);
		}
		var a = new Uint8Array(fr.result);
		switch(a[0]){
			case 70: // header tag
				pointer += 13;
				break;
			case 18: // script tag
				pointer += 11 + byte2int(a, [1, 2, 3]) + 4;
				break;
			case 8: // audio tag
				pointer += 11 + byte2int(a, [1, 2, 3]) + 4;
				break;
			case 9: // video tag
				pointer += 11 + byte2int(a, [1, 2, 3]) + 4;
				var tstmp = byte2int(a, [7, 4, 5, 6]);
				if(Math.abs(tstmp - ts) > 50){
					console.warn(tstmp);
				}
				ts = tstmp;
				break;
			default:
				pl('end');
				return;
		}
		seeknext();
	}
	function byte2int(bytes, order){
		var a = 0;
		order.foreach(function(e, i){
			a += bytes[e] * Math.pow(256, order.length - i -1);
		});
		return a;
	}
	function seeknext(){
		fr.readAsArrayBuffer(file.slice(pointer, pointer + 13));
	}
}
