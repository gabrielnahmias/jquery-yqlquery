yqlQuery
=============

**yqlQuery** is a **jQuery _plugin_** that, by using <a href="http://developer.yahoo.com/yql/">Yahoo! Query Language</a>,
can allow you to bypass most normal boundaries imposed by cross-site scripting (XSS) rules and request a whole bunch of other data.

You can find an incredibly _useful_ example of **yqlQuery** at [5dayoptions' website](http://5dayoptions.com) in the stock ticker.  _Howboutdat?_

What does it do?
-----------

* Makes it possible to load other site's HTML through JavaScript.  _Easily_.
* Lets you optionally request through authorized Yahoo! Developer Network keys and secrets (allows 20,000 API calls per hour as opposed to 2,000 with the public version).
* Possesses a framework that could make all sorts of categories of things to load possible.
* Unwaveringly forces massive crowds to idolize you.

How to use it
-----------

Before doing anything, you must include **jQuery** and **jquery.yqlquery.js** (or the minified version, **jquery.yqlquery.min.js**) on your page like so

```javascript
<script language="javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
<script language="javascript" src="jquery.yqlquery.js" type="text/javascript"></script>
```

Finally, _that's_ over; we can move right on to the other stuff.

Examples
-----------

The structure of using yqlQuery goes like this:

```javascript
$.yql( {
	
	format: "json",
	
	key: KEY,
	
	query: "select * from yahoo.finance.quotes where symbol in ('AAPL', 'GOOG', 'MSFT')",
	
	secret: SECRET,
	
	success: function(data) {
		
		console.debug(data);
		
	}
	
} );
```

**NOTE:** `query` is the only required property.  That makes `key`, `format` (assumed `"json"`), and `secret` not so (neither is `success` but... _wtf_).

The previous code loads some stock information and logs it to the console. ```query``` is, of course, the query to run,
```success``` is the callback function, ```format``` is the type in which the data should be returned (`"json"`, `"text"`, `"xml"`, ...), ```key``` and
```secret``` have to do with if you register an official application, and success is as mentioned before.  The argument
passed to the success function is the data which has been loaded.  There's also a built-in function called ```getHTML```
which goes a little something like this:

```javascript
$.yql( "getHTML" , {
	
	format: "text",
	
	success: function(data) {
		
		$("body").html(data);
		
	},
	
	url: "http://www.google.com"
	
} );
```

Wuddyaknow?  You just loaded Google's homepage into your body tag.  Check out the repository for an example of this in action!

You can perfrom really fun requests in a snap with _zero_ filler by doing something like this:

```javascript
var a;$.yql({async: false,query:"select * from yahoo.finance.quotes where symbol in ('MSFT')",success:function(data){a=data;}})
```

**Bam**.  You just got the most recent stock information for **Microsoft** and stored it in `a`.  _<span style="font-variant: small-caps;">How do you feel now</span>?_

```javascript

if ( parseFloat(a.query.results.quote.LastTradePriceOnly) < 5 )
	alert("OMG, buy some Microsoft stock.  It's cheap as hell right now.");

```

Fun, right?

Browser support
-----------

* All that jQuery supports.

License
-----------

Public domain

Acknowledgements
------------

yqlQuery is a project by [Gabriel Nahmias](http://github.com/terrasoftlabs "Terrasoft's GitHub"), co-founder of Terrasoft.