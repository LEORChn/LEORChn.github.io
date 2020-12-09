(function(){
	var compressed_style = null; // null=请求中；空字符串=失败
	http('get tencent-chat-data-compressed.min.css', function(e){
		compressed_style = this.responseText;
	});
	var decrypt = function(file){
		if(type(file) != 'File'){
			return new Promise(function(s, fail){
				fail('TencentChatData.decrypt required a File type but got: ' + type(file));
			});
		}
		var t = new TextStream(file),
		obj = {
			constructor:{
				name: 'TencentChatData'
			},
			html: '',
			meta: '',
			member: {
				host: [],
				other: [],
				reg: {}
			},
			msg: []
		};
		return new Promise(function(success, fail){
			var phase = 0,
			line = 1,
			dat = {
				boundary: null, // boundary 的实际值为在所得的值之前加上两个连字符；而如果在实际值之后再加两个连字符，则表示上一个块是本 MHT 文件的最后一个块
				html: ''
			};
			var htmlloader;
			var process = function(){
				t.readline().then(function(e){
					if(e == null){
						success(new TencentChatData(obj));
						return;
					}
					line++;
					if(dat.boundary != null && e.startsWith(dat.boundary)){
						phase++;
					}else{
						switch(phase){
							case 0: // manifest
								if(line > 30){
									fail('Manifest 信息过长。');
									return;
								}
								var b = /(;?\s*)boundary=[\"\'](.*)[\"\']/.exec(e);
								if(b == null) break;
								dat.boundary = '--' + b[2];
								break;
							case 1: // manifest of main html
								if(e == '') phase++;
								break;
							case 2: // read main html text
								dat.html += e;
								break;
							case 3: // load the html data to iframe
								htmlloader();
								return;
						}
					}
					process();
				}).catch(function(e){
					fail(e);
				});
			};
			process();
			htmlloader = function(){
				var table = /<table.*<\/table>/g.exec(dat.html);
				var div = ct('div.cdata');
				var te = ct('table');
				div.appendChild(te);
				te.outerHTML = table;
				obj.html = dat.html;
				// htmlbody.appendChild(div);
				
				var chatgroup,
					chatname,
					startdate = null;
				arr(div.querySelectorAll('tr>td')).foreach(function(e){
					if(e.children.length == 1){ // td内有1个的是非标准消息，2个的是标准消息
						'消息分组,消息对象'.split(',').foreach(function(f, i){
							if(!e.innerText.startsWith(f)) return;
							[function(){ // 执行：写入消息来源分组名
								chatgroup = e.innerText;
							},
							function(){ // 执行：写入消息来源名称
								chatname = e.innerText;
							}][i]();
							return true;
						});
						return;
					}
					if(e.children.length == 0){
						if(e.innerText.startsWith('日期')) // 执行：写入消息日期缓存
							startdate = /\d+-\d+-\d+/.exec(e.innerText)[0];
						return;
					}
					
					var msg_header = e.children[0].childNodes,
						header_nick = getText(msg_header[0]).replace(/&get;/g, '>'),
						header_time = getText(msg_header[1]);
					// 不知道为啥我用的 QQ 8.6 (18804) 很沙雕，导出 MHT 聊天记录会把大于号的转义 &gt; 打成 &get;
					function getText(e){
						switch(e.nodeType){
							case 1: // Element
								return e.innerText;
							case 3: // Text Node
								return e.textContent;
						}
					}
					
					// 正则：匹配消息头
					// v1.0.0        /(.*)[<\(](.*)[>\)]\s*(\d+:\d+:\d+)/  【开发】基础功能
					// v1.0.1        /(.*)[<\(](.*)[>\)]((.)午)?\s*(\d+)(:\d+:\d+)/
					//                                  ^^^^^^^^       ^^  【增加规则】用于修复12小时制显示的时间无法转换的问题
					var regex_nick = /(.*?)([<\(](.*)[>\)])?$/.exec(header_nick)
					// v1.0.2            ^ ^              ^^^  【增加规则】用于兼容新版QQ导出消息不显示帐号的情况
						regex_time = /((.)午)?\s*(\d+)(:\d+:\d+)/.exec(header_time);
					
					if(!(regex_nick && regex_time)){
						pl('发言人名称或时间匹配失败：\nnick: ' + header_nick + '\ntime: ' + header_time + '\nheader: ' + e.children[0].innerText);
						return;
					}
					var nickname = regex_nick[1],
						qq = regex_nick[3],
						primaryKey = qq || regex_nick[0], // 优先使用QQ号或邮箱，如果没有则用整个昵称
						am = regex_time[2], // 记录12小时制 AM/PM 关键字
						ts = ampmCalc(parseInt(regex_time[3])) + regex_time[4];
					pl('qq ' + qq + '\nprimaryKey ' + primaryKey);
					pl(regex_nick);
					function ampmCalc(h){
						if(!regex_time[1]) return h; // 判断12小时制关键字是否存在
						return h == 12?
							am == '上'?
								h - 12: // 上午12点 = 0点
								h:
							am == '下'?
								h + 12: // 下午1点 = 13点
								h;      // 下午12点 = 12点
					}
					
					var qid; // 本条消息的发送者在成员名单中的 index，如果为 0 则是本人。如果大于 0 则不是本人
					if(e.children[0].getAttribute('style').contains('#42B475')){ // 这条消息是绿色，自己发的
						if(obj.member.host.length == 0){
							obj.member.host = [qq, nickname];
						}
						qid = 0;
					}else{ // 这条消息是蓝色，别人发的
						if(!('count' in window)) window.count = 0;
						window.count ++;
						if(window.count < 100){
							if(nickname.endsWith('1')) pl(qt);
						}
						if(!(primaryKey in obj.member.reg)){
							obj.member.other.push([qq, nickname]);
							obj.member.reg[primaryKey] = obj.member.other.length;
						}
						qid = obj.member.reg[primaryKey];
					}
					
					// 写入消息体
					// TODO: 消息体中可能也会出现上面提到的那个关于 > 应该转义成 &gt; 而不是 &get; 的 bug
					var msgblock = [];
					var msglooper = function(e){
						if(e.childNodes.length > 0){
							arr(e.childNodes).foreach(function(e){
								msglooper(e);
							});
						}else{
							switch(e.nodeName){
								case 'BR':
									msgblock.push({
										type: 'br'
									});
									break;
								case 'IMG':
									msgblock.push({
										type: 'image',
										url: e.getAttribute('src')
									});
									break;
								default:
									if(e.nodeType != 3){ // 可能无法处理的内容警告
										console.warn('unknown element appeared:');
										pl(e);
									}
									msgblock.push(e.nodeType == 3?
										e.nodeValue: // TextNode
										e.innerText); // unknown element
							}
						}
					};
					if(e.children[1].childNodes.length > 0){
						msglooper(e.children[1]); // 支持的消息
					}else{
						msgblock.push({
							type: 'unsupported'
						});
					}
					obj.msg.push([
						qid,
						new Date(startdate + ' ' + ts).getTime(),
						msgblock
					]);
				});
				obj.meta = chatgroup + '\n' + chatname;
				success(new TencentChatData(obj));
			};
		});
	};
	window.TencentChatData = function(arg){
		if(type(arg) != 'TencentChatData'){
			return TencentChatData.decrypt(arg);
		}else{
			this.parsedObject = arg;
			this.compress = function(){
				pl(arg); // 调试的时候把这个注释取消
				var block_head_start = [
					'<!doctype html><html><head>',
					'<meta http-equiv="Content-Type" content="text/html; charset=utf8">',
					
					'<title>QQ Message</title>',
					'<script>function f(f){Array.prototype.slice.call(document.querySelectorAll("input[type=checkbox]")).forEach(f)}</script><style>',
					compressed_style
				],
				block_body_start = '</style></head><body>',
				block_end = '</body></html>';
				var mem = arg.member;
				var get_mem = function(i){
					if(i == 0) i = mem.host;
					else i = mem.other[i - 1];
					if(!i[0]) return i[1]; // 没有QQ号或者邮箱号，因此不输出圆括号或方括号
					var quot = (/^\d+$/.test(i[0])? '(,)': '<,>').split(','); // 如果是数字帐号则用圆括号()，邮箱帐号则用方括号<>
					return i[1] + quot[0] + i[0] + quot[1];
				};
				
				// 输出发言人列表
				var stemp = "[q={0}]:before{content:'{1} ' attr(t)}",
					member_style = stemp.format('a', get_mem(0));
				mem.other.foreach(function(e, i){
					member_style += stemp.format(toString26(i+1), get_mem(i+1));
				});
				
				// 输出消息列表
				var temp_msg = '<p q="{0}" t="{1}">{2}</p>',
					temp_day = '<div date title="{0}"><input type="checkbox" id="{0}"><label for="{0}"></label>{1}</div>',
					msgs_day = '',
					msgs_total = '<pre head>' + arg.meta + '<span style="position:fixed;top:8px;right:8px;z-index:1"><input type="button" value="全部展开" onclick="f(function(e){e.checked=false})"><input type="button" value="全部收起" onclick="f(function(e){e.checked=true})"></span></pre>',
					msg_date = new Date(arg.msg[0][1]).format('yyyy-MM-dd');
				var HTML_ENCODER = ct('div');
				
				arg.msg.foreach(function(e){
					var qid = e[0],
						date = new Date(e[1]),
						day = date.format('yyyy-MM-dd'),
						content = '';
					e[2].foreach(function(e){
						if((typeof e) == 'string'){
							HTML_ENCODER.innerText = e;
							content += HTML_ENCODER.innerHTML;
						}else switch(e.type){
							case 'br':
								content += '<br>';
								break;
							case 'image':
								content += '<img src="' + e.url + '">';
								break;
							case 'unsupported':
								content += '[ QQ似乎未成功导出该条消息，请确认QQ版本是否支持 ]';
								break;
							default:
								console.warn('Might add new parse format but TencentChatData.compress() did not add this for compress: ' + e.type);
						}
					});
					if(msg_date != day){
						msgs_total += temp_day.format(msg_date, msgs_day);
						msgs_day = '';
						msg_date = day;
					}
					msgs_day += temp_msg.format(toString26(qid), date.format('h:mm:ss'), content) + '\n';
				});
				msgs_total += temp_day.format(msg_date, msgs_day);
				
				var blocks_head = '';
				block_head_start.foreach(function(e){
					blocks_head += e;
				});
				
				return blocks_head + member_style + block_body_start + msgs_total + block_end;
			}
		}
	};
	window.TencentChatData.decrypt = decrypt;
})();

function toString26(num){
	num++;
	var str = '';
	while (num > 0){
		var m = num % 26;
		if (m == 0){
			m = 26;
		}
		str = String.fromCharCode(m + 64) + str;
		num = (num - m) / 26;
	}
	return str.toLowerCase();
}
