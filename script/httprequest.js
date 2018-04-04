var xmlHttp=null;
function chttp(){if(xmlHttp)return true;if(window.XMLHttpRequest)xmlHttp=new XMLHttpRequest();else if(window.ActiveXObject)xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");return vaild(xmlHttp);}
function http(method,url,formed,){if(chttp()){xmlHttp.open(method.toUpperCase(),url,true);xmlHttp.send(formed);return xmlHttp.responseText;}}
function vaild(o){return!(o==undefined||o==null||isNaN(o));}