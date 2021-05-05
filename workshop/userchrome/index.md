---
layout: lmui
title: userChrome.css
description: 浏览器的发展日新月异，但我已经受够了难看的新界面。是时候回归经典了...
---

<style>
@import "/assets/css/style.css";
body{
	background-color: transparent;
    -moz-tab-size: 2;
    tab-size: 2;
}
</style>

{% capture md %}

> 浏览器的发展日新月异，但我已经受够了难看的新界面。是时候回归经典了。

这是一个在 Firefox 上模仿旧版 Chrome 界面的工程。

无他，就只是很欣赏这种梯形的标签栏样式罢了。

看看这新版的方形圆角，多 Low 啊，太难受了。

## 赶紧放出下载 {#download}

[userChrome.css](userChrome.css){:download="userChrome.css"}

## 康康源码（SCSS） {#source}

```scss
{% include_relative userChrome.scss %}
```

## 有点自知之明好吗？

是的，在经历了一个月封闭测试的过程中，确实这有一些 BUG。

* 标签在不同的状态下由于透明度并不正确，而导致显示效果并不真实。
* 不能像真正的 Chrome 一样，鼠标指向标签时，离指针近的区域更不透明，远的区域更透明。
* “新建页面” 按钮并没有任何更改。
* 如果标签宽度更窄，梯度会发生变化，这是不应该出现的。

## 后记

当然，最开始这句话并不是哪位名人说的，只是我确实想不出起个什么标题，但直接写正文显得 Low，所以用个引用块包一包显得稍微高大上一点。

{% endcapture %}

<div class="mui-panel markdown-body">
	{{ md | markdownify }}
</div>

