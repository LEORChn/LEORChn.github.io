/*
public static XmlObject newXML(String fullText);
class XmlObject{
	public XmlObject[] get(String name);
	public String attr(String name);
	public String name();
	public String text();
	public void finish();
	public void release();
}
*/
function newXML(x){
	var p=document.createElement('div');
	p.display='none';
	document.lastChild.lastChild.appendChild(p);
	p.innerHTML=x;
	return packup(p);
}
function packup(p){
	p.finish=p.release=p.remove;
	p.name=p.localName;
	p.text=function(){
		return this.innerHTML.toString().replace('<!--[CDATA[','').replace(']]-->','');
	}
	p.get=function(name){
		if(name) name=name.toUpperCase();
		var m=[],n=this.childNodes;
		for(var i=0,d=0,len=n.length;i<len;i++)
			if(name==undefined || name==null || n[i].tagName==name){
				if(n[i].localName==null) continue;
				m[d]=packup(n[i]);
				d++;
			}
		if(m.length>0) return m;
	}
	p.attr=function(name){
		if(name){
			name=name.toLowerCase();
			for(var i=0,len=this.attributes.length;i<len;i++){
				var a=this.attributes[i];
				if(name==a.name) return a.value;
			}
		}else{
			pl('想获得'+this.name+'的属性，请传入属性名，不能传入空参数。')
		}
	}
	return p;
}