(function(){
	initPersonaTags();
	initDonationList();
	//wxprepare(fv('wxdonate'));
	vprepare(fv('androido'));//checkIfOnLoad();
})();
function initPersonaTags(){
	var froot = fv('persona_tags'),
		t = froot.getAttribute('tags').split(',');
	for(var i=0, len=t.length; i<len; i++){
		var displayName = t[i].replace(/^\+/, '').replace(/-$/, ''),
			pn = displayName.toLowerCase(),
			thumb = t[i].startsWith('+'),
			isDeprecated = t[i].endsWith('-');
		var root = ct('div'), sp = ct('span', displayName);
		root.className = 'mui-panel tag';
		if(thumb){
			var img = ct('img');
			img.src = '/article/'+pn.replace(/\s/g, '-')+'/thumb96.jpg';
			img.setAttribute('draggable', 'false');
			root.appendChild(img);
		}
		if(isDeprecated) sp.style.opacity = (root.style.opacity = .5) - .3;
		root.appendChild(sp);
		froot.appendChild(root);
	}
}
function initDonationList(){
	httpj('get /api/dntlist.json', function(j){
		var note = fv('loadnotice');
		if(note) note.remove();
		var table = fv('dntlist'),
			tbody = ct('tbody'),
			tbody2 = ct('tbody');
		table.appendChildren(tbody, tbody2);
		
		var total = 0,
			added = 0;
		j.data.foreach(function(e){
			total += e.p;
			var tr = ct('tr');
			tr.appendChildren(
				ct('td', e.n),
				ct('td', e.s),
				ct('td', e.p),
				ct('td', e.t)
			);
			if(added < 8 || ('protect' in e)){
				tbody.appendChild(tr);
				added++;
			}else{
				tbody2.appendChild(tr);
			}
		});
		var pretr = ct('tr'),
			pretd = ct('td'),
			displayall = ct('label', '显示全部');
		pretd.setAttribute('colspan', 4);
		displayall.setAttribute('for', 'display_all_donate');
		pretd.appendChild(displayall);
		pretr.appendChild(pretd);
		tbody2.prependChild(pretr);
		
		pretr = ct('tr');
		pretd = [ct('td', '总计'), ct('td', total)];
		pretd[0].setAttribute('colspan', 2);
		pretr.appendChildren(pretd[0], pretd[1]);
		tbody2.appendChild(pretr);
	});
}
function checkIfOnLoad(){
	if(document.readyState.toLowerCase()=='complete'){
		
	}else
		setTimeout(checkIfOnLoad,500);
}
function vprepare(v){
	var ua=navigator.userAgent.toLowerCase();
	unsup:for(;;){
		for(;;){
			if(ua.indexOf(' mobile')>0)break;
			if(ua.indexOf(' applewebkit/')>0)break unsup;
			break;
		}
		var im=ct('img');
		im.className='androido';
		im.width='240';
		im.height='270';
		im.src='https://developer.android.google.cn/about/versions/oreo/images/oreo-superhero_2x.png';
		//v.outerHTML='<img class="androido" align="right" src="https://developer.android.google.cn/about/versions/oreo/images/oreo-superhero_2x.png">'
		v.appendChild(im);
		//fc('androido')[0].onclick=function(){this.style.visibility='hidden';};
		return;
	}
	var vd=ct('video');
	vd.className='androido';
	vd.style.float='right';
	vd.src='https://developer.android.google.cn/about/versions/oreo/images/oreo-superhero.webm';
	vd.autoplay='true';
	//v.outerHTML='<video id="androido" class="androido" style="float:right" src="https://developer.android.google.cn/about/versions/oreo/images/oreo-superhero.webm" autoplay="">'
	//v=fc('androido')[1];
	v.appendChild(vd);
	vd.onended=function(){if(this.title=='')return;this.currentTime=4.3;this.play();}
	vd.onclick=function(){this.title='androido'; if(this.ended)this.onended();else if(this.paused)this.play();else this.pause(); }
}
function wxprepare(v){
	//var ua=navigator.userAgent.toLowerCase();
	/*if(ua.indexOf(' mobile')>0)
		v.href='weixin://wxpay/bizpayurl?pr=f2f0Pb0JgakNs9OzGSriFCXXMnTkQXc69dnU';
	else v.download='*.png';*/
}
function download(url,fname){
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(url));
	pom.setAttribute('download', fname);
	pom.style.display = 'none';
	document.body.appendChild(pom);
	pom.click();
	document.body.removeChild(pom);
}
