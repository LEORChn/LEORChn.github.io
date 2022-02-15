"""
 @Author  : Alfons
 @Contact: alfons_xh@163.com
 @File    : WifiKeyGetPassword.py
 @Time    : 2018/9/28 10:51
"""

import sys
import json
import hashlib
import collections
import urllib
import time
import requests
from Crypto.Cipher import AES
from urllib import unquote, quote # edited from # from urllib.parse import unquote, quote

AES_KEY = b"!I50#LSSciCx&q6E"
AES_IV = b"$t%s%12#2b474pXF"
MD5_SALT = "*Lm%qiOHVEedH3%A^uFFsZvFH9T8QAZe"


# AES_KEY = b"FciCx&q6E!I50#LSSC"
# AES_IV = b"C474pXF$t%s%12#2bB"
# MD5_SALT = "CedH3%A^uFFsZvFH9T8QAZe*Lm%qiOHVEB"

def getMd5(str):
    md5 = hashlib.md5()
    md5.update(str.encode())
    return md5.hexdigest()


def run(ssid, bssid):
    dt = collections.OrderedDict()
    dt['origChanId'] = 'xiaomi'
    dt['appId'] = 'A0008'
    dt['ts'] = str(int(time.time()))
    dt['netModel'] = 'w'
    dt['chanId'] = 'guanwang'
    dt['imei'] = '357541051318147'
    dt['qid'] = ''
    dt['mac'] = 'e8:92:a4:9b:16:42'
    dt['capSsid'] = 'hijack'
    dt['lang'] = 'cn'
    dt['longi'] = '103.985752'
    dt['nbaps'] = ''
    dt['capBssid'] = 'b0:d5:9d:45:b9:85'
    dt['bssid'] = bssid
    dt['mapSP'] = 't'
    dt['userToken'] = ''
    dt['verName'] = '4.1.8'
    dt['ssid'] = ssid
    dt['verCode'] = '3028'
    dt['uhid'] = 'a0000000000000000000000000000001'
    dt['lati'] = '30.579577'
    dt['dhid'] = '9374df1b6a3c4072a0271d52cbb2c7b6'
    dt = json.dumps(dt, ensure_ascii=False, separators=(',', ':'))
    dt = quote(dt)
    j = len(dt)
    i = 0
    while (i < 16 - j % 16):
        dt = dt + ' '
        i = i + 1
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    ed = cipher.encrypt(dt.encode())
    ed = ed.encode("hex").upper() # edited from # ed = ed.hex().upper()
    data = {}
    data['appId'] = 'A0008'
    data['pid'] = '00900601'
    data['ed'] = ed
    data['et'] = 'a'
    data['st'] = 'm'
    ss = ""
    for key in sorted(data):
        ss = ss + data[key]
    sign = getMd5(ss + MD5_SALT)
    data['sign'] = sign
    # url = 'http://ap.51y5.net/ap/fa.sec'
    url = "http://news.51y5.net/news/fa.sec"
    post_data = quote(urllib.urlencode(data)) # edited from # post_data = quote(urllib.parse.urlencode(data))
    req = requests.post(url, data=post_data)
    content = req.content
    result = json.loads(content.decode('utf-8'))
    print(result)
    try:
    	print "return a raw is:"
    	print result # new !
        if len(result['aps']) == 0:
            print("Not Found")
            sys.exit()
        epwd = result['aps'][0]['pwd']
        cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
        pdd = cipher.decrypt(epwd.decode("hex"))
        length = int(pdd[:3])
        pwd = pdd[3:][:length]
        print("password is: " + unquote(pwd))
    except Exception as e:
        print('sorry,get password fail! pleas test other wifi!')
        print('error msg is:', e)


if __name__ == '__main__':
    ed = "705ADF23041F33EEB2991F7DD3A02E61855C022EB69858881A4088FD47645F7C"
    sign = getMd5("7112D2AE3D5E4E261A2AEB16D380152B" + ed)
    print(sign)
    print("1549E5C6B18F69D475EA7B51744ED37C")

    ssid = "360FreeWiFi-10" # edited from # "Apple"
    bssid = "b0:d5:9d:56:82:10" # edited from # "40:A5:EF:79:DE:41"
    run(ssid, bssid)
    
