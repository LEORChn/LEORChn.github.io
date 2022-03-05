var storage_slots = {
	equipment: '2,5 2,3 2,3 2,2 2,5 ||2 |2,2  ,2 2,2 ||         ',
	__paths: {
		equipment: 'hand1 body back head hand2   belt  arm ring1 neck leg  ring2'.split(' ')
	},
	__data: {
		equipment: {}
	},
	__convert: {
		o_inv_right_hand: 'hand1',
		o_inv_armor:      'body',
		o_inv_back:       'back',
		o_inv_head:       'head',
		o_inv_left_hand:  'hand2',
		o_inv_belt:       'belt',
		o_inv_gloves:     'arm',
		o_inv_ring_1:     'ring1',
		o_inv_neck:       'neck',
		o_inv_boots:      'leg',
		o_inv_ring_2:     'ring2'
	}
};
function storageUpdate(){
	var d = storage_slots.__data,
		c = storage_slots.__convert;
	Object.keys(d).foreach(function(e){
		Object.keys(d[e]).foreach(function(f){
			var ff = f in c? c[f]: f;
			var root = $(`[path="storage.${e}.${ff}"]`);
			if(!root) return;
			root.innerHTML = d[e][f][1].Name;
		});
	});
}
(function(){
	Object.keys(storage_slots).foreach(function(e){
		var root = $(`[path="storage.${e}"]`);
		if(!root) return;
		var paths = storage_slots.__paths[e];
		root.initChildren('div').initChildren('table').setAttr('rules', 'all').appendChildren(
			storage_slots[e].split('|').map(function(e){
				return ct('tr').appendChildren(
					e.split(' ').map(function(e){
						var span = (e + ',').split(',').map(function(e){
							return parseInt(e) || 1;
						});
						return ct('td').setAttr('colspan', span[0]).setAttr('rowspan', span[1]);
					})
				);
			})
		).$$('td').foreach(function(ee, i){
			if(i >= paths.length || !paths[i]) return;
			ee.setAttr('path', `storage.${e}.${paths[i]}`);
		});
	});
})();
