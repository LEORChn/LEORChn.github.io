# A regex function for Jekyll.
# This file should be put at: /githubpages.github.io/_plugins/jekyll_regex.rb

# Special Thanks To:
# match_regex    v0.1.0  https://github.com/sparanoid/match_regex/blob/master/lib/match_regex.rb
# replace_regex  v0.1.0  https://github.com/sparanoid/replace_regex/blob/master/lib/replace_regex.rb

module LEORChnRegex
  def match_regex(text, regex)
    text.to_s[Regexp.new(regex), 0]
  end
  def replace_regex(text, regex, new = '')
    text.to_s.gsub(Regexp.new(regex), new.to_s)
  end
end

Liquid::Template.register_filter(LEORChnRegex)
