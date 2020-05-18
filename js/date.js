// https://www.runoob.com/js/js-obj-date.html
// 改动较大

Date.prototype.format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "[Hh]+" : this.getHours(),                //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3)  //季度
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(S+)/.test(fmt)){
  	fmt=fmt.replace(RegExp.$1, (this.getMilliseconds()/1000+'0000').substr(2, RegExp.$1.length)); // todo:如果是整秒情况取毫秒会有bug，加4个0仅仅是暂时缓解，需要修复
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ?
        	(o[k]) :
        	(("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}
