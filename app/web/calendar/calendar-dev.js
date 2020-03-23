var dev = {
	convertor: function(){
		mui.tabs.activate(calendar_tab_salt + '2');
	},
	copy: function(){
		fv('source').select();
		var succ;
		try{
			succ = document.execCommand('copy');
		}catch(e){}
		if(!succ) alert('无法一键复制，请手动复制。');
	}
};