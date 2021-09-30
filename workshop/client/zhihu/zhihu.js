
var presets = [
	'U2FsdGVkX19Vs5nBko+PqEwVs4XfezhsChP6qQ8vsrlmMPe/yIG1SC1DO0O6V1FQgEeoGOhCfoQEjmTF88+M0Ndu2e9fe8iXpkQHoVZkwA9J4bCwu2VqfdXQYBTUmNgdiSr+GemmRJRMNCB6Bur/8u807BbIpMAU/gbZugPH0PYxbBotUQcSZM9z0PPIrCmjCP6KJmLuJXu6kHCAaA2vI9ZTn636otsUHeGaCKkVfpymvCaRXicq+JcerduGyws59Q5r6OgWuKRkfSlcPSk7+5ZvN1P3MhPuISG2KS+L764='
];
function getHeaders(){
	var pre = top._GET('preset'), uid;
	if(pre){
		presets.foreach(function(e){
			try{
				return uid = top.GibberishAES.dec(e, pre);
			}catch(e){pl(e);}
		});
	}
	return [
		uid || '',
		'User-Agent: ZhihuHybrid DefaultBrowser com.zhihu.android/Futureve/6.25.0 Mozilla/5.0 (Linux; Build/OPM1.171019.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/62.0.3202.84 Mobile Safari/537.36',
		'x-app-version: 6.25.0',
		'x-app-za: OS=Android&Release=2.2.2&Model=ZTE&VersionName=6.25.0&VersionCode=1802&Product=com.zhihu.android&Width=240&Height=320&Installer=%E4%BF%8A%E6%B8%B8-cpa30&DeviceType=AndroidPhone&Brand=ZTE&OperatorType=46011'
	].join('\n');
}
