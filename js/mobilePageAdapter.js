function initMobilePageAdapter(oDiv){
	var dw=document.documentElement.clientWidth;//适配设备宽度
	if(dw<1100){
		var d=fc('device');//上半整体,头图,导航栏
		for(var i=0;i<d.length;i++) addClass(d[i],'adapting');
		d[1].style.width='0px';
		d[0].style.width=
		d[1].style.paddingRight=
		oDiv.style.width=
		fv('brows').style.width=dw+'px';
		d[2].style.width=dw+'px';
		var hideheight=Math.max((1100-dw)/(1100-240)*-135,-135);
		fv('header').style.marginTop=hideheight+'px';
		d[0].style.height=303+hideheight+'px';
	}
}