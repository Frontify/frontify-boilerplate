var tmpl = (function(){
function encodeHTMLSource() {  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },  matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;  return function() {    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;  };};
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl = {};
  tmpl['layout-default']=function anonymous(it) {
var out='<header class="row" data-region="header"></header><div class="row" data-region="content"></div><footer class="row" data-region="footer"></footer>';return out;
};
  tmpl['logo']=function anonymous(it) {
var out='<div class="mod mod-logo"><a href="#/">Logo</a></div>';return out;
};
  tmpl['navigation-items']=function anonymous(it) {
var out='';var arr1=it.items;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+='<li class="item"><a href="#'+(item.link)+'"><span>'+(item.label)+'</span></a>';if(item.items){out+='<ul class="nav-sub">';var arr2=item.items;if(arr2){var subitem,subindex=-1,l2=arr2.length-1;while(subindex<l2){subitem=arr2[subindex+=1];out+='<li class="item"><a href="#'+(subitem.link)+'"><span>'+(subitem.label)+'</span></a></li>';} } out+='</ul>';}out+='</li>';} } return out;
};
  tmpl['navigation']=function anonymous(it) {
var out='<div class="mod mod-navigation" data-url="/api/navigation/main.json"><nav><ul class="nav"></ul></nav></div>';return out;
};
return tmpl;})();(function($) {
  Tc.Module.App = Tc.Module.extend({

    views: [],
    $layout: null,
    loading: false,

    on: function(callback) {
        var that = this;
        callback();
    },

    after: function() {
        var that = this;
        this.$layout = $('.mod-layout');
        Path.rescue(that.rescue);
        $.ajax({
            url: '/api/app/views.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                $.each(data.views, function(key, view) {
                    that.views[view.id + ''] = view;
                    Path.map("#" + view.route).to(function(){
                        that.view(view.id);
                    });
                });
                Path.listen();
            }
        });
    },

    rescue: function() {
        console.log('view not found');
    },

    view: function(id) {
        var that = this;
        var view = this.views[id];
        var layout = this.$layout.data('layout');
        document.title = view.title;

        var new_layout = view.layout != null ? view.layout : 'iframe';
        if (layout != new_layout) {
            var $layout = $(tmpl['layout-' + new_layout]({}));
            that.$layout.empty().append($layout);
            that.$layout.data('layout', new_layout);
            that.$layout.removeClass();
            that.$layout.addClass('mod mod-layout skin-layout-' + new_layout);
        }

        // render modules into regions
        var new_modules = [];
        if (view.modules) {
            $.each(view.modules, function(region, modules) {
                if (false && layout == new_layout && (region == 'header' || region == 'footer')) {
                    // noop
                } else {
                    var $region = $('[data-region="' + region + '"]', that.$layout);
                    $region.empty();
                    $.each(modules, function(index, module_id) {
                        if (tmpl[module_id]) {
                            $module = $(tmpl[module_id]({}));
                            $region.append($module);
                            new_modules.push($module);
                        } else {
                            console.log('module "' + module_id + '" does not exist - skipped');
                        }
                    });
                    that.sandbox.addModules($region);
                }
            });

            // translate strings
            var $strings = $('[data-localize]', that.$layout);
            $.each($strings, function(key, string) {
                var func = window.i18n[string.getAttribute('data-localize') || string.innerHTML];
                if (func) {
                    string.innerHTML = func({});
                }
            });
        }
    }

  });
})(Tc.$);(function($) {
  Tc.Module.Navigation = Tc.Module.extend({

  	$nav: null,

    on: function(callback) {
    	this.$nav = $('.nav', this.$ctx);
        callback();
    },

    after: function() {
    	this.refresh();
    },
    
    refresh: function() {
    	var $ctx = this.$ctx;
    	var that = this;
    	$.ajax({
    		url: $ctx.data('url'),
    		method: 'GET',
    		dataType: 'json',
    		success: function(data) {
    			var $items = $(tmpl['navigation-items'](data));
    			that.$nav.empty().append($items);
    		}
    	});
    }

  });
})(Tc.$);