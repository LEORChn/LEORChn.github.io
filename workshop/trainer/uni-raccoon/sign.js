
// Source: https://vueact-qr.uni-market.com/static/js/app.a70d176972b28082b02a.js
// Extract on: 2021-6-16

function sign(t){
	function I(t, e) {
		var n = (65535 & t) + (65535 & e);
		return (t >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n
	}
	function E(t, e, n, a, i, o) {
		return I((r = I(I(e, t), I(a, o))) << (s = i) | r >>> 32 - s, n);
		var r, s
	}
	function z(t, e, n, a, i, o, r) {
		return E(e & n | ~e & a, t, e, i, o, r)
	}
	function S(t, e, n, a, i, o, r) {
		return E(e & a | n & ~a, t, e, i, o, r)
	}
	function M(t, e, n, a, i, o, r) {
		return E(e ^ n ^ a, t, e, i, o, r)
	}
	function T(t, e, n, a, i, o, r) {
		return E(n ^ (e | ~a), t, e, i, o, r)
	}
	function B(t, e) {
		t[e >> 5] |= 128 << e % 32,
		t[14 + (e + 64 >>> 9 << 4)] = e;
		var n, a, i, o, r, s = 1732584193,
		c = -271733879,
		d = -1732584194,
		l = 271733878;
		for (n = 0; n < t.length; n += 16) a = s,
		i = c,
		o = d,
		r = l,
		c = T(c = T(c = T(c = T(c = M(c = M(c = M(c = M(c = S(c = S(c = S(c = S(c = z(c = z(c = z(c = z(c, d = z(d, l = z(l, s = z(s, c, d, l, t[n], 7, -680876936), c, d, t[n + 1], 12, -389564586), s, c, t[n + 2], 17, 606105819), l, s, t[n + 3], 22, -1044525330), d = z(d, l = z(l, s = z(s, c, d, l, t[n + 4], 7, -176418897), c, d, t[n + 5], 12, 1200080426), s, c, t[n + 6], 17, -1473231341), l, s, t[n + 7], 22, -45705983), d = z(d, l = z(l, s = z(s, c, d, l, t[n + 8], 7, 1770035416), c, d, t[n + 9], 12, -1958414417), s, c, t[n + 10], 17, -42063), l, s, t[n + 11], 22, -1990404162), d = z(d, l = z(l, s = z(s, c, d, l, t[n + 12], 7, 1804603682), c, d, t[n + 13], 12, -40341101), s, c, t[n + 14], 17, -1502002290), l, s, t[n + 15], 22, 1236535329), d = S(d, l = S(l, s = S(s, c, d, l, t[n + 1], 5, -165796510), c, d, t[n + 6], 9, -1069501632), s, c, t[n + 11], 14, 643717713), l, s, t[n], 20, -373897302), d = S(d, l = S(l, s = S(s, c, d, l, t[n + 5], 5, -701558691), c, d, t[n + 10], 9, 38016083), s, c, t[n + 15], 14, -660478335), l, s, t[n + 4], 20, -405537848), d = S(d, l = S(l, s = S(s, c, d, l, t[n + 9], 5, 568446438), c, d, t[n + 14], 9, -1019803690), s, c, t[n + 3], 14, -187363961), l, s, t[n + 8], 20, 1163531501), d = S(d, l = S(l, s = S(s, c, d, l, t[n + 13], 5, -1444681467), c, d, t[n + 2], 9, -51403784), s, c, t[n + 7], 14, 1735328473), l, s, t[n + 12], 20, -1926607734), d = M(d, l = M(l, s = M(s, c, d, l, t[n + 5], 4, -378558), c, d, t[n + 8], 11, -2022574463), s, c, t[n + 11], 16, 1839030562), l, s, t[n + 14], 23, -35309556), d = M(d, l = M(l, s = M(s, c, d, l, t[n + 1], 4, -1530992060), c, d, t[n + 4], 11, 1272893353), s, c, t[n + 7], 16, -155497632), l, s, t[n + 10], 23, -1094730640), d = M(d, l = M(l, s = M(s, c, d, l, t[n + 13], 4, 681279174), c, d, t[n], 11, -358537222), s, c, t[n + 3], 16, -722521979), l, s, t[n + 6], 23, 76029189), d = M(d, l = M(l, s = M(s, c, d, l, t[n + 9], 4, -640364487), c, d, t[n + 12], 11, -421815835), s, c, t[n + 15], 16, 530742520), l, s, t[n + 2], 23, -995338651), d = T(d, l = T(l, s = T(s, c, d, l, t[n], 6, -198630844), c, d, t[n + 7], 10, 1126891415), s, c, t[n + 14], 15, -1416354905), l, s, t[n + 5], 21, -57434055), d = T(d, l = T(l, s = T(s, c, d, l, t[n + 12], 6, 1700485571), c, d, t[n + 3], 10, -1894986606), s, c, t[n + 10], 15, -1051523), l, s, t[n + 1], 21, -2054922799), d = T(d, l = T(l, s = T(s, c, d, l, t[n + 8], 6, 1873313359), c, d, t[n + 15], 10, -30611744), s, c, t[n + 6], 15, -1560198380), l, s, t[n + 13], 21, 1309151649), d = T(d, l = T(l, s = T(s, c, d, l, t[n + 4], 6, -145523070), c, d, t[n + 11], 10, -1120210379), s, c, t[n + 2], 15, 718787259), l, s, t[n + 9], 21, -343485551),
		s = I(s, a),
		c = I(c, i),
		d = I(d, o),
		l = I(l, r);
		return [s, c, d, l]
	}
	function Y(t) {
		var e, n = "";
		for (e = 0; e < 32 * t.length; e += 8) n += String.fromCharCode(t[e >> 5] >>> e % 32 & 255);
		return n
	}
	function D(t) {
		var e, n = [];
		for (n[(t.length >> 2) - 1] = void 0, e = 0; e < n.length; e += 1) n[e] = 0;
		for (e = 0; e < 8 * t.length; e += 8) n[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32;
		return n
	}
	function F(t) {
		var e, n, a = "";
		for (n = 0; n < t.length; n += 1) e = t.charCodeAt(n),
		a += "0123456789abcdef".charAt(e >>> 4 & 15) + "0123456789abcdef".charAt(15 & e);
		return a
	}
	function N(t) {
		return unescape(encodeURIComponent(t))
	}
	function P(t) {
		return function(t) {
			return Y(B(D(t), 8 * t.length))
		} (N(t))
	}
	return F(P(t)).toUpperCase();
}
