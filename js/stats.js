(function(){
	if(/(127\.\d{1,3}|192\.168)\.\d{1,3}\.\d{1,3}/.test(location.hostname)) return; // debug environment
	var gaid = 'UA-174341933-1';
	var ga = document.createElement('script');
	ga.async = 'async';
	ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaid;
	document.head.appendChild(ga);
	
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', gaid);
	
	setInterval(function(){
		gtag('event', 'user_engagement', {
			engagement_time_msec: window.performance? window.performance.now(): 1,
			send_to: gaid
		});
	}, 30000);
})();
// dev guide:	https://developers.google.cn/analytics/devguides/collection/gtagjs/pages?hl=zh-cn#page_view_event
// event guide:	https://support.google.com/analytics/answer/9234069?hl=zh-Hans
// view data:	https://analytics.google.com/analytics/web/
