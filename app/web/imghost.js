(function(){
	fv('IHS_people_file').onchange = function(e){
		var f = e.target.files[0] || { type:'未选择文件', size:0},
			t = fv('IHS_people_type'),
			s = fv('IHS_people_size'),
			u = fv('IHS_people_submit'),
			a1 = 'image/gif image/jpeg image/png',
			t1 = f.type || '未知格式',
			p1 = t1.length > 0 && a1.contains(t1),
			a2 = 1.5 * 1024 * 1024,
			t2 = f.size,
			p2 = t2 > 0 && t2 < a2;
		t.innerHTML = (p1? '√': '×') +' 类型：' + t1 + '（允许 '+a1+' ）';
		s.innerHTML = (p2? '√': '×') +' 大小：' + (t2 / 1024 / 1024).toFixed(t2 < 10240? 4: 2) + ' M （允许 < 1.5 M ）';
		t.style.color = p1? '#00C000': '#F00';
		s.style.color = p2? '#00C000': '#F00';
		if(p1 && p2){
			u.removeAttribute('disabled');
		}else{
			u.setAttribute('disabled','');
		}
	};
	fv('IHS_people_data_place').onchange = function(){
		var v = this.value.trim();
		if(v.startsWith('{') && v.endsWith('}')); else return; // 要求左右对应
		var nums = v.split('').reduce(function(prev,next){
			if(next in prev) prev[next]++; else prev[next] = 1;
			return prev;
		},{}),
			brl = nums['{'] || 0,
			brr = nums['}'] || 0;
		if(brr != brl) return; // 要求数量对应
		var j=eval('('+v+')');
		if(j['imageUrl']){
			fv('img_place').src = 'http://bbs1.people.com.cn/'+j.imageUrl;
		}
	}
})();
/*
{"userNick":null,"boardId":0,"userId":-1,"readCount":0,"replyCount":0,"createdTime":1553454460575,"postId":0,"postTitle":null,"imageName":"2.gif.gif","orderId":0,"width":0,"height":0,"voteyes":0,"smallWidth":0,"smallHeight":0,"imageUrl":"/postImages/Y0/B1/19/EE/9F/1553454460575.gif","showState":0,"imageSize":1490386,"imageSizeShow":"1.42MB","checked":0,"createdTimeByPattern":"2019-03-25 03:07","smallImageUrl":"/postImages/Y0/B1/19/EE/9F/small_1553454460575.gif","id":1553454460575,"description":null}
*/
