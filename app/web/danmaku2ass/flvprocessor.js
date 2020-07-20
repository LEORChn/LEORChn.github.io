/*

	flvDuration( File / Blob, Function( int_time13 ))
	generalMediaDuration( File / Blob, Function( int_time13 ))
	
*/

function flvDuration(file, ondone){
	switch(file.name.toLowerCase().right(4)){
		case '.mkv':
		case '.mp4':
			generalMediaDuration(file, ondone);
			return;
	}
	var fr = new FileReader(),
		pointer = -4,
		MAX_REACHED_TIMESTAMP = 0,
	SIZE_CHUNK_BASEHEAD = { // 块基础大小
		70: 13, // 文件格式头
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
		if(isNaN(SIZE_CHUNK_BASEHEAD[a[0]])){ // 根据标记查找块头，如果未找到，判断当前状态为首次查找，并且为块尾
			pointer -= byte2int(a, [0, 1, 2, 3]);
			seeknext();
		}else{
			var ts = byte2int(a, [7, 4, 5, 6]);
			if(ts == 0){
				pointer -= 4;
				seeknext();
				return;
			}
			if(ondone) ondone(ts);
		}
		return;
	}
	seeknext();
}

// mkv, mp4
function generalMediaDuration(file, ondone){
	var v = ct('video');
	v.onloadedmetadata = function(){
		ondone(v.duration * 1000);
		v = null;
	};
	v.src = URL.createObjectURL(file);
}

/* 尝试通过 session_id 得到每条直播流的下载时间，但是没有用，每条直播流内的 session_id 都是一样的 */
/*
function flvStartTime(file, ondone){
	//if(!file.name.contains('160504')) return;
	var fr = new FileReader(),
		pointer = 0,
		MAX_REACHED_TIMESTAMP = 0,
	SIZE_CHUNK_BASEHEAD = { // 块基础大小。【键值】 + byte2int(1, 2, 3) = byte2int(【尾部块4位】)
		70: 13, // 文件格式头
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
		fr.readAsArrayBuffer(file.slice(pointer, pointer + 2000));
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
		switch(a[0]){
			case 8:
			case 9:
				pointer += byte2int(a, [1, 2, 3]);
			case 70:
				pointer += SIZE_CHUNK_BASEHEAD[a[0]] + SIZE_CHUNK_FOOT[a[0]];
				seeknext();
				break;
			case 18:
				var datasize = byte2int(a, [1, 2, 3]);
				var str = '';
				var a1 = new Uint8Array(fr.result.slice(11, 11+datasize));
				for (var i=0, len=a1.length; i<len; i++){
					str += String.fromCharCode(a1[i]);
				}
				var shift = str.indexOf('session_id');
				var SHIFT_SELF = 10;
				if(shift == -1) return; // 未找到键名
				var SHIFT_TOTAL = 11 + shift + SHIFT_SELF + 2;
				a1 = new Uint8Array(fr.result.slice(SHIFT_TOTAL, SHIFT_TOTAL + 6));
				var a21 = byte2int(a1, [0, 1]) & 0x1fff; // 大于28位的高位
				var a22 = byte2int(a1, [2, 3, 4, 5]) >> 4 & 0xfffffff; // 28个低位
				var a23 = Math.pow(2, 28) * a21 + a22; // 高位乘以2炮28，加上低位
				pl('return: '+a23);
				if(ondone) ondone(a23);
			default:
				return;
		}
		
	};
	seeknext();
}
*/
