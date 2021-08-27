(function(){

var dx = [],
	fx = [],
	dxDict = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍郤璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查後荆红游竺权逯盖益桓公 仉督 晋楚闫法汝鄢涂钦 归海 岳帅缑亢况后有琴 商牟佘佴伯赏 墨哈谯笪年爱阳佟 言福'.replace(/\s/g, ''),
	fxDict = '万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐钟离宇文长孙慕容鲜于闾丘司徒司空亓官司寇 子车颛孙端木巫马公西漆雕乐正壤驷公良拓跋夹谷宰父谷梁 段干百里东郭南门呼延 羊舌微生 梁丘左丘东门西门 南宫 第五'.replace(/\s/g, ''),
	fxRegex = /.{2}/g;
dxDict.foreach(function(e){
	var pys = pinyinPro.pinyin(e, {
		toneType: 'none',
		multiple: true,
		type: 'array'
	});
	pys.unshift(e);
	dx.push(pys);
});
var fxTemp;
while(fxTemp = fxRegex.exec(fxDict)){
	fx.push([
		fxTemp[0],
		pinyinPro.pinyin(fxTemp[0], {
			toneType: 'none'
		})
	]);
}
window.pinyin_v1 = function(){
	var _this = this,
		search = this.value.toLowerCase(),
		table = outp;
	if(!search) return;
	new Promise(function(ok, cancel){
		var isCanceled = false;
		var detectInterval = setInterval(function(){ // 打开一个中断检测器
			if(_this.value.toLowerCase() == search) return;
			clearInterval(detectInterval);
			isCanceled = true;
			cancel();
		}, 500);
		var result = [];
		if(dx.foreach(function(e){
			if(isCanceled) return true;
			e.foreach(function(f, i){
				if(!i || !f.startsWith(search)) return;
				result.push({
					han: e[0],
					pinyin: f
				});
			});
		})) return;
		
		table.tBodies[0].clearChildren();
		result.foreach(function(e){
			table.tBodies[0].appendChild(
				ct('tr').appendChildren(
					ct('td', e.han),
					ct('td', e.pinyin)
				)
			);
		});
		if(!result.length){
			table.tBodies[0].appendChild(
				ct('tr').appendChildren(
					ct('td', '无结果')
				)
			)
		}
		clearInterval(detectInterval); // 任务已完成，关掉中断检测器
	});
};

})();
