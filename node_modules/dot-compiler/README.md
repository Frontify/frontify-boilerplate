#dot-compiler

Forked from [slawekkolodziej/dot-module](https://github.com/slawekkolodziej/dot-module). 

dot-compiler help you transform your templates directory into one JST object containing all yours template(*.jst) files. 



### Installation:

```	
npm install -g dot-compiler
```

###Usage:  

```
dot-module [-d <dir>] [-o <output>] [-g <global>]
```



###Options:


```
-d <source-dir> : source directory, default to current directory

-o <output>     : output filename, default is "templates.js"

-g <global>     : variable to hold the templates, default is "window.JST"
```

###Example:
	
Create a [doT.js](http://olado.github.io/doT/index.html) template (templates/sample.jst).  Templates must have a .jst extension.

```
	<ul id="scores">
		{{~it.scores:score:index}}
			<li>{{=score}}</li>
		{{~}}
	</ul>
```

```
$ dot-compiler -d templates/
```
	
Once you include the templates.js module to your code, you can access the template like this:

```
JST.sample('999');
```
