(function(){
	var a = new Audio(),
		engines = ['baidu'],
		queue = [],
		fetching = false,
	onfinish = function(){
		fetching = false;
	};
	a.onended = a.onerror = fetch;
	
	window.tts = function(s){
		queue.push(s);
		fetch();
	};
	window.tts.control = a;
	window.tts.engines = engines.concat();
	window.tts.engine = engines[0];
	window.tts.__defineSetter__('volume', function(v){
		a.volume = v;
	});
	function fetch(){
		if(a.readyState == 0 || a.ended || a.error); else return;
		if(fetching || queue.length == 0) return;
		fetching = true;
		
		switch(window.tts.engine){
			case 'baidu':
				http('get https://fanyi.baidu.com/gettts?lan=zh&spd=5&source=wise&text=' + encodeURIComponent(queue.shift()), ArrayBuffer, function(){
					a.src = URL.createObjectURL(new Blob([new Uint8Array(this.response)]));
					a.play();
					onfinish();
				}, onfinish);
				break;
			default:
				onfinish();
		}
	}
})();
