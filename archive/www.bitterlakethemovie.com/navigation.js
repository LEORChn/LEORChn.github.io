function addLeftBottomNavigationBar(){
	var d=ct('div'),
	s=d.style,
	p;
	s.position='fixed';
	s.left=s.bottom=0;
	s.zIndex=9999;
	var tags='span,a,span'.split(','),
		text='当前位置 ,瑞兽谷, > Bitter Lake 镜像站'.split(','),
		location=',/'.split(',');
	for(var i=0;i<3;i++){
		p=ct(tags[i], text[i]);
		if(tags[i]=='a'){
			p.style.color='#fff';
			p.href=location[i];
		}
		d.appendChild(p);
	}
	htmlbody.appendChild(d);
}
addLeftBottomNavigationBar();