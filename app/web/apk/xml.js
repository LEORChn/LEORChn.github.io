
function XML(s){
	var getter = function(s){
		var storage = null;
		this.children.foreach(function(e){
			if(s == e.name){
				return storage = e;
			}
		});
		return storage;
	},
	traver = function(d){
		var x = {};
		x.name = d.nodeName.toLowerCase();
		x.attr = {};
		x.children = [];
		x.get = getter;
		x.text = d.innerText;
		if(d.nodeType == 1){
			arr(d.attributes).foreach(function(e){
				x.attr[e.name] = e.nodeValue;
			});
		}
		arr(d.children).foreach(function(e){
			x.children.push(traver(e));
		});
		return x;
	};
	var xml = traver(new DOMParser().parseFromString(s,'text/xml'));
	
	return xml;
}
