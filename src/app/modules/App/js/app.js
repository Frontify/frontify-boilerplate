(function($) {
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
})(Tc.$);