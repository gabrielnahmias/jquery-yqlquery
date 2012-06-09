/**
 * yqlQuery v1.0.0
 * http://github.com/terrasoftlabs/jquery-yqlquery
 *
 * Copyright © 2012 Gabriel Nahmias.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

( function ($) {
	
	/* OpenAuth */
	
	var OAuth;if(OAuth==null){OAuth={};}OAuth.setProperties=function setProperties(a,c){if(a!=null&&c!=null){for(var b in c){a[b]=c[b];}}return a;};OAuth.setProperties(OAuth,{percentEncode:function percentEncode(b){if(b==null){return"";}if(b instanceof Array){var c="";for(var a=0;a<b.length;++b){if(c!=""){c+="&";}c+=OAuth.percentEncode(b[a]);}return c;}b=encodeURIComponent(b);b=b.replace(/\!/g,"%21");b=b.replace(/\*/g,"%2A");b=b.replace(/\'/g,"%27");b=b.replace(/\(/g,"%28");b=b.replace(/\)/g,"%29");return b;},decodePercent:function decodePercent(a){if(a!=null){a=a.replace(/\+/g," ");}return decodeURIComponent(a);},getParameterList:function getParameterList(a){if(a==null){return[];}if(typeof a!="object"){return OAuth.decodeForm(a+"");}if(a instanceof Array){return a;}var b=[];for(var c in a){b.push([c,a[c]]);}return b;},getParameterMap:function getParameterMap(b){if(b==null){return{};}if(typeof b!="object"){return OAuth.getParameterMap(OAuth.decodeForm(b+""));}if(b instanceof Array){var d={};for(var c=0;c<b.length;++c){var a=b[c][0];if(d[a]===undefined){d[a]=b[c][1];}}return d;}return b;},getParameter:function getParameter(b,a){if(b instanceof Array){for(var c=0;c<b.length;++c){if(b[c][0]==a){return b[c][1];}}}else{return OAuth.getParameterMap(b)[a];}return null;},formEncode:function formEncode(b){var a="";var d=OAuth.getParameterList(b);for(var f=0;f<d.length;++f){var c=d[f][1];if(c==null){c="";}if(a!=""){a+="&";}a+=OAuth.percentEncode(d[f][0])+"="+OAuth.percentEncode(c);}return a;},decodeForm:function decodeForm(d){var g=[];var i=d.split("&");for(var h=0;h<i.length;++h){var a=i[h];if(a==""){continue;}var c=a.indexOf("=");var b;var f;if(c<0){b=OAuth.decodePercent(a);f=null;}else{b=OAuth.decodePercent(a.substring(0,c));f=OAuth.decodePercent(a.substring(c+1));}g.push([b,f]);}return g;},setParameter:function setParameter(c,a,d){var b=c.parameters;if(b instanceof Array){for(var f=0;f<b.length;++f){if(b[f][0]==a){if(d===undefined){b.splice(f,1);}else{b[f][1]=d;d=undefined;}}}if(d!==undefined){b.push([a,d]);}}else{b=OAuth.getParameterMap(b);b[a]=d;c.parameters=b;}},setParameters:function setParameters(c,b){var d=OAuth.getParameterList(b);for(var a=0;a<d.length;++a){OAuth.setParameter(c,d[a][0],d[a][1]);}},completeRequest:function completeRequest(b,a){if(b.method==null){b.method="GET";}var c=OAuth.getParameterMap(b.parameters);if(c.oauth_consumer_key==null){OAuth.setParameter(b,"oauth_consumer_key",a.consumerKey||"");}if(c.oauth_token==null&&a.token!=null){OAuth.setParameter(b,"oauth_token",a.token);}if(c.oauth_version==null){OAuth.setParameter(b,"oauth_version","1.0");}if(c.oauth_timestamp==null){OAuth.setParameter(b,"oauth_timestamp",OAuth.timestamp());}if(c.oauth_nonce==null){OAuth.setParameter(b,"oauth_nonce",OAuth.nonce(6));}OAuth.SignatureMethod.sign(b,a);},setTimestampAndNonce:function setTimestampAndNonce(a){OAuth.setParameter(a,"oauth_timestamp",OAuth.timestamp());OAuth.setParameter(a,"oauth_nonce",OAuth.nonce(6));},addToURL:function addToURL(a,c){newURL=a;if(c!=null){var b=OAuth.formEncode(c);if(b.length>0){var d=a.indexOf("?");if(d<0){newURL+="?";}else{newURL+="&";}newURL+=b;}}return newURL;},getAuthorizationHeader:function getAuthorizationHeader(a,c){var h='OAuth realm="'+OAuth.percentEncode(a)+'"';var d=OAuth.getParameterList(c);for(var f=0;f<d.length;++f){var g=d[f];var b=g[0];if(b.indexOf("oauth_")==0){h+=","+OAuth.percentEncode(b)+'="'+OAuth.percentEncode(g[1])+'"';}}return h;},correctTimestampFromSrc:function correctTimestampFromSrc(b){b=b||"oauth_timestamp";var a=document.getElementsByTagName("script");if(a==null||!a.length){return;}var f=a[a.length-1].src;if(!f){return;}var d=f.indexOf("?");if(d<0){return;}parameters=OAuth.getParameterMap(OAuth.decodeForm(f.substring(d+1)));var c=parameters[b];if(c==null){return;}OAuth.correctTimestamp(c);},correctTimestamp:function correctTimestamp(a){OAuth.timeCorrectionMsec=(a*1000)-(new Date()).getTime();},timeCorrectionMsec:0,timestamp:function timestamp(){var a=(new Date()).getTime()+OAuth.timeCorrectionMsec;return Math.floor(a/1000);},nonce:function nonce(f){var d=OAuth.nonce.CHARS;var a="";for(var c=0;c<f;++c){var b=Math.floor(Math.random()*d.length);a+=d.substring(b,b+1);}return a;}});OAuth.nonce.CHARS="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";OAuth.declareClass=function declareClass(d,a,c){var f=d[a];d[a]=c;if(c!=null&&f!=null){for(var b in f){if(b!="prototype"){c[b]=f[b];}}}return c;};OAuth.declareClass(OAuth,"SignatureMethod",function OAuthSignatureMethod(){});OAuth.setProperties(OAuth.SignatureMethod.prototype,{sign:function sign(c){var b=OAuth.SignatureMethod.getBaseString(c);var a=this.getSignature(b);OAuth.setParameter(c,"oauth_signature",a);return a;},initialize:function initialize(c,a){var b;if(a.accessorSecret!=null&&c.length>9&&c.substring(c.length-9)=="-Accessor"){b=a.accessorSecret;}else{b=a.consumerSecret;}this.key=OAuth.percentEncode(b)+"&"+OAuth.percentEncode(a.tokenSecret);}});OAuth.setProperties(OAuth.SignatureMethod,{sign:function sign(c,a){var b=OAuth.getParameterMap(c.parameters).oauth_signature_method;if(b==null||b==""){b="HMAC-SHA1";OAuth.setParameter(c,"oauth_signature_method",b);}OAuth.SignatureMethod.newMethod(b,a).sign(c);},newMethod:function newMethod(d,a){var c=OAuth.SignatureMethod.REGISTERED[d];if(c!=null){var h=new c();h.initialize(d,a);return h;}var g=new Error("signature_method_rejected");var b="";for(var f in OAuth.SignatureMethod.REGISTERED){if(b!=""){b+="&";}b+=OAuth.percentEncode(f);}g.oauth_acceptable_signature_methods=b;throw g;},REGISTERED:{},registerMethodClass:function registerMethodClass(b,a){for(var c=0;c<b.length;++c){OAuth.SignatureMethod.REGISTERED[b[c]]=a;}},makeSubclass:function makeSubclass(a){var b=OAuth.SignatureMethod;var c=function(){b.call(this);};c.prototype=new b();c.prototype.getSignature=a;c.prototype.constructor=c;return c;},getBaseString:function getBaseString(g){var b=g.action;var h=b.indexOf("?");var f;if(h<0){f=g.parameters;}else{f=OAuth.decodeForm(b.substring(h+1));var d=OAuth.getParameterList(g.parameters);for(var c=0;c<d.length;++c){f.push(d[c]);}}return OAuth.percentEncode(g.method.toUpperCase())+"&"+OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(b))+"&"+OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(f));},normalizeUrl:function normalizeUrl(c){var d=OAuth.SignatureMethod.parseUri(c);var a=d.protocol.toLowerCase();var g=d.authority.toLowerCase();var h=(a=="http"&&d.port==80)||(a=="https"&&d.port==443);if(h){var b=g.lastIndexOf(":");if(b>=0){g=g.substring(0,b);}}var f=d.path;if(!f){f="/";}return a+"://"+g+f;},parseUri:function parseUri(f){var d={key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/}};var a=d.parser.strict.exec(f);var c={};var b=14;while(b--){c[d.key[b]]=a[b]||"";}return c;},normalizeParameters:function normalizeParameters(d){if(d==null){return"";}var f=OAuth.getParameterList(d);var h=[];for(var g=0;g<f.length;++g){var b=f[g];if(b[0]!="oauth_signature"){h.push([OAuth.percentEncode(b[0])+" "+OAuth.percentEncode(b[1]),b]);}}h.sort(function(j,i){if(j[0]<i[0]){return -1;}if(j[0]>i[0]){return 1;}return 0;});var a=[];for(var c=0;c<h.length;++c){a.push(h[c][1]);}return OAuth.formEncode(a);}});OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT","PLAINTEXT-Accessor"],OAuth.SignatureMethod.makeSubclass(function getSignature(a){return this.key;}));OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1","HMAC-SHA1-Accessor"],OAuth.SignatureMethod.makeSubclass(function getSignature(b){b64pad="=";var a=b64_hmac_sha1(this.key,b);return a;}));try{OAuth.correctTimestampFromSrc();}catch(e){}
	
	/* SHA1 */
	
	var hexcase=0;var b64pad="";var chrsz=8;function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length*chrsz));}function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length*chrsz));}function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length*chrsz));}function hex_hmac_sha1(key,data){return binb2hex(core_hmac_sha1(key,data));}function b64_hmac_sha1(key,data){return binb2b64(core_hmac_sha1(key,data));}function str_hmac_sha1(key,data){return binb2str(core_hmac_sha1(key,data));}function sha1_vm_test(){return hex_sha1("abc")=="a9993e364706816aba3e25717850c26c9cd0d89d";}function core_sha1(x,len){x[len>>5]|=0x80<<(24-len%32);x[((len+64>>9)<<4)+15]=len;var w=Array(80);var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;var e=-1009589776;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;var olde=e;for(var j=0;j<80;j++){if(j<16)w[j]=x[i+j];else w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);var t=safe_add(safe_add(rol(a,5),sha1_ft(j,b,c,d)),safe_add(safe_add(e,w[j]),sha1_kt(j)));e=d;d=c;c=rol(b,30);b=a;a=t;}a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);e=safe_add(e,olde);}return Array(a,b,c,d,e);}function sha1_ft(t,b,c,d){if(t<20)return(b&c)|((~b)&d);if(t<40)return b^c^d;if(t<60)return(b&c)|(b&d)|(c&d);return b^c^d;}function sha1_kt(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;}function core_hmac_sha1(key,data){var bkey=str2binb(key);if(bkey.length>16)bkey=core_sha1(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}var hash=core_sha1(ipad.concat(str2binb(data)),512+data.length*chrsz);return core_sha1(opad.concat(hash),512+160);}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}function str2binb(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(32-chrsz-i%32);return bin;}function binb2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)str+=String.fromCharCode((bin[i>>5]>>>(32-chrsz-i%32))&mask);return str;}function binb2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8))&0xF);}return str;}function binb2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F);}}return str;}
	
	var sErrorPrefix = "$.yql: ";
	
	var methods = {
		
		getHTML: function(oOptions) {
			
			var sURL = oOptions.url;
			
			oOptions.query = "select * from html where url='" + sURL + "'";
			
			$.yql(oOptions);
			
		},
		
		OAuthURL: function(sCK, sCKS, sStatement) {
			
			var oAccessor = {
				
				consumerSecret: sCKS,
				
				tokenSecret: ""
				
			};          
			
			var oMessage = {
				
				action: sStatement,
				
				method: "GET",
				
				parameters: [
					
					["oauth_version", "1.0"],
					
					["oauth_consumer_key", sCK]
					
				]
				
			};
		 
			OAuth.setTimestampAndNonce(oMessage);
			OAuth.SignatureMethod.sign(oMessage, oAccessor);
		 
			var oParams = OAuth.getParameterMap(oMessage);
			var sBase = OAuth.decodeForm(OAuth.SignatureMethod.getBaseString(oMessage));           
			var sSig = "";
		 
			if (oParams.parameters) {
				
				for (var oItem in oParams.parameters) {
					
					for (var oSub in oParams.parameters[oItem]) {
						
						if (oParams.parameters[oItem][oSub] == "oauth_signature") {
							
							sSig = oParams.parameters[oItem][1];                    
							
							break;                      
							
						}
						
					}
					
				}
				
			}
			
			var aParams = sBase[2][0].split("&");
			
			aParams.push( "oauth_signature="+ encodeURIComponent(sSig) );
			
			aParams.sort( function(a, b) {
				
				if (a[0] < b[0]) return -1;
				if (a[0] > b[0]) return 1;
				if (a[1] < b[1]) return  -1;
				if (a[1] > b[1]) return 1;
				
				return 0;
				
			} );
		 	
			var sLoc = "";
			
			for (var x in aParams)
				sLoc += aParams[x] + "&";                
			
			var sFinal = sBase[1][0] + "?" + sLoc.slice(0, sLoc.length - 1);
		 
			return sFinal;
			
		},
		
		query: function(oOptions) {
			
			// Fucking magic.
			
			var oSettings = $.extend( {
				
				format: "json"
				
			}, oOptions );
			
			var sFormat = oSettings.format;
			var sQuery = oSettings.query;
			var sYQLURL = methods.yqlURL( { query: oSettings.query, format: sFormat } );
			
			var sURL;
			
			
			if (oSettings.key && oSettings.secret)
				sURL = methods.OAuthURL(oSettings.key, oSettings.secret , sYQLURL);
			else
				sURL = sYQLURL;
			
			$.ajax( {
				
				url: sURL,
				
				dataType: sFormat,
				
				success: ( (oSettings.success) ? function(data) { oSettings.success(data) } : function() { } )
				
			} );
			
		},
		
		yqlURL: function (oOptions) {
			
			var sFormat = oOptions.format;
			var sQuery = oOptions.query;
			
			if (!sQuery)
				throw new Error(sErrorPrefix + 'No query specified for method "yqlURL."');
			
			var sEncoded = encodeURIComponent( sQuery.toLowerCase() ),
				sURL = 'http://query.yahooapis.com/v1/public/yql?q=' + sEncoded + '&env=http://datatables.org/alltables.env&format=' + sFormat;
			
			return sURL;
			
		},
		
	};

	$.yql = function (method) {

		if ( methods[method] )
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1) );
		else if (typeof method === 'object' || !method)
			return methods.query.apply(this, arguments);
		else
			$.error('Method ' + method + ' does not exist in jQuery.yql.');
		
	};

} )(jQuery);