(function(){
	var t = document.createElement('table');
	document.body.appendChild(t);
	t.setAttribute('rules', 'all');
	[
		'Lv       1   2   3   4    5    6    7    8     9',
		'Require  0  50 200 600 1200 2000 4000 9000 15000',
		'Next    50 150 400 600  800 2000 5000 6000'
	].map(function(e){
		var r = document.createElement('tr');
		t.appendChild(r);
		e.split(/\s+/).map(function(e){
			var d = document.createElement('td');
			r.appendChild(d);
			d.innerText = e;
		});
	});
	/*
		// 8升9数据来自 杨超越的后花园 2021-5-3
		14936 = 8
		15138 = 9
		
		// 采集备用 杨超越和她的朋友们 2021-5-3
		16045 ~ 24501 = 9
		26285 ~ 38731 = 10
		40366 ~ 43048 = 11
	*/
})();
