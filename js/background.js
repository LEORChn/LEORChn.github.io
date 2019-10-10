(function(){
	var a=ct('canvas');
	a.style.cssText='height:100%; width:100%; position:fixed; left:0; top:0; z-index:-999'; // 设置绘制位置
	document.body.appendChild(a);
	var ad = { c:a.getContext('2d'), col:0, w:0, h:0 };
		char = "10".split(''), // 表示绘制文字所用的字符集
		font_size = 24, // 表示绘制文字的字号
		drops = [];
	function update(){
		var b=[a.clientWidth, a.clientHeight];
		if(ad.w < b[0] || ad.h < b[1]); else return; // 仅限窗口的宽或高扩展到比之前更大时更新
		a.style.minWidth  = (a.width  = ad.w = b[0]) + 'px';
		a.style.minHeight = (a.height = ad.h = b[1]) + 'px';
		ad.col= ad.w / font_size;
	    for (var x=0; x<ad.col; x++) drops[x]=1;
	};
	setInterval(function(){
		update(); // 检查设置（例如窗口大小）的更新
		ad.c.fillStyle = "rgba(0, 0, 0, 0.1)"; // 表示对上一帧绘制文字的覆盖力度。数值越大，尾巴越短
		ad.c.fillRect(0, 0, ad.w, ad.h);
		ad.c.fillStyle = "rgba(0, 255, 0, 0.3)"; // 表示绘制文字的初始绘制色
		ad.c.font = font_size + "px arial"; // 表示绘制文字的字体
		for (var i=0; i<drops.length; i++){
			var text = char[Math.floor(Math.random() * char.length)];
			ad.c.fillText(text, i * font_size, drops[i] * font_size);
			if(drops[i]*font_size>ad.h && Math.random()>0.975) drops[i]=0;
			drops[i]++;
		}
	}, 50); // 表示帧率。若数值为50，则计算为1000/50=20帧
})();
