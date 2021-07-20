---
layout: blank
permalink: /home/
---
<div align="center">
	<div style="width:100%;height:auto">
		<div id="blog" align="left" style="background-color:white;padding:0px 20px 20px;position:relative">
			<div class="watermarkTopRight" onselectstart="return false">Recent</div>
			<div class="h1">
				<div style="display:inline">最近发布</div>
				<span style="font-size: medium">
					<img src="img/rss.svg" style="height: 1.5em; vertical-align: bottom">
					RSS订阅:
				</span>
				<a href="/atom.xml" style="font-size:medium">文章推送</a>
				<a href="https://github.com/LEORChn/LEORChn.github.io/commits/master.atom" style="font-size:medium">整站更新</a>
			</div>
			<br>
			<div class="grid" masonry gutter="10" itemselector=".grid-item" columnwidth=".sizer">
				<div class="sizer mui-panel"></div>
{% assign diary_output = '' %}
{% capture nospace %}
	{% for row in site.data.diary %}
		<!-- ========== 行开始：提取当前行字符串 ========== -->
		{% assign diary_content = nil %}
		{% for col in row %}
			{% unless diary_content %}
				{% assign diary_content = col[1] %}
			{% else %}
				{% assign diary_content = diary_content | append: ',' | append: col[1] %}
			{% endunless %}
		{% endfor %}
		{% assign plain_output = plain_output | append: diary_content %}
		
		<!-- 判断行类型 -->
		{% assign cmd = diary_content | split: ' ' %}
		{% assign exec = cmd | first %}
		{% case exec %}
			{% when 'y' %}
				{% assign diary_year = cmd[1] %}
			{% when 'm' %}
				{% assign diary_month = cmd[1] %}
			{% else %}
				{% assign tmp = cmd[0] %}
				{% include isNumber src=tmp %}
				{% assign diary_is_day = isNumber %}
				{% if diary_is_day -%}
				
					{% if diary_hold %}
						<!-- 新建日记之前，结束上一篇日记 -->
						{% assign diary_output = diary_output | append: diary_hold %}
						{% assign diary_hold = nil %}
					{% endif %}
					
					<!-- 新建日记 -->
					{% assign diary_day = cmd[0] %}
					{% assign diary_title = '' %}
					{% assign tmp = cmd | last %}
					{% include isNumber src=tmp %}
					{% assign diary_is_weekday = isNumber %}
					{% unless diary_is_weekday %}
						{% assign diary_title = cmd | last %}
					{% endunless %}
					{% if diary_title.size == 0 %}
						{% capture diary_title %}{{ diary_year }}年{{ diary_month }}月{{ diary_day }}日记{% endcapture %}
					{% endif %}
					{% continue %}
				{% endif %}
				
				<!-- 添加正文 -->
				{% assign diary_content_first = diary_content | slice: 0 %}
				{% if diary_content_first != '<' %}
					{% assign diary_content = diary_content | escape %}
				{% else %}
					{% assign tmp = diary_content %}
					{% capture diary_content %}{% include unescape src=diary_content %}{% endcapture %}
				{% endif %}
				{% capture diary_item_output %}
					{%- unless diary_hold %}
				<div class="post grid-item mui-panel">
					<div class="title">{{ diary_title }}</div>
					<div class="content">
					{%- endunless %}
					<p>{{- diary_content -}}</p>
				{% endcapture %}
				{% capture diary_hold -%}
					</div>
				</div>
				{% endcapture %}
				{% assign diary_output = diary_output | append: diary_item_output %}
		{% endcase %}
	{% endfor %}
{% endcapture %}
{{- diary_output }}{{ diary_hold }}
			</div>
		</div>
	</div>
</div>
<style>
iframe, earth{
	width: 100%;
	height: 240px;
	border: 0;
	background-color: #eee;
}
earth{
	display: block;
	border: solid 1px #888;
}
.sizer{
	visibility: hidden
}
.post{
	overflow-wrap: break-word;
	background-color: rgba(0,0,0,0);
	line-height:1.5em;
}
.post > .title{
	text-align: center
}
.post > .content:before{
	content: '\201c';
	font-size: 2em;
	font-family: "monospace";
	position: absolute;
	color: #999999;
}
.post > .content > p{
	text-indent: 2em;
	margin: .5em 0;
}
.post > .content iframe{
	width: 100%;
	border: 0;
	margin-left: -2em;
}

/* 列宽 width 应该为：Math.floor(1 / 列数 x 100%) - item左右padding - (间隔值 x 间隔数量 x Math.floor(间隔数量 / 列数)) */
.sizer, .grid-item{
	width:calc(100% - 30px)
}
@media (min-width:500px){
	.sizer, .grid-item{
		width:calc(50% - 30px - 5px)
	}
}
@media (min-width:800px){
	.sizer, .grid-item{
		width:calc(33% - 30px - 6px)
	}
}
</style>
