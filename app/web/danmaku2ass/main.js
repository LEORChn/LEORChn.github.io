function main(){
	'use strict';
	var div = $('.storm-container');
	while(div.children.length) div.children[0].remove(); // 重新装填弹幕池，需要清空之前显示的节奏风暴内容
	var ls = $('#ls'),
		root = '',
		flv_pool = {
			queue: [],
			done: []
		},
		danmaku_pool = {
			file: {
				queue: [],
				done: []
			},
			shipmember: {},
			manager: {
				'布哥-BOOG':   1, // https://space.bilibili.com/7243615
				'五行缺壹':    1, // ┌ https://space.bilibili.com/4204049
				'洛炀零号C型': 1, // └ https://space.bilibili.com/4204049 2020-05-21
				'毛基阿灰':    1, // ┌ https://space.bilibili.com/5847584
				'灰之燿':      1, // └ https://space.bilibili.com/5847584 2020-05-21
				'werewolf33':  1, // https://space.bilibili.com/5118576
				'言夕菌':      1, // https://space.bilibili.com/4108737
				'飒冬皓':      1, // https://space.bilibili.com/7773151
				'杏仁狮子':    1  // https://space.bilibili.com/634320
			},
			vip: {},
			special: ['疯狂小瑞瑞'],
			dmk: [],
			color: {
				special:    0x00ff7e,
				manager:    0xffce6b,
				shipmember: 0xfcff00, // 0xdb9db3,
				vip:        0x00c6ff,
				default:    0xffffff
			},
			storm: []
		};
	/*
		baseColor 与 最终颜色RGB | 实际写入文件 (BGR)
		0     = 普通用户 #ffffff   ffffff
		1    |= 老爷     #ffc600   00c6ff
		2    |= 船员     #b39ddb   db9db3
		4    |= 房管     #6bceff   ffce6b
		1024 |= 特殊绿色 #7eff00   00ff7e
	*/
	
	// ===== 文件选择器判断 ===== //
	
	if(f.length > 0){ // 判断基础目录以确保当前还是在选择文件夹的模式
		var relPath = f[0].webkitRelativePath,
			slash = relPath.indexOf('/');
		if(slash != -1) root = relPath.left(slash + 1);
	}else{
		pl('已取消选择');
		return; // 没选择文件，罢工
	}
	while(ls.tBodies[0].children.length) ls.tBodies[0].children[0].remove();
	while(ls.tFoot.children.length) ls.tFoot.children[0].remove();
	if(root == ''){ // 非选择文件夹模式，罢工
		ls.appendChild(ct('li', '当前选择模式不是文件夹。'+new Date()));
		return;
	}
	
	
	// ===== 静态格式化资源 ===== //
	
	var	datfmt = 'yyyy-MM-dd HH:mm:ss';
	var fnameTimeReg = {
		txt: {
			re: /(\d{2})-?(\d{2})-?(\d{2})\.txt\|(\d+):(\d+):(\d+)/,
			fmt: '20{1}-{2}-{3} {4}:{5}:{6}'
		},
		txt_verify: {
			re: /(\d{2})-?(\d{2})-?(\d{2})\.txt$/
		},
		flv: {
			re: /(record-)?\d+-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})-/,
			fmt: '{2}-{3}-{4} {5}:{6}:{7}'
		},
		standard: {
			re: /(.*)/,
			fmt: '{0}'
		}
	},
	fnameTimeParser = function(p, e, v){ // 文件名转到时间戳。p=fnameTimeReg对象，e=所操作的表格UI，v=文件名
		if(p.re.test(v)){
				var res = p.re.exec(v),
					dat_parse = p.fmt.format(res),
					tmpdat = new Date(dat_parse);
				e.setAttribute('value', tmpdat.getTime());
				e.innerText = tmpdat.format(datfmt);
		}
	};
	
	
	// ===== 循环文件池 ===== //
	
	arr(f).foreach(function(e){
		var fpath = e.webkitRelativePath;
		if(!fpath.startsWith(root)) return; // 非文件夹选择（有可能吗？）
		var fname = fpath.right(fpath.length - root.length); // 文本裁剪：剪去根路径，留下短文件名
		if(fname.includes('/')) return; // 位于二级目录，退出
		
		var appendTo,
			tr = ct('tr'),
			td_fname = ct('td', fname), // filename
			td_start = ct('td'), // start
			td_end   = ct('td'), // end
			td_dur   = ct('td'), // duration
			td_open  = ct('td'), // 复选框，如果勾上表示这是新开播，将会清除此时间前30分钟的所有内容
			td_ass   = ct('td'), // ass
			td_preview = ct('td'); // preview
			
		switch(fname.right(4).toLowerCase()){
			case '.txt':
				danmaku_pool.file.queue.push({
					mainobj: e,
					td_start: td_start,
					td_end: td_end
				});
				appendTo = ls.tFoot;
				
				/*
					文件列表同步 与 文件异步读取 之间的问题：
					为了解决这个问题，
					先将所有弹幕文件加入文件池，待所有文件全部确定后，再进行异步读取。
					读取过后按照时间戳进行排序
				*/
				
				break;
			case '.flv': // 仅接受 flv 和 txt（以后可能新增）
				appendTo = ls.tBodies[0];
				
				// 计算FLV文件起始时间
				fnameTimeParser(fnameTimeReg.flv, td_start, fname);
				
				flv_pool.queue.push({
					mainobj: e,
					tr: tr
				});
				
				// 下载ASS - todo
				var downass = ct('input');
				downass.type = 'button';
				downass.value = '下载';
				downass.onclick = function(){
					var str = strEncodeUTF16(Json2Ass(danmaku_pool, tr));//new Uint8Array(utf16lebytes(Json2Ass(danmaku_pool, tr)));
					//pl(str);return;
					var blob = new Blob([str], {
						type: 'binary'
					});
					var a = ct('a');
					a.href = URL.createObjectURL(blob);
					a.download = fname.replace(/\.([Ff]lv|FLV)$/, '.ass');
					a.click();
				};
				td_ass.appendChild(downass);
				
				// 预览视频 - todo
				var preview = ct('input');
				preview.type = 'button';
				preview.value = '预览视频';
				td_preview.appendChild(preview);
				break;
			default:
				return;
		}
		
		tr.appendChildren(
			td_fname, td_start, td_end, td_dur, td_open, td_ass, td_preview
		);
		appendTo.appendChild(tr);
		
		arr(tr.children).foreach(function(e, i){
			e.setAttribute('rule', ls.tHead.rows[0].children[i].getAttribute('rule'));
		});
	});
	
	// ===== 
	
	flv_pool.queue.foreach(function(e){
		var td_start = e.tr.querySelector('[rule=start]'),
			td_dur     = e.tr.querySelector('[rule=duration]'),
			td_end     = e.tr.querySelector('[rule=end]'),
			td_clean   = e.tr.querySelector('[rule=clean]');
		
		var startdat = new Date(parseInt(td_start.getAttribute('value')));
		
		// 计算FLV时长
		flvDuration(e.mainobj, function(dur){
			var durdate = new Date(startdat.getTimezoneOffset() * 60000 + dur),
				fmt = dur < 3600000?
					'H:m:ss.SSS':
					'H:mm:ss.SSS';
			td_dur.innerText = durdate.format(fmt);
			
			// 计算断流时间
			var enddat = new Date(startdat.getTime() + dur);
			fnameTimeParser(fnameTimeReg.standard, td_end, enddat.format(datfmt));
			
			// 判断是否是重新开播
			var openbox = ct('input');
			openbox.type = 'checkbox';
			td_clean.appendChild(openbox);
			
			flv_pool.done.push(e);
			
			if(flv_pool.queue.length > flv_pool.done.length) return;
			
			/*
				当所有flv文件信息全部读取完毕后，执行：
				
				轮询FLV池，判断当前FLV的开始时间与上一个FLV的结束时间差
				如果大于30分钟 或者 当前为第一个FLV，设置复选框勾上
				如果小于0，设置复选框所在单元格背景色略红 rgba(255,0,0,.5)
			*/
			
			flv_pool.queue.foreach(function(e, i){
				var checkbox = e.tr.querySelector('[rule=clean]>input'),
					checkbox_td = e.tr.querySelector('[rule=clean]');
				var chk = function(special){
					if(!special)
						checkbox.setAttribute('checked', 'checked');
					else
						checkbox_td.style.background = 'rgba(255,0,0,.5)';
				};
				if(i == 0) 	return chk(); // 第一个，直接执行操作+短路
				
				var td_end = flv_pool.queue[i-1].tr.querySelector('[rule=end]'),
					td_start = e.tr.querySelector('[rule=start]'),
					diff = td_start.getAttribute('value') - td_end.getAttribute('value');
				if(diff > (30 * 60 * 1000))
					chk(); // 超过30分钟，执行勾选
				else if(diff < 0){
					chk(1); // 当前直播流开始时间早于上一段直播流结束时间，标异常
				}
			});
		});
	});
	
	
	// ===== 计算单个弹幕文件起始、结束位置，并将所有内容加入弹幕池 ===== //
	
	danmaku_pool.file.queue.foreach(function(e){
		var fname = e.mainobj.name;
		if(!fnameTimeReg.txt_verify.re.test(fname)){ // txt文件名格式校验失败
			e.td_start.innerText = '弹幕文件未解析';
			e.td_end.innerText = '文件名格式不支持。';
			danmaku_pool.file.done.push(e); // 标记该文件已完成（未成功解析）
			return;
		}
		
		var _this = e;
		e.mainobj.readAsText(function(t){
			var availble_line = /(\d+:\d{2}:\d{2})\s:\s(.{4}):/,
					availble_first,
					availble_last,
					welcome_shipmember = /歡迎.{2}:\s*(.*?)進入直播間/,
					dmk_detail = /收到彈幕:(.*?)\s*說:\s(.*)/;
			
			// ===== 文件行读取模式 开始 ===== //
			t.split(/\n/).foreach(function(ln){
				var ec = availble_line.exec(ln);
				if(ec){
					if(!availble_first) availble_first = ec; // 获得起始位置（当日第一行为）
					availble_last = ec; // 获得结束位置（当日最后行为）
					switch(ec[2]){ // regexp: availble_line
						case '歡迎艦長':
						case '歡迎提督':
						case '歡迎總督': // todo: “总督”可能不符
							ec = welcome_shipmember.exec(ln);
							danmaku_pool.shipmember[ec[1]] = 1;
							break;
						case '收到彈幕':
							var time_in_day = ec[1],
							 parsed_dmk_ts = fnameTimeReg.txt.fmt.format(
								fnameTimeReg.txt.re.exec(
									'{0}|{1}'.format(fname, time_in_day)
								)
							 ),
							 ts = new Date(parsed_dmk_ts).getTime();
							ec = dmk_detail.exec(ln);
							var identity_nickname = /(\[管\])*(\[爺\])*(.*)/.exec(ec[1]);
							var dmk_obj = {
								ts: ts,                     // 时间戳
								ts_parsed: parsed_dmk_ts,   // 控制台查看用 - 已解析的时间
								nick: identity_nickname[3], // 发言人用户昵称
								baseColor: 0,               // 基础文字颜色
								content: ec[2]              // 弹幕内容
							};
							if(identity_nickname[1]){     // 测试是否是房管
									danmaku_pool.manager[dmk_obj.nick] = 1;
									dmk_obj.baseColor |= 4;
							}
							if(identity_nickname[2]){     // 测试是否是老爷
									danmaku_pool.vip[dmk_obj.nick] = 1;
									dmk_obj.baseColor |= 1;
							}
							
							danmaku_pool.dmk.push(dmk_obj);
					}
				}
			});
			// ===== 文件行读取模式 结束 ===== //
			
			if(availble_first) // 呈现开始位置（当日第一行为）
				fnameTimeParser(fnameTimeReg.txt, _this.td_start, '{0}|{1}'.format(fname, availble_first[1]));
			if(availble_last) // 呈现结束位置（当日最后行为）
				fnameTimeParser(fnameTimeReg.txt, _this.td_end, '{0}|{1}'.format(fname, availble_last[1]));
				
			danmaku_pool.file.done.push(_this); // 当前文件已读取完成，推到已完成列表
			if(danmaku_pool.file.queue.length > danmaku_pool.file.done.length) return;
			
			// ===== 所有弹幕文件都读取完毕，现在整理中间弹幕资源 ===== //
				/* 读完所有 TXT 之后
					- 合并 danmaku_pool 中的 shipmember, manager 和 vip 为数组
					- 按时间戳排序所有弹幕
					- 轮询每条弹幕，以测试是否是其他特殊身份的人
					- 轮询每条弹幕，以确定最终的弹幕颜色
					- 确定节奏风暴类弹幕的内容
				*/
			
			// ===== 合并名单到数组 ===== //
			var obj2arr = function(objs){
				var tmp = [];
				for(var obj in objs){
					tmp.push(obj);
				}
				return tmp;
			}
			danmaku_pool.shipmember = obj2arr(danmaku_pool.shipmember);
			danmaku_pool.manager    = obj2arr(danmaku_pool.manager);
			danmaku_pool.vip        = obj2arr(danmaku_pool.vip);
			
			// ===== 按时间戳排序弹幕 ===== //
			danmaku_pool.dmk.sort(function(a, b){ // 负数时A靠前，正数时B靠前。因此A-B=升序，B-A=降序
				return a.ts - b.ts +1;
			});
			
			/* ===== 轮询不短路操作类型集合函数 =====
			 * 
			 * 确定节奏风暴
			 * 确定弹幕颜色
			 */
			var tmp_displaying = [],
				tmp_storm = {}; // 用 OBJ 保存，这样不会出冗余，但是需要后期转换
			
			danmaku_pool.dmk.foreach(function(dmk,i){
				
				// ===== 确定节奏风暴类型的弹幕 ===== //
				while(tmp_displaying.length > 40) tmp_displaying.pop(); // 屏幕显示过多（已超过40个），删除最后一个
				tmp_displaying.unshift(dmk); // 把当前弹幕加到第一个
				var counter = {};
				tmp_displaying.foreach(function(e){ // 计数
					if(e.content in counter)
						counter[e.content]++;
					else
						counter[e.content] = 1;
				});
				for(var e in counter)
					if(counter[e] > 15 && e.length > 5)
						tmp_storm[e] = 1; // 保存的弹幕池中有40个弹幕。确定为节奏风暴需要保证其中至少有15个同内容弹幕，并且内容需要大于5个字，否则 88 拜拜 晚安 之类的也会算进去
				
				// ===== 确定最终的弹幕颜色 ===== //
				var color = danmaku_pool.color;
				if(danmaku_pool.special.indexOf(dmk.nick) >= 0){
					dmk.color = color.special;
					
				}else if(danmaku_pool.manager.indexOf(dmk.nick) >= 0){
					dmk.color = color.manager;
					
				}else if(danmaku_pool.shipmember.indexOf(dmk.nick) >= 0){
					dmk.color = color.shipmember;
					
				}else if((dmk.baseColor & 1) == 1){
					dmk.color = color.vip;
					
				}else{
					dmk.color = color.default;
				}
			});
			
			// ===== 轮询不短路：擦屁股 ===== //
			tmp_displaying = null;
			for(var e in tmp_storm){
				danmaku_pool.storm.push(e);
			}
			tmp_storm = null;
			
			
			// ===== 操作已经全部完成 ===== //
			pl('弹幕池对象样例：');
			pl(danmaku_pool);
			
			// ===== 在右下角显示节奏风暴 ===== //
			var div = $('.storm-container'),
				table = ct('table'),
				thead = ct('thead'),
				tr = ct('tr'),
				th1 = ct('th'),
				th2 = ct('th');
			tr.appendChildren(th1, th2);
			thead.appendChild(tr);
			table.appendChild(thead);
			table.setAttribute('rules', 'groups');
			table.setAttribute('cellpadding', '3');
			danmaku_pool.storm.foreach(function(e){
				var tr2 = ct('tr'),
					td1 = ct('td', e),
					ftime;
				danmaku_pool.dmk.foreach(function(f){
					if(f.content == e){
						ftime = new Date(f.ts).format('yyyy-MM-dd HH:mm');
						return true;
					}
				});
				var td2 = ct('td', ftime);
				tr2.appendChildren(td1, td2);
				table.appendChild(tr2);
			});
			if(table.rows.length - 1){
				div.appendChild(ct('legend'));
				div.appendChild(table);
			}
			/*setTimeout(function(){
				var starttime = Date.now();
				ls.tBodies[0].rows[0].querySelector('[type=button]').click();
				pl('proctime: '+(Date.now() - starttime));
			},1000);*/
		}); // 读文件块 结束
	}); // 循环文件块 结束
}
