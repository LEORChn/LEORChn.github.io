/*
	adapting: Weibo 2020
	compatbility: Chrome 43
	update: 2020-10-2
*/

setInterval(function(){
	var autoNext = $('[class*="VideoList_box_"] label>[role=switch]');
	var autoNext_checked = $('[class*="VideoList_box_"] label>.woo-switch-checked[role=switch]');
	if(autoNext_checked){
		autoNext.click();
	}else if(!autoNext){ // 界面中没有 “自动播放” 按钮
		return;
	}
	/*	
		如果运行到此处，说明界面中有 “自动播放” 开关。
		由于tab在切换后，Vue会删去组件，所以目前状况应该是：
			tab未切换，并且至少tab组件是可以找到的
	*/
	try{
		var commentsTab = $('.woo-box-flex[class*="Index_content_box_"] .woo-tab-item-main>*');
		commentsTab.click();
	}catch(e){ // 界面中应该有tab组件，但尝试点击时出错，可能界面排版在此脚本更新之后有改动
		console.error('无法从相关视频tab切换到评论tab，请联系作者');
	}
	function $(e){
		return document.querySelector(e);
	}
}, 2500);
