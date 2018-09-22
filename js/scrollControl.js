/*	可用接口
	smoothScrollTo(Y轴位置, 毫秒时间)				使用平滑滚动将窗口顶部与文档指定 Y 轴位置对齐
	smoothScrollBy(相对Y轴位置, 毫秒时间)			使用平滑滚动 Y 轴的相对位置，向顶部滚动用负数，向底部滚动用正数
	smoothScrollToVisit(完整展示的元素, 毫秒时间)	使用平滑滚动直到完全将该元素展示在窗口内
*/

var smoothScrollEachTime=16, //16=60帧，33=30帧
	smoothScrollLastTime, smoothScrollEachPos;

function smoothScrollTo(y,time){ // 平滑滚动 Y 轴到指定坐标，参数2为指定限时，单位为毫秒
	y-=scrollY;
	smoothScrollBy(y,time);
}
function smoothScrollBy(y,time){
	time/=smoothScrollEachTime;
	smoothScrollEachPos=Math.floor(y/time);
	smoothScrollLastTime=Math.floor(time)+1; //多滑一点没什么啦
	setTimeout(smoothScrolling,smoothScrollEachTime);
}
function smoothScrollToVisit(e,time){ // 平滑滚动 Y 轴直到完全看到某一元素，若元素高度高出窗体，则滚动 Y 轴直到元素完全占满窗体
	var vStart=scrollY, // 窗口顶部与文档顶部的距离
		vHeight=getClientHeight(), // 窗口高度
		vEnd=vStart + vHeight; // 窗口底部与文档顶部的距离
	// 测试元素开头是否在窗口内
	var elementY=absTop(e), // 元素顶部与文档顶部的距离
		elementStart=elementY - vStart, // 元素顶部与窗口顶部的距离
		isStartInWindow=elementY > vStart && elementY < vEnd, // 元素顶部是否在窗口内
		howManyElementEndOverWindow=(elementStart + e.offsetHeight) - (vEnd - vStart), // 元素底部超出窗口底部多少
		isEndInWindow= howManyElementEndOverWindow < 0; //元素底部是否在窗口内
	if(isStartInWindow && isEndInWindow){ // 顶部和尾部都在显示范围内，则不操作
		return;
	}else if(vStart > elementY){ // 头部高过窗口顶部
		smoothScrollTo(elementY, time);
	}else if(e.offsetHeight > vHeight){ // 测试元素是否比窗口还高，如果是则只需滚动到将元素顶部与窗口顶部对齐
		smoothScrollTo(elementY, time);
	}else{ // 元素不比窗口高，但是元素底部就是超出窗口底部
		smoothScrollBy(howManyElementEndOverWindow,time);
	}
}
function absTop(e,l){ // 计算一个元素距离页面顶部的绝对高度（只需传入第一个参数）
	l=l? l: 0;
	return e.offsetParent==null? l: absTop(e.offsetParent,l+e.offsetTop);
}
function smoothScrolling(){ // 由当前文件的其他函数进行初始化，不推荐手动调用
	scrollBy(0,smoothScrollEachPos);
	if(--smoothScrollLastTime>0)setTimeout(smoothScrolling,smoothScrollEachTime);
}
function getClientHeight(){ // 获取窗体可视高度（不计入横向滚动条）
	var b=document.body.clientHeight, // 都不为零取最小，其一为零取最大
		d=document.documentElement.clientHeight;
	return b && d? Math.min(b,d): Math.max(b,d);
}