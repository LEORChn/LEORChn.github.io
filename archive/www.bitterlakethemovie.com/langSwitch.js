/* 功能实现：语言切换
 * 
 * -- 变量 --
 * currentLangMode	当前的语言模式，其值为LANGCODES的索引。
 * LANGCODES	所有支持的语言列表，当其中一种语言的语言代码为 null 时，表示其为原始语言。
 * langSaveKey	用于存储在 cookie 中的 name，存储的值为 LANGCODES 的语言代码。
 * languageSwitcher	公开的可视组件。语言选择器。位于页面底部中间。只有这个组件在改变 cookie。
 * languageDictionaryBox	公开的可视组件。字典提示框。在需要时出现并跟随鼠标移动。如要对该组件增加新引用，需要编辑语言CSS文件。
 * 
 * -- 用于初始化的函数方法 --
 * addLangSwitcher	将语言选择器增加在页面底部
 * addLangDictTipbox	将字典提示框增加在页面中，并隐藏，以便备用
 * checkIsHaveToSwitchLanguage	读取 cookie，用于确认该页面是否需要在加载完毕后立即翻译
 * 
 * -- 其他函数方法 --
 * loadLangCssByIndex	读取语言列表，并传入语言代码给 loadLangCss
 * loadLangCss	不建议外部调用。该函数会直接加载语言文件到当前页面中，即使当前页面已经加载了一个语言文件。
 * applyLangCss	不建议外部调用。该函数会先等待语言文件加载完成，然后为当前页面需要进行翻译的组件加载文本。
 * langDict	不建议手动调用。该函数会显示【那个跟随鼠标移动的浮动提示框】。如要调用，需要在语言CSS文件中编辑调用。
 * langDictExit	该函数会隐藏【那个跟随鼠标移动的浮动提示框】。
 */
var currentLangMode = 0,
	LANGCODES = [
	['语言 / English', null],
	['简体中文', 'zh-hans']
],
	langSaveKey='lang_bitterlake',
	languageSwitcher, languageDictionaryBox;
addLangSwitcher();
addLangDictTipbox();
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
	for(var i=0;i<LANGCODES.length;i++){
		s.appendChild(ct('option', LANGCODES[i][0]));
	}
	s.onchange=function(){
		if(this.selectedIndex==currentLangMode) return; // the switch box is unchanged
		var code=LANGCODES[this.selectedIndex][1];
		if(code) cok_a(langSaveKey, code, null, 86400000*365); // expire time: shift now to future 365 days (a year)
		else cok_d(langSaveKey);
		if(currentLangMode==0){ // not yet loaded any lang css file
			loadLangCssByIndex(this.selectedIndex);
		}else{ // the page was loaded another lang css file
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
	applyLangCss();
}
function applyLangCss(){
	var ss=document.styleSheets,
	 langCode=LANGCODES[currentLangMode][1],
	 loaded=-1;
	for(var i=0;i<ss.length;i++){ // check if is load to local
		if(ss[i].href && ss[i].href.endsWith('lang_' + langCode + '.css')){
			loaded=i;
			break;
		}
	}
	if(loaded==-1){ // not loaded, set a timer and wait for
		setTimeout(applyLangCss, 300);
		return;
	}
	ss = ss[loaded].cssRules;
	for(var i=0;i<ss.length;i++){
		var st=ss[i].selectorText,
		 isFloat=st.includes('::after'), // all includes ::after is floating box
		 res= document.querySelectorAll(isFloat? st.replace('::after',''): st);
		for(var e=0;e<res.length;e++){
			var c=ss[i].style.content;
			if(isFloat) res[e].innerText='';
			else res[e].innerHTML=c.substr(1,c.length-2);
		}
	}
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

function addLangDictTipbox(){
	var t=languageDictionaryBox=ct('div');
	t.id='langDictTipbox';
	t.className='maptipsbox';
	htmlbody.appendChild(t);
}
function langDict(dict){
	var t=languageDictionaryBox,
	 s=t.style;
	t.className='maptipsbox '+dict;
	var pos=getMousePos();
	s.left = pos.x + 'px';
	s.top = pos.y + 20 + 'px';
	s.display = 'block';
	this.onmouseout=langDictExit;
}
function langDictExit(){
	languageDictionaryBox.style.display='';
}
