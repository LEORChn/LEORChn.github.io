var origHighlight;
window.addEvent('domready', function() {
	var charElems = $$('#character-list a');
	origHighlight = charElems[0].className;
	charElems.addEvent('mouseenter', function(e) {
		for (var i = 0; i < charElems.length; i++) {
			for (var j = 0; j < charElems.length; j++) {
				charElems[i].removeClass('hl-'+charElems[j].id);
			}
				charElems[i].addClass('hl-'+e.target.id);
		}
	});
	$('character-list').addEvent('mouseleave', function() {
		for (var i = 0; i < charElems.length; i++) {
			for (var j = 0; j < charElems.length; j++) {
				charElems[i].removeClass('hl-'+charElems[j].id);
			}
				charElems[i].addClass(origHighlight);
		}
	});
});

//本文件的修改仅仅是把 origHighlight 公开化
