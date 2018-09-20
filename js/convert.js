function cn2xml(c){ // cn2xml('中文转换') => "&#20013;&#25991;&#36716;&#25442;"
	c=escape(c);
	var r=/%u([A-F0-9]{4})/g,
	s,f='';
	while(s=r.exec(c)){
		f+='&#'+parseInt(s[1],16)+';'
	}
	return f;
}
