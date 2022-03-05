
addEventListener('load', function(){
	$$('.tabview').foreach(function(e){
		var tabname = 'tabs_' + (Date.now() + Math.random());
			divs = e.$$('.list ~ div'),
			chked = e.$$('.list > label[checked]');
		e.$$('.list > label').foreach(function(label, i){
			if(divs.length <= i) return console.warn('7.js 错误：标签页标签数量比实际页面多'); // panel is not enough? check out your HTML code!
			var id = Date.now() + Math.random(); // 给每个标签设置不同的ID
			label.setAttr('for', id);
			// 在每个面板前插入 radio input
			e.insertBefore(ct('input').setAttr('type', 'radio').setAttr('name', tabname).setAttr('id', id), divs[i]);
			label.onclick = ontabchange; // 给每个标签组件添加点击事件
			if(!i) label.click(); // 默认操作：打开第一个面板
		});
		if(chked.length) chked[chked.length - 1].click(); // 实现 checked 属性的默认功能
		e.$('.list').setAttr('javascript'); // 最后一步：告诉CSS当前浏览器已启用JS
		function ontabchange(){
			this.parentNode.$$('[active]').foreach(function(e){
				e.removeAttribute('active'); // 给所有标签设为默认样式
			});
			this.setAttr('active'); // 给当前标签设为正在显示样式
		}
	});
});
