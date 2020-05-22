function flvDuration(file, ondone){
	var fr = new FileReader(),
		pointer = -4,
		MAX_REACHED_TIMESTAMP = 0,
	 SIZE_CHUNK_BASEHEAD = { // 块基础大小
	 	70: 13, // 头
	 	8: 11, // 视频
	 	9: 11, // 音频
	 	18: 11 // 脚本数据对象
	 },
	 SIZE_CHUNK_FOOT = { // 块尾部指示本块大小的块大小
	 	8: 4,
	 	9: 4,
	 	18: 4,
	 	70: 0
	 },
	 seeknext = function(){
		fr.readAsArrayBuffer(file.slice(pointer));
	 },
	 byte2int = function(bytes, order){
	 	var a = 0;
	 	order.foreach(function(e, i){
	 		a += bytes[e] * Math.pow(256, order.length - i -1);
	 	});
	 	return a;
	 };
	fr.onload = function(){
		var a = new Uint8Array(fr.result);
		if(isNaN(SIZE_CHUNK_BASEHEAD[a[0]])){
			pointer -= byte2int(a, [0, 1, 2, 3]);
			seeknext();
		}else{
			if(ondone) ondone(byte2int(a, [7, 4, 5, 6]));
		}
		return;
	}
	seeknext();
	// =============== // 底下的都是旧版垃圾代码。。运行极慢
	/*
	fr.onload = function(){
		var a = new Uint8Array(fr.result);
		if(!isNaN(SIZE_CHUNK_BASEHEAD[a[0]]))
				pointer += SIZE_CHUNK_BASEHEAD[a[0]] + SIZE_CHUNK_FOOT[a[0]];
		switch(a[0]){
			case 'F'.charCodeAt(0): // 头块
				// 此处应添加更多的验证FLV头的手段
				seeknext();
				break;
			case 8: // 视频块
				pointer += byte2int(a, [1, 2, 3]);
				MAX_REACHED_TIMESTAMP = Math.max(
					MAX_REACHED_TIMESTAMP,
					byte2int(a, [7, 4, 5, 6])
				);
				var IS_KEYFRAME = a[11] & 0x10 > 0;
				seeknext();
				break;
			case 9: // 音频块
				pointer += byte2int(a, [1, 2, 3]);
				MAX_REACHED_TIMESTAMP = Math.max(
					MAX_REACHED_TIMESTAMP,
					byte2int(a, [7, 4, 5, 6])
				);
				seeknext();
				break;
			case 18: // 脚本数据对象
				pointer += byte2int(a, [1, 2, 3]);
				seeknext();
				break;
			default:
				pl('Pointer: {0} (0x{1})'.format(pointer, pointer.toString(16)));
				pl('unknown block type '+a[0]);
				pl(fr.result);
		}
		//if(parseInt(MAX_REACHED_TIMESTAMP / 1000) % 30 == 0)
		//pl('NextPointer: {0} (0x{1}); TS: {2}'.format(pointer, pointer.toString(16), MAX_REACHED_TIMESTAMP));
	}
	*/
}

function flvStartTime(file){
	
}
