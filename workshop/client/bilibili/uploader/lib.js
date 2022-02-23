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
var sec_head = `
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
`;
