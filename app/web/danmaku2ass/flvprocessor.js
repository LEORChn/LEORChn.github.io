/*

	flvDuration( File / Blob, Function( int_time13 ))
	generalMediaDuration( File / Blob, Function( int_time13 ))
	
	logic: 这个文件是否FLV =>
	         否 => generalMediaDuration()
	         是 => seeknext() => FileReader.onload() => loader() => 文件尾部是否异常 =>
	           是 => findFromBrokenFileFooter()
	           否 => 用 seeknext() 定位到最后一个视频流或音频流块，然后用 loader() 读取信息
	
	reference [1]: https://www.jianshu.com/p/7ffaec7b3be6
*/

function flvDuration(file, ondone, onfail){
	switch(file.name.toLowerCase().right(4)){
		case '.mkv':
		case '.mp4':
			generalMediaDuration(file, ondone, onfail);
			return;
	}
	var fr = new FileReader(),
		pointer = -4,
		MAX_REACHED_TIMESTAMP = 0,
	SIZE_CHUNK_BASEHEAD = { // 块基础大小
		70: 13, // 文件格式头
		8: 11, // 音频
		9: 11, // 视频
		18: 11 // 脚本数据对象
	},
	SIZE_CHUNK_FOOT = { // 块尾部指示本块大小的块大小
		70: 0,
		8: 4,
		9: 4,
		18: 4
	},
	MAX_SEEK_BYTES = 1000000, // 976.5 KiB
	MAX_SEEK_BYTES_FROM_FOOTER = 65536, // 64 KiB
	seeknext = function(){
		if(Math.abs(pointer) < file.size){
			fr.readAsArrayBuffer(file.slice(pointer));
		}else{
			pl(file);
			pl(file.name+' 从文件尾部搜索时发生指针范围异常：\n指针为 '+pointer+'，而文件大小为 '+file.size);
			if(onfail) onfail();
		}
	},
	byte2int = function(bytes, order){
		var a = 0;
		order.foreach(function(e, i){
			a += bytes[e] * Math.pow(256, order.length - i -1);
		});
		return a;
	};
	function loader(){
		var a = new Uint8Array(fr.result);
		if(isNaN(SIZE_CHUNK_BASEHEAD[a[0]])){ // 根据标记查找块头，如果未找到，判断当前状态为首次查找，并且为块尾
			var lastBlockSize = byte2int(a, [0, 1, 2, 3]);
			 // 倒位指示器大于文件自身或者64KB的，判断为意外文件尾
			if(Math.abs(lastBlockSize) > file.size || Math.abs(lastBlockSize) > MAX_SEEK_BYTES_FROM_FOOTER){
				pl(file);
				pl(file.name+' 文件遇到意外文件尾 '+lastBlockSize+'，文件大小为 '+file.size+'，大出 '+(lastBlockSize-file.size));
				fr.onload = findFromBrokenFileFooter;
				pointer -= MAX_SEEK_BYTES_FROM_FOOTER;
				seeknext();
				return;
			}
			pointer -= lastBlockSize;
			seeknext();
		}else{ // a 前几个字节为块头
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
	/*
		从文件尾随机位置开始找视频/音频流头，并获取大致时间戳
		
		test case: LiveRecord-BOOG-15426-Part0-20200920-140227.flv
		reference: 1
		
		TODO: 还有一种情况是尾部很长一段距离就是全零数据，文件范例应该在上面那个文件之前不远处。
	*/
	function findFromBrokenFileFooter(){
		var a = arr(new Uint8Array(fr.result)),
			ls = [],
			writing = false;
		var isdone;
		a.foreach(function(e){
			if(e == 8 || e == 9) // 如果找到可能的音视频流块头，开始将字节流填充到数组
				writing = true;
			if(!writing) return; // 如果尚未允许填充，跳过当前字节
			ls.push(e);
			if(ls.length < SIZE_CHUNK_BASEHEAD[ls[0]]) return; // 如果数组填充量尚且不足，暂时跳过读取阶段
			var blocksize = byte2int(ls, [1, 2, 3]),
				ts = byte2int(ls, [7, 4, 5, 6]);
			pl('ts: '+ts);
			// 我觉得一个视频块或者音频块的大小不会超过64KB，而 “这个块” 标注的大小已经超过了
			if(blocksize > MAX_SEEK_BYTES_FROM_FOOTER){
				while(1){ // 考虑到当前第一个字节不是音视频流块头，并且真正的块头可能已经存在于本数组某处的情况
					ls.shift(); // 先删了第一字节，然后把之后的非块头字节也删了
					if(ls[0] == 8 || ls[0] == 9)
						break; // 如果遇到块头字节则停止删除操作，尝试以此字节作为块头并读取所需数据
					if(ls.length == 0){ // 数组已经完全删除，重置到首次填充数组的状态
						writing = false;
						break;
					}
				};
				return;
			}
			// 应该没有问题吧？那么就用这个作为视频长度了
			if(ondone) ondone(ts);
			isdone = true;
			return true;
		});
		if(isdone) return; // 由于闭包原因，包外再做一次判断
		if(onfail) onfail(); // 读完了，没有读到有用的信息，失败了
	}
	fr.onload = loader;
	seeknext();
}

// mkv, mp4
function generalMediaDuration(file, ondone, onfail){
	var v = ct('video');
	v.onloadedmetadata = function(){
		if(ondone) ondone(v.duration * 1000);
		pl(type(this));
		this.onloadedmetadata = null;
		this.removeAttribute('src');
		this.load();
		v = null;
		delete this;
	};
	v.onerror = function(){
		if(onfail) onfail();
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
