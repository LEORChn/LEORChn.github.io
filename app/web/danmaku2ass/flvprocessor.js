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
	
	
	/*if (FlvPlayer.isSupported()) {
		var f = new FlvPlayer({
			// Accept http url, websocket url, and file type
			url: URL.createObjectURL(file),
			
			// Accept dom element, dom selector
			container: '.flvholder',
			
			// Video poster url
			//poster: '',
			
			// Whether to print debug information
			debug: false,
			
			// Whether live mode
			live: false,
			
			// Whether the video loops, in non-live mode
			loop: false,
			
			// Whether to use hotkeys, if the control exists
			hotkey: true,
			
			// Whether to turn off the volume
			muted: false,
			
			// On the mobile side, try to activate the audio after the user touches the screen.
			touchResume: true,
			
			// Video chunk size, the default is 1M
			videoChunk: 1024 * 1024,
			
			// Audio chunk size, the default is 16kb
			audioChunk: 16 * 1024,
			
			// Whether to play automatically
			autoPlay: false,
			
			// Whether it contains an audio stream
			hasAudio: true,
			
			// Whether to cache the video frame to play
			cache: true,
			
			// Maximum time difference between audio and video, unit is ms
			// used to automatically adjust audio and video synchronization
			maxTimeDiff: 200,
			
			// Whether to display the control, if the control exists
			control: true,
			
			// Indicates whether to do http fetching with cookies
			withCredentials: true,
			
			// Indicates total file size of media file, in bytes
			filesize: file.size,
			
			// Indicates whether to enable CORS for http fetching
			cors: true,
			
			// Volume from 0 to 1, the default is 0.7
			volume: 0.7,
			
			// Initialize the frame rate, which will be covered by the actual frame rate of the file
			frameRate: 30,
			
			// Initialize the width, which will be covered by the actual width of the file
			width: 400,
			
			// Initialize the height, which will be covered by the actual height of the file
			height: 300,
			
			// Initialize http headers
			headers: {},
			
			// The path of the video decoder, currently optional flvplayer-decoder-baseline.js and flvplayer-decoder-multiple.js
			decoder: 'flvplayer-decoder-baseline.js',
		});
		return f;
	}else{
		console.warn('Your browser does not support Flvplayer.js');
	}*/
}