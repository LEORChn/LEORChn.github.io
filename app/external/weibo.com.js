/*
	adapting: Weibo 2020
	compatbility: Chrome 43 / Firefox 86
	update: 2020-10-2 / 2021-3-25
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

// 兼容性：FF 86
// 在资料页面简介部分加上永久u链（2021当时所用的新版UI下有效）
setInterval(function(){
	if($('#leorchn_weibo_user_permalink')) return;
	var injectHost = $('[class*=ProfileHeader_con3]');
	var injectRequired = $('[owner_uid]');
	if(injectHost && injectRequired); else return;
	var uid = injectRequired.getAttribute('owner_uid');
	var a = document.createElement('a');
	a.id = 'leorchn_weibo_user_permalink';
	a.innerText = '用户永久链接';
	a.href = '/u/' + uid;
	a.style.marginLeft = '2em'
	injectHost.appendChild(a);
	// 相册专辑
	a = document.createElement('a');
	a.innerText = '相册专辑';
	a.href = 'https://photo.weibo.com/' + uid + '/albums';
	a.style.marginLeft = '1em'
	injectHost.appendChild(a);
	// 头像大图
	a = document.createElement('a');
	a.innerText = '头像大图';
	a.href = 'https://ww1.sinaimg.cn/large/' + /([^\/\?]+)(\?|$)/.exec($('[class*=ProfileHeader_avatar] img').src)[1];
	a.target = '_blank';
	a.style.marginLeft = '1em'
	injectHost.appendChild(a);
	function $(e){
		return document.querySelector(e);
	}
}, 1500);

// 兼容性：2015后任意版本谷浏/火狐
// 在旧版个人资料页面免登录进入查看该人更多信息
setInterval(function(){
	var more_info_btn = $('.PCD_person_info .WB_cardmore');
	if(!more_info_btn) return;
	if(!more_info_btn.hasAttribute('action-type')) return;
	more_info_btn.href = location.pathname + '/info?mod=pedit_more';
	more_info_btn.removeAttribute('action-type');
	more_info_btn.innerText = '查看更多 >';
	function $(e){
		return document.querySelector(e);
	}
}, 1500);
