function Json2Ass(pool, tr){
	var _GET_NUM = function(e, def){
		var n;
		return e? isNaN(n = e.valueAsNumber)? def: n: def;
	};
	var WIDTH_INPUT = _GET_NUM(fv('screenwidth'), 1920);
	var MAX_VERTICAL_OFFSET_TIMES = _GET_NUM(fv('maxline'), 14);
	var out = /.*?\/\*([\s\S]*)\*\//.exec((function(){
/*[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: {0}
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: AcplayDefault,黑体,64,&H0000FFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,7,20,20,20,1
Style: Acplay_trans,黑体,64,&HD000FFFF,&H00FFFFFF,&HD0000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,7,20,20,20,1
Style: pindmk,黑体,32,&H0000FFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,7,20,20,20,1
Style: pindmk_trans,黑体,32,&HC000FFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,7,20,20,20,1
Style: clock,黑体,24,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,3,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
*/}).toString())[1].format(WIDTH_INPUT);

	// ===== 函数准备区 ===== //
	var func_tmp_dmk_preprocess_time = function(){ // 预处理弹幕开始时间计算函数
		var func_tmp_ts_lastclean = function(){ // 自第一个视频至当前选择的视频之间，最后一个勾选clean的视频的开始时间
			var tmp = null;
			arr(tr.parentNode.rows).foreach(function(e){
				if(e.querySelector('[rule=clean]>[type=checkbox]:checked'))
					tmp = parseInt(e.querySelector('[rule=start]').getAttribute('value'));
				if(e == tr) return true;
			});
			return tmp;
		};
		/* 预处理弹幕开始时间。
		
			范围为：
			从第一条弹幕时间到视频开始时间之间，
			最后一个勾选clean的视频的开始时间，
			的前30分钟.
			
			1.如果选择任一个视频且之前没有勾选clean，预处理弹幕则为该视频开始前的所有弹幕。
			2.如果选择任一个视频且勾选clean，预处理弹幕则为该视频开始前30分钟至视频开始以内的所有弹幕。
			3.如果选择第二个视频且第一个视频勾选clean，预处理弹幕则为从第一个视频开始前30分钟至第二个视频开始以内的所有弹幕。
		 */
		var ts_firstdmk = dp.length? dp[0].ts: 0, // 第一条弹幕的开始时间。获取之前先判断弹幕池有没有item，如果没有则只输出clock
		 ts_lastclean = func_tmp_ts_lastclean(); // 最后一个勾选clean的视频的开始时间
		return ts_lastclean == null? ts_firstdmk: ts_lastclean - 1800000;
	};
	// ===== 函数准备区 结束 ===== //
	// ===== 常量准备区 ===== //
	var screen = {
		Width: WIDTH_INPUT, // def: 1920
		Height: 1080
	};
	var fontSize = {
		roll: 64,
		pin: 32
	}
	var dp = pool.dmk;
	var ts = [ // [0]=预处理弹幕开始时间，[1]=视频开始时间，[2]=视频结束时间
		func_tmp_dmk_preprocess_time(), // 预处理弹幕开始时间
		parseInt(tr.querySelector('[rule=start]').getAttribute('value')), // 视频开始时间
		parseInt(tr.querySelector('[rule=end]').getAttribute('value')) // 视频结束时间
	];
	// ===== 常量准备区 结束 ===== //
	
	// ===== 函数准备区2 ===== //
	var func_tsAbs2tsRel = function(t){
		var tmp = t - ts[1];
		return tmp > 0? tmp: 0; // 弹幕开始时间早于视频开始时间，此时值为负数，重置为0
	};
	var func_ts2time = function(t){
		return new Date(t + tz_offset).format('H:mm:ss.SS');
	};
	// ===== 函数准备区2 结束 ===== //
	
	var dmk_reroll_time = 13000; // 如果这条弹幕在视频开始时间前13秒内发送，那么就重新滚动一次
	var asses = [];
	
	// ===== 开始处理 ===== //
	var tz_offset = new Date().getTimezoneOffset() * 60000;
	var vertical_offset_times = 0; // 弹幕行纵向偏移值（已容纳多少行弹幕）
	
	// === 处理滚动式弹幕 === //
	dp.foreach(function(e){
		if(e.ts < ts[0]) return; // 还未到达预处理时间，不做处理
		
		vertical_offset_times = vertical_offset_times % MAX_VERTICAL_OFFSET_TIMES;
		vertical_offset_times++;
		
		if(e.ts < (ts[1] - dmk_reroll_time)){ // 介于预处理和视频开始之间（需要排除重新滚动）
			
		}else if(e.ts < ts[2]){ // 介于视频之内时间（需要处理重新滚动）
			var startRoll = func_tsAbs2tsRel(e.ts);
			var endRoll = func_ts2time(startRoll + 10000);
			startRoll = func_ts2time(startRoll);
			
			var isStorm = (pool.storm.indexOf(e.content) >= 0);
			var style = isStorm? 'Acplay_trans': 'AcplayDefault';
			
			var func_calcTextLen = function(t){
				var len = 0;
				for(var ch of t)
					len += ch.charCodeAt(0) > 255? 2: 1;
				return len;
			};
			var dmklen = func_calcTextLen(e.nick + '：' + e.content);
			var startRollX = screen.Width; // 定位点为小键盘7
			var startRollY = (vertical_offset_times - 1) * fontSize.roll; // 定位点为小键盘7
			var endRollX = -dmklen / 2 * fontSize.roll;
			
			var roll_fmt = 'Dialogue: 3,{0},{1},{2},,0,0,0,,{\\move({3}, {4}, {5}, {4})}{6}：{\\c&H{7}}{8}\r\n'.format(
				startRoll, endRoll, style,
				startRollX, startRollY, endRollX,
				e.nick, e.color.toString(16), e.content
			);
			out += roll_fmt;
			
		}else{
			return true; // 视频已结束，短路返回
		}
	});
	
	out += '\r\n';
	
	// === 处理固定弹幕区 === //
	var pin_dmk = $('#pin_dmk').value.split(' ');
	if(pin_dmk[0] == 'pin_dmk'){
		var BASE_ALIGN_SHIFT_X = 0;
		var BASE_ALIGN_SHIFT_Y = 0;
		
		var displaying = [];
		displaying_limit = 5;
		
		var cmd_cache = '';
		pin_dmk.foreach(function(e){
			var tryint = parseInt(e);
			if(isNaN(tryint)) cmd_cache = e;
			else switch(cmd_cache.toUpperCase()){
				case 'L':
					BASE_ALIGN_SHIFT_X = tryint;
					break;
				case 'B':
					BASE_ALIGN_SHIFT_Y = tryint;
					break;
				case 'LIMIT':
					displaying_limit = tryint;
			}
		});
		dp.foreach(function(e, i){
			if(e.ts < ts[0]) return; // 还未到达预处理时间，不做处理
			if(e.ts > ts[2]) return true; // 视频已结束，短路返回
			
			//vertical_offset_times++;
			//if(vertical_offset_times > 14) vertical_offset_times = 0;
			
			var cur = null;
			
			var THIS_DMK_START = func_ts2time(func_tsAbs2tsRel(e.ts));
			var NEXT_DMK_START = func_ts2time(func_tsAbs2tsRel(i < dp.length-1? dp[i+1].ts: e.ts+36000000));
			// 下一条弹幕的出现时间。同时用于当前屏的结束时间。如果没有下一条弹幕，那么时间则为当前弹幕时间+10小时
			
			var STYLE = {
				full_trans: 'pindmk',
				half_trans: 'pindmk_trans',
				half_time:  3
			};
			
			var isStorm = pool.storm.indexOf(e.content) >= 0;
			if(isStorm){ // 从现有池中找节奏代理弹幕
				var idx = null;
				displaying.foreach(function(e, i){
					if('storm' in e) return idx = i;
				});
				cur = idx == null?           // 从未创建过节奏代理弹幕，或者代理弹幕已被刷屏？
					{ storm: 0 }:              // 是的，所以创建一个节奏代理弹幕
					displaying.splice(idx, 1)[0]; // 不是，已经成功在弹幕池找到了节奏代理弹幕
				cur.storm++;
				cur.content = '节奏弹幕 x{0}  详细记录请在瑞兽谷查阅'.format(cur.storm);
			}else{ // 非节奏弹幕
				cur = {
					nick: e.nick,
					content: '{0}：{\\c&H{1}}{2}'.format(e.nick, e.color.toString(16), e.content)
				};
			}
			displaying.unshift(cur); // 把当前所操作的弹幕加到第一个
			
			while(displaying.length > displaying_limit) displaying.pop(); // 屏幕显示过多（已超过限制），删除最后一个
			
			if(THIS_DMK_START == NEXT_DMK_START) return;
			// 没有必要写入瞬间就被覆盖的一屏弹幕
			
			// ===== 屏幕排演完成，开始写入一屏数据 ===== //
			var tmp_contain = '';
			displaying.foreach(function(e, i){
				var CURRENT_STYLE = i < STYLE.half_time? STYLE.full_trans: STYLE.half_trans;
				if(pool.manager.indexOf(e.nick) >= 0) CURRENT_STYLE = STYLE.full_trans; // 如果是房管或者其他特殊人物
				var ALIGN_SHIFT_X = BASE_ALIGN_SHIFT_X;
				var ALIGN_SHIFT_Y = screen.Height - BASE_ALIGN_SHIFT_Y - (fontSize.pin * (i + 1));
				
				// 屏内倒序添加，这样每一屏在视频中显示的与在文件中显示的感觉就相符了（仅限 Align=LeftBottom）
				tmp_contain = 'Dialogue: 5,{0},{1},{2},,0,0,0,,{\\pos({3}, {4})}{5}\r\n'.format(
					THIS_DMK_START, NEXT_DMK_START, CURRENT_STYLE,
					ALIGN_SHIFT_X, ALIGN_SHIFT_Y, e.content
				) + tmp_contain;
			});
			out += tmp_contain;
			
		});
		
		out += '\r\n';
	}
	
	// ===== 时间戳 ===== //
	var FIRST_MINUTE_KEEPS = 60000 - (ts[1] % 60000); // 第一分钟能持续显示多少时间以变化到第二分钟
	var NEXT_MINUTE_STARTS = ts[1] + FIRST_MINUTE_KEEPS;
	
	var TIMECLOCK_TEMPLATE = 'Dialogue: 2,{0},{1},clock,,0,0,0,,{2}\r\n',
		TIMECLOCK_FMT = 'yyyy-MM-dd HH:mm wc';
	
	out += TIMECLOCK_TEMPLATE.format(
		'0:00:00.00',
		func_ts2time(func_tsAbs2tsRel(NEXT_MINUTE_STARTS)),
		new Date(ts[1]).format(TIMECLOCK_FMT)
	);
	
	while(NEXT_MINUTE_STARTS < ts[2]){
		var THIS_MINUTE_STARTS = NEXT_MINUTE_STARTS;
		NEXT_MINUTE_STARTS += 60000;
		
		out += TIMECLOCK_TEMPLATE.format(
			func_ts2time(func_tsAbs2tsRel(THIS_MINUTE_STARTS)),
			func_ts2time(func_tsAbs2tsRel(NEXT_MINUTE_STARTS)),
			new Date(THIS_MINUTE_STARTS).format(TIMECLOCK_FMT)
		);
	}
	
	return out;
}