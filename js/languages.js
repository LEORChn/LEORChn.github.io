
window.addEventListener('load', initLanguages);
function initLanguages(defLang){
	if(type(defLang) != 'String') defLang = $('html').getAttribute('lang') || navigator.language;
	defLang = defLang.toLowerCase();
	arr($$('[langs]')).foreach(function(e){
		var sectionScores = [];
		var langs = e.getAttribute('langs');
		if(langs == defLang) return;
		e.setAttribute('langs', defLang);
		arr(e.children).foreach(function(f){
			f.removeAttribute('display');
			var lang = f.getAttribute('lang').toLowerCase().split(' ');
			var score = 0;
			if(lang.contains(defLang)) score += 10;
			sectionScores.push(score);
		});
		e.children[sectionScores.indexOf(Math.max.apply(null, sectionScores))].setAttribute('display', '');
	});
	
	var gid = '#leorchn_langs';
	if($(gid)) return;
	document.head.appendChild(ct('style' + gid, '[langs] > *:not([display]) { display: none }'));
}
