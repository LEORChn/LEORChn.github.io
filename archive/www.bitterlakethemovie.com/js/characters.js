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

//以下内容为修改新增，以上的修改仅仅是把 origHighlight 公开化
var nameindex=0;
function set(index){
	var namelist=['winters','dale','arden','drraer'];
	var idtag=document.getElementsByClassName('char '+namelist[nameindex])[0];
	idtag.className='char '+namelist[index];
	var chardetails=document.getElementsByClassName('chardetail');
	for(var i=0;i<chardetails.length;i++) chardetails[i].style.display='none';
	chardetails[index].style.display='';
	
	var sideimagelist=['winters','quill','quill','quill'];
	document.getElementById('content-left').getElementsByTagName('img')[0].style.background='url(images/side-'+sideimagelist[index]+'.jpg)';
	origHighlight='hl-'+namelist[index];
	nameindex=index;
}