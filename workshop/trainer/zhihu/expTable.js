(function(){
	var t = document.createElement('table');
	document.body.appendChild(t);
	t.setAttribute('rules', 'all');
	[
		'Combo 1 2 3 4 5  6  7 29 30 31+',
		'Exp   1 2 4 6 8 10 15 15 30 15'
	].map(function(e){
		var r = document.createElement('tr');
		t.appendChild(r);
		e.split(/\s+/).map(function(e){
			var d = document.createElement('td');
			r.appendChild(d);
			d.innerText = e;
		});
	});
})();

(function(){
	var t = document.createElement('table');
	document.body.appendChild(t);
	t.setAttribute('rules', 'all');
	[
		'Lv       1   2   3   4    5    6    7    8     9    10    11',
		'Require  0  50 200 600 1200 2000 4000 9000 15000 25000 40000',
		'Next    50 150 400 600  800 2000 5000 6000 10000 15000'
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
		// 更新记录：
		// 杨超越的后花园 2021-6-22
		// 杨超越和她的朋友们 2021-6-22
		 4367 ~  8216 = 7
		 9050 ~ 14936 = 8
		15138 ~ 24501 = 9
		25408 ~ 39194 = 10
		40366 ~ 46769 = 11
		    ? ~     ? = 12
	*/
})();
