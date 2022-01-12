var header = {
	version: {
		client: '4.12.0',
		data: 6423
	},
	get UA(){
		return `HousamoAPI/${header.version.client} Android OS 8.1.0 / API-27 (OPM1.171019.011/eng.compil.20191024.185109) vivo vivo X20A`
		// Android OS 6.0.1 / API-23 (V417IR/eng.luoweiqiao.20201016.150344)
	},
	get GET(){
		return `
			X-Unity-Version: 2018.4.7f1
		    CDNDataVersion:  ${header.version.data}
		    User-Agent:      ${header.UA}
		    Host:            elb.housamo.jp
		    Accept-Encoding: gzip
		    Content-Type:    application/x-www-form-urlencoded
		    Connection:      Keep-Alive
		    GCA:             X
		    Response-Crypt:  enable
		`
	},
	get POST(){
		return `
			Expect: 100-continue
			${header.GET}
		`
	},
	update: function(){
		http(`get ${api.elb}/gateway/list`, header.GET, function(){
			var h = this.responseHeaders,
				tmp = header.version;
			header.version = {
				client: /ClientVersion.*?([\d\.]+)/.exec(h)[1],
				data: /CDNDataVersion.*?([\d]+)/.exec(h)[1]
			};
			console.info('Trainer emulation updated' + Object.keys(tmp).filter(function(e){
				return tmp[e] != header.version[e]
			}).map(function(e){
				return `\n%c${e}: %c${tmp[e]} >> ${header.version[e]}`
			}).join(''), 'color:initial', 'color:red', 'color:initial', 'color: red');
			
		});
	}
}, api = {
	放samo: atob('LmhvdXNhbW8u'), // @hide to foreigner
	get elb(){
		return `http://elb${api.放samo}jp`
	}
};
