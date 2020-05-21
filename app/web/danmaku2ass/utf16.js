function strEncodeUTF16(str) {
  var buf = new ArrayBuffer(str.length*2+2);
  var bufView = new Uint16Array(buf);
  bufView[0] = 65279;
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i+1] = str.charCodeAt(i);
  }
  return bufView;
}
