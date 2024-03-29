---
layout: lmui
title: 瑞兽谷辅助脚本说明
description: 瑞兽谷辅助脚本是一个油猴脚本，一个超越浏览器限制，在瑞兽谷使用众多强力功能的辅助脚本。
---

<style>
@import "/assets/css/style.css";
body{
	background-color: transparent;
}
</style>

{% capture md %}

## 简单介绍一下

瑞兽谷辅助脚本是一个油猴脚本。

瑞兽谷想做的不只是简单的博客网站，因此开发了很多强力的功能。

但瑞兽谷想更长远地运行下去。即使站长 LEORChn [无法更新内容的情况](#lost-update)下，也继续运行下去。

迫于无奈，整个网站的后端仅能使用静态渲染；所有运行在网站上的程序均为开源，并仅在客户机浏览器上执行所有逻辑。

因此，由于部分功能的实现原理受到浏览器限制而无法轻易实现。

但现在有了辅助脚本，便可以轻易……噢不是，应该说，即使坎坷的开发路程一路走来不那么容易，但起码能实现这些功能。能跑得动就好了。

## 关于用户协议

至于这段怎么写，暂时是还没想得太好。但至少写个免责声明应该还行吧……？

* 本软件仅供学习交流使用。
* 如果用户下载此软件，则表示用户所下载的副本，著作权归用户所有。
* 当用户下载该软件的副本后，一律认定为用户已修改了该副本的源码和其执行逻辑。因此，因该副本运行而引发的法律责任，一概与 LEORChn 无关。

## 关于下载

Greasy Fork：<https://greasyfork.org/scripts/424781>{:target="_blank"}

本地下载：[LEORChn-Helper.user.js](LEORChn-Helper.user.js){:target="_blank"}

## “无法更新内容的情况” 是什么意思？ {#lost-update}

这个问题背后的原因是比较前瞻性的。你可以理解为：

* 财务周转问题
* 地区和网络问题
* 人身自由受限
* 疾病和死亡
* 其他情况

{% endcapture %}

<div class="mui-panel markdown-body">
    {{ md | markdownify }}
</div>



