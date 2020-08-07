---
tags: animate sci-fi "Rick and Morty" season-3
---



site.pages:

{% for page in site.pages %}

	{{ page | inspect | append: '<br>' }}

{% endfor %}

---


page.tags:

{% assign tags_div="%|%page.tags%|%" %}

{% capture mytags %}{% include group_the_strings src=page.tags div=tags_div %}{% endcapture %}

{{ mytags | split: tags_div | inspect }}

loaded mytags

100 | divided_by: 6.0 = {{ 100 | divided_by: 6.0 }}

10 | divided_by: 6.0 = {{ 10 | divided_by: 6.0 }}

1.4995 | round: 3 = {{ 1.4995 | round: 3 }}

1.2225 | round: 3 = {{ 1.2225 | round: 3 }}

1.2226 | round: 3 = {{ 1.2226 | round: 3 }}

0.1 | plus: 0.2 = {{ 0.1 | plus: 0.2 }}