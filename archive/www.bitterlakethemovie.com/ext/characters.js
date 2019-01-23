imports('/js/http, mapTips, navigation, langSwitch, betterScaleTips');

var nameindex=0;
function setCurrentDisplayCharacter(index){
	var namelist=['winters','dale','arden','drraer'];
	var idtag=fv('character-desc').firstElementChild;
	idtag.className='char '+namelist[index];
	var chardetails=fc('chardetail');
	for(var i=0;i<chardetails.length;i++) chardetails[i].style.display='none';
	chardetails[index].style.display='';
	
	var sideimagelist=['winters','quill','quill','quill'];
	fv('content-left').getElementsByTagName('div')[0].style.background='url(images/side-'+sideimagelist[index]+'.jpg)';
	origHighlight='hl-'+namelist[index];
	nameindex=index;
}

var lastHash;
function regOnLocationChanged(){
	if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
    	window.onhashchange = onLocationChanged;
	}else{
		lastHash=window.location.hash;
		setInterval(function(){
			if(lastHash != window.location.hash){
				lastHash=window.location.hash;
				onLocationChanged();
			}
    	}, 300);
	}
}
function onLocationChanged(){
	var hashlist=['winters','dale','arden','drraer'],
		hash=window.location.hash.replace('#',''),
		index=0;
	for(var i=0;i<hashlist.length;i++){
		if(hashlist[i]==hash){
			index=i;
			break;
		}
	}
	for(var i=0,a=fv('character-list').childNodes;i<a.length;i++) a[i].className='hl-'+hashlist[index];
	setCurrentDisplayCharacter(index);
}
regOnLocationChanged();
onLocationChanged();

//	<!--此处以下增加一个不怎么显眼的小提示-->
addBugTips();
function addBugTips(){
	if(!('mapTips' in window)){
		pl('characters > addBugTips(): waiting for mapTips.js');
		setTimeout(addBugTips, 500);
		return;
	}
	htmlbody.appendChild(ct('style',".character-side-picture:after{white-space:pre-wrap; content:'This problem was confirmed.\\A 3 side-pictures cannot be displayed when switch characters page because the files was lost.\\A So I, the mirror website builder, replace it to another picture to make it not so empty.'}"));
	htmlbody.appendChild(ct('script',"var csp=fv('content-left').firstElementChild; csp.id='character-side-picture'; csp.onmousemove=mapTips; // mapTips.js"));
}
addCharacterTips();
function addCharacterTips(){
	htmlbody.appendChild(ct('script',"for(var i=0,a=fv('character-list').getElementsByTagName('a');i<a.length;i++) if(a[i].id) a[i].setAttribute('tid','dict_'+a[i].id);"));
}
