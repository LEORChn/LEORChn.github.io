imports('/js/http, mapTips, navigation, langSwitch, betterScaleTips');

addSignatureTips();
function addSignatureTips(){
	if(!('mapTips' in window)){
		pl('index > addSignatureTips(): waiting for mapTips.js');
		setTimeout(addSignatureTips, 500);
		return;
	}
	htmlbody.appendChild(ct('style',".signature:after{content:'Signature: Michael Wolf Visser a.k.a Shay'}"));
	htmlbody.appendChild(ct('script',"fv('signature').onmousemove=mapTips; // mapTips.js"));
}
