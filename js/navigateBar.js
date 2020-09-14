//使用到的 style:
//class: floating
//tagName: pht
function initNavigate(oDiv){
	setNavigateBarFloat(oDiv);
}
function setNavigateBarFloat(oDiv){
	var H=0, iE6, Y=oDiv;//导航栏悬浮
	while(Y){H+=Y.offsetTop;Y=Y.offsetParent}; 
	iE6=window.ActiveXObject&&!window.XMLHttpRequest;
	window.onscroll=function(){
		var s=document.body.scrollTop||document.documentElement.scrollTop;
		if(s>H){
			addClass(oDiv,'floating');
			if(iE6)oDiv.style.top=(s-H)+"px";
		}else{
			oDiv.className=oDiv.className.replace('floating','');
		}
	};
	oDiv.style.visibility='';//显示导航栏
}