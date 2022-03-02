function BilibiliCookie(cookie){
	if(this == self) return;
	var re = {
		id: /DedeUserID=(\d+)/,
		csrf: /bili_jct=([a-zA-Z0-9]+);/,
		expire: /SESSDATA=.*?%2[cC](\d+)/
	};
	Object.assign(this, {
		uid: re.id.exec(cookie)[1],
		csrf: re.csrf.exec(cookie)[1],
		expire: new Date(parseInt(re.expire.exec(cookie)[1]) * 1000),
		c: 'Cookie: ' + cookie
	});
}
function sign(url){
	var appkey = /\?.*?appkey=([0-9a-f]*)/.exec(url);
	var table = {
		'c1b107428d337928': 'ea85624dfcf12d7cc7b2b3a94fac1f2c',
		'1d8b6e7d45233436': '560c52ccd288fed045859ed18bffd973'
	};
	if(!(appkey && appkey[1] in table)) return url;
	var params = /\?(.*)/.exec(url)[1].split('&').sort().join('&') + table[appkey[1]];
	return url + '&sign=' + md5(params);
}
var sec_head = `
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
`;
