require 'cgi'

module LEORChnBaseLib
  def isNumber(text)
    text.to_s[Regexp.new('\d+'), 0] == text
  end
end

Liquid::Template.register_filter(LEORChnBaseLib)


module JavaScriptLib
	def unescape(text)
		CGI.unescapeHTML(text)  # thanks to https://stackoverflow.com/questions/32065012/ruby-unescape-html-string
	end
end

Liquid::Template.register_filter(JavaScriptLib)
