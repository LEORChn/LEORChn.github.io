
function process_manifest(x){
	var img_icon = $('#icon'),
		appname = $('#appname'),
		appvername = $('#appvername'),
		appvercode = $('#appvercode'),
		packagename = $('#packagename');
	var xml = XML(x);
	var manifest = xml.get('manifest');
	pl(manifest);
	var	application = manifest.get('application');
	pl(application);
		
	appvername.innerText = manifest.attr['android:versionName'];
	appvercode.innerText = manifest.attr['android:versionCode'];
	packagename.innerText = manifest.attr['package'];
	appname.innerText = application.attr['android:label'];
	while(img_icon.parentNode.children.length>1) img_icon.parentNode.children[1].remove();
	img_icon.parentNode.appendChild(ct('span', application.attr['android:icon']))
}