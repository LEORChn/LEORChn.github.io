// fork from https://github.com/esterTion/BiliBili_crc2mid/blob/master/crc32.htm
// fork on   2021-8-20
// modified  2021-8-23

(function(){

window.crc_engine = new BiliBili_midcrc();
function BiliBili_midcrc(){
	'use strict';
	const CRCPOLYNOMIAL = 0xEDB88320;
	var crctable = new Array(256);
	create_table();
	var index = new Array(4);
	return function(input){
		var ht = parseInt('0x'+input)^0xffffffff,
		snum,i,lastindex,deepCheckData;
		for(i=3; i>=0; i--){
			index[3-i] = getcrcindex( ht >>> (i * 8) );
			snum = crctable[index[3 - i]];
			ht ^= snum >>> ((3 - i) * 8);
		}
		for(i=0; i<100000; i++){
			lastindex = crc32lastindex(i);
			if(lastindex == index[3]){
				deepCheckData=deepCheck(i,index)
				if(deepCheckData[0])
					break;
			}
		}
		if(i==100000)
			return -1;
		return i+''+deepCheckData[1];
	};
	function create_table(){
		var crcreg, i, j;
		for(i = 0; i < 256; ++i){
			crcreg = i;
			for(j = 0; j < 8; ++j){
				if ((crcreg & 1) != 0){
					crcreg = CRCPOLYNOMIAL ^ (crcreg >>> 1);
				}else{
					crcreg >>>= 1;
				}
			}
			crctable[i] = crcreg;
		}
	}
	function crc32(input){
		if(typeof(input) != 'string') input = input.toString();
		var crcstart = 0xFFFFFFFF, len = input.length, index;
		for(var i=0; i<len; ++i){
			index = (crcstart ^ input.charCodeAt(i)) & 0xff;
			crcstart = (crcstart >>> 8) ^ crctable[index];
		}
		return crcstart;
	}
	function crc32lastindex(input){
		if(typeof(input) != 'string') input = input.toString();
		var crcstart = 0xFFFFFFFF, len = input.length, index;
		for(var i=0; i<len; ++i){
			index = (crcstart ^ input.charCodeAt(i)) & 0xff;
			crcstart = (crcstart >>> 8) ^ crctable[index];
		}
		return index;
	}
	function getcrcindex(t){
		for(var i=0; i<256; i++){
			if(crctable[i] >>> 24 == t) return i;
		}
		return -1;
	}
	function deepCheck(i, index){
		var tc = 0x00, str = '',
		hash = crc32(i);
		tc = hash & 0xff ^ index[2];
		if (!(tc <= 57 && tc >= 48))
			return [0];
		str += tc-48;
		hash = crctable[index[2]] ^ (hash >>> 8);
		tc = hash & 0xff ^ index[1];
		if (!(tc <= 57 && tc >= 48))
			return [0];
		str += tc-48;
		hash = crctable[index[1]] ^ (hash >>> 8);
		tc = hash & 0xff ^ index[0];
		if (!(tc <= 57 && tc >= 48))
			return [0];
		str += tc-48;
		hash = crctable[index[0]] ^ (hash >>> 8);
		return [1,str];
	}
}
})();
