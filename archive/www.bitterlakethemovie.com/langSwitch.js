var currentLangMode = 0,
	LANGCODES = [
	['语言 / English', null],
	['简体中文', 'zh-hans']
],
	langSaveKey='lang_bitterlake',
	languageSwitcher;
addLangSwitcher();
checkIsHaveToSwitchLanguage();
function addLangSwitcher(){
	var d=ct('div'),
	t=d.style,
	s=languageSwitcher=ct('select'),
	li;
	t.position='fixed';
	t.margin='auto';
	t.textAlign='center';
	t.bottom=t.left=t.right=0;
	t.zIndex=-9999;
	for(var i=0;i<LANGCODES.length;i++){
		s.appendChild(ct('option', LANGCODES[i][0]));
	}
	s.onclick=function(){
		if(this.selectedIndex==currentLangMode) return; // unchanged
		var code=LANGCODES[this.selectedIndex][1];
		if(code) cok_a(langSaveKey, code);
		else cok_d(langSaveKey);
		if(currentLangMode==0){ // not load any lang css file
			loadLangCssByIndex(this.selectedIndex);
		}else{ // is load some lang css file
			location.reload(); // reload to make it available
		}
	}
	d.appendChild(s);
	htmlbody.appendChild(d);
}
function loadLangCssByIndex(langIndex){
	currentLangMode=langIndex;
	loadLangCss(LANGCODES[langIndex][1]);
}
function loadLangCss(langCode){ // by code name
	var fpath='lang_'+ langCode +'.css';
	dynamicLoadCss(fpath);
	http('get',fpath,'',function(){
		var s=this.response,
		r=new RegExp('#([a-zA-Z0-9_]*):after','g'),
		g=r.exec(s);
		while(g != null){
			var v=fv(g[1]);
			if(v) v.innerText='';
			g=r.exec(s);
		}
	});
}
function checkIsHaveToSwitchLanguage(){
	var langCode=cok(langSaveKey), langIndex=0;
	if(!langCode) return; // not found need to change language
	for(var i=0;i<LANGCODES.length;i++){
		if(LANGCODES[i][1] == langCode){
			loadLangCssByIndex(i);
			languageSwitcher.selectedIndex=i;
			break;
		}
	}
}
