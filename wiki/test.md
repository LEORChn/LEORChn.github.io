site.pages:

{% for page in site.pages %}
	{{ page | inspect | append: '<hr>' }}
{% endfor %}

<hr><hr><hr><hr><hr>

site.tags:

{% for tag in site.tags %}
	{{ tag | inspect | append: '<hr>' }}
{% endfor %}

