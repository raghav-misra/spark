  //Util
  function load(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) success(JSON.parse(xhr.responseText));
			} else {
				if (error) error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
var querystring={parse:function(a){var b={};if(a=void 0!==a?a:window.location.search,"string"==typeof a&&a.length>0){"?"===a[0]&&(a=a.substring(1)),a=a.split("&");for(var c=0,d=a.length;d>c;c++){var e,f,g=a[c],h=g.indexOf("=");h>=0?(e=g.substr(0,h),f=g.substr(h+1)):(e=g,f=""),f=decodeURIComponent(f),void 0===b[e]?b[e]=f:b[e]instanceof Array?b[e].push(f):b[e]=[b[e],f]}}return b},stringify:function(a){var b=[];if(a&&a.constructor===Object)for(var c in a)if(a[c]instanceof Array)for(var d=0,e=a[c].length;e>d;d++)b.push([encodeURIComponent(c),encodeURIComponent(a[c][d])].join("="));else b.push([encodeURIComponent(c),encodeURIComponent(a[c])].join("="));return b.join("&")}};