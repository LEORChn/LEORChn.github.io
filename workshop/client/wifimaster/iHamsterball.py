#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# Author: TheCjw<thecjw@qq.com>
# Created on 22:26 2015/2/11

# Editer: Hamster<ihamsterball@gmail.com>
# Automatically change dhid to prevent block
# So that enable to query unlimitedly
# Edited on 23:26 2015/6/22

# Editer: Hamster<ihamsterball@gmail.com>
# Add Chinese SSID support
# Update on 11:12 2015/6/25

__author__ = "TheCjw, Hamster"

import collections
import hashlib
import json

import requests
from Crypto.Cipher import AES

class Initdhid(object):
    def __init__(self):
        self.salt = "LQ9$ne@gH*Jq%KOL"
        self.request_params = {}

        self.request_url = "http://wifiapi02.51y5.net/wifiapi/fa.cmd"
        self.request_params["capbssid"] = "d8:86:e6:6f:a8:7c"
        self.request_params["model"] = "Nexus+4"
        self.request_params["och"] = "wandoujia"
        self.request_params["appid"] = "0001"
        self.request_params["mac"] = "d8:86:e6:6f:a8:7c"
        self.request_params["wkver"] = "2.9.38"
        self.request_params["lang"] = "cn"
        self.request_params["capbssid"] = "test"
        self.request_params["uhid"] = ""
        self.request_params["st"] = "m"
        self.request_params["chanid"] = "guanwang"
        self.request_params["dhid"] = ""
        self.request_params["os"] = "android"
        self.request_params["scrs"] = "768"
        self.request_params["imei"] = "355136052333516"
        self.request_params["manuf"] = "LGE"
        self.request_params["osvercd"] = "19"
        self.request_params["ii"] = "355136052391516"
        self.request_params["osver"] = "5.0.2"
        self.request_params["pid"] = "initdev:commonswitch"
        self.request_params["misc"] = "google/occam/mako:4.4.4/KTU84P/1227136:user/release-keys"

        # "sign" to be computed
        self.request_params["sign"] = ""

        self.request_params["v"] = "633"
        self.request_params["sim"] = ""
        self.request_params["method"] = "getTouristSwitch"# Method: Get new dhid
        self.request_params["scrl"] = "1184"

        self.headers = {
            "Content-type": "application/x-www-form-urlencoded",
            "Host": "wifiapi02.51y5.net",
            "Accept": "text/plain"
        }

    def __sign__(self, data):
        return hashlib.md5(data.encode("utf-8")).hexdigest().upper()

    def __post__(self):
        r = requests.post(self.request_url, data=self.request_params, headers=self.headers)
        return r.text

    def __sign_data__(self):
        self.request_params["sign"] = ""
        value = ""
        for key in collections.OrderedDict(sorted(self.request_params.items())):
            value += self.request_params[key]
        value += self.salt
        return self.__sign__(value)

    def request(self):
        self.request_params["sign"] = self.__sign_data__()
        ret_data = json.loads(self.__post__())
        return ret_data["initdev"]["dhid"]

class WifiDemo(object):
    def __init__(self):
        self.salt = "LQ9$ne@gH*Jq%KOL"
        self.request_url = "http://wifiapi02.51y5.net/wifiapi/fa.cmd"

        self.request_params = {}
        self.request_params["och"] = "wandoujia"
        self.request_params["ii"] = ""
        self.request_params["appid"] = "0001"
        # self.request_params["pid"] = "qryapwithoutpwd:commonswitch"
        self.request_params["pid"] = "qryapwd:commonswitch"
        self.request_params["lang"] = "cn"
        self.request_params["v"] = "633"
        self.request_params["uhid"] = "a0000000000000000000000000000001"
        # self.request_params["method"] = "getSecurityCheckSwitch"
        self.request_params["method"] = "getDeepSecChkSwitch"
        self.request_params["st"] = "m"
        self.request_params["chanid"] = "guanwang"

        # Fill these shit.
        self.request_params["sign"] = ""
        self.request_params["bssid"] = ""
        self.request_params["ssid"] = ""

        # device id.
        self.request_params["dhid"] = "4028b2964e01aa00014e1a8641aa4675"
        # device mac.
        self.request_params["mac"] = "d8:86:e6:6f:a8:7c"

        self.headers = {
            "Content-type": "application/x-www-form-urlencoded",
            "Host": "wifiapi02.51y5.net",
            "Accept": "text/plain"
        }

    def __sign__(self, data):
        return hashlib.md5(data.encode("utf-8")).hexdigest().upper()


    def __post__(self):
        r = requests.post(self.request_url, data=self.request_params, headers=self.headers)
        return r.text

    def __add_bssid__(self, bssid):
        self.request_params["bssid"] += bssid + ","

    def __add_ssid__(self, ssid):
        self.request_params["ssid"] += ssid + ","

    def __sign_data__(self):
        self.request_params["sign"] = ""
        value = unicode("",'utf-8')
        for key in collections.OrderedDict(sorted(self.request_params.items())):
            value += self.request_params[key].decode('utf-8')
        #    print type(value)
        #    print type(self.request_params[key])
        value += self.salt
        return self.__sign__(value)

    def add_ssid(self, bssid, ssid):
        self.__add_bssid__(bssid)
        self.__add_ssid__(ssid)

    def request(self):
        tmp = Initdhid()
        self.request_params["dhid"] = tmp.request()
        self.request_params["sign"] = self.__sign_data__()
        j = self.__post__()
        print j
        ret_data = json.loads(j)
        if ret_data["retCd"] == "-1111":
            # update key and retry.
            self.salt = ret_data["retSn"]
            return self.request()
        elif ret_data["retCd"] == "0":
            self.salt = ret_data["retSn"]
            return ret_data

def main():
    wifi = WifiDemo()

    # Add BSSID & SSID
    wifi.add_ssid("aa:bb:cc:dd:ee:ff", "SSID")
    wifi.add_ssid("ab:bc:cd:de:ef:fa", "中文SSID")

    result = wifi.request()

    if len(result["qryapwd"]["psws"]) == 0:
        print "Not found."
        return

    for info in result["qryapwd"]["psws"]:
        ssid = result["qryapwd"]["psws"][info]["ssid"]
        bssid = result["qryapwd"]["psws"][info]["bssid"]
        encrypt_data = result["qryapwd"]["psws"][info]["pwd"]

        cipher = AES.new(b"jh16@\`~78vLsvpos", AES.MODE_CBC, b"j#bd0@vp0sj!3jnv")
        decrypt_data = cipher.decrypt(encrypt_data.decode("hex"))
        length = int(decrypt_data[:3])
        password = decrypt_data[3:][:length]

        print "ssid", ssid
        print "bssid", bssid
        print "password", password
        print


if __name__ == "__main__":
    main()
