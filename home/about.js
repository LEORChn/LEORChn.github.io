(function(){
	initDonationList();
	//wxprepare(fv('wxdonate'));
	vprepare(fv('androido'));//checkIfOnLoad();
})();
function initDonationList(){
	var tb,tr,td,
	u=location.origin+"/api/dntlist.json";
	//pl(u);
	http('get',u,'',function(){
		u=eval('('+this.responseText+')').data;
		td=fv('loadnotice'); if(td)td.parentNode.removeChild(td);
		tb=ft('table')[0];
		for(var td=0,i=0,len=u.length;i<len;i++) td+=u[i].p;
		for(var i=0,added=0,len=u.length;i<len;i++){
			if(added>=5 && u[i]['protect']!=1) continue;
			tr=tb.insertRow();
			tr.appendChild(ct('td', u[i].n));
			tr.appendChild(ct('td', u[i].s));
			tr.appendChild(ct('td', (u[i].p<=50? u[i].p: (u[i].p/td*100).toFixed(1)+'%')));
			tr.appendChild(ct('td', u[i].t));
			tb.appendChild(tr);
			added++;
		}
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
