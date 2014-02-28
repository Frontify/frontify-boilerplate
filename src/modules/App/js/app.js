(function($) {
  Tc.Module.App = Tc.Module.extend({

    $layout: null,

    views: [],
    routes: [],
    layouts: [],
    currentView: null,

    on: function(callback) {

        var that = this;
        var $ctx = this.$ctx;

        // Override click events for any links, and call Path.history.pushState
        // method to invoke the PathJS router.
        $ctx.on('click', 'a', function(event) {
            var route = $(this).attr('href');
            if (that.routes[route]) {
                event.preventDefault();
                var title = that.views[that.routes[route]]['title'];
                Path.history.pushState(
                    { path: route }, 
                    title, 
                    route
                );
            }
        });

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

                // initialize route mappings
                $.each(data.views, function(key, view) {
                    that.views[view.id] = view;
                    that.routes[view.route] = view.id;
                    Path.map(view.route).to(function() {
                        that.view(view.id);
                    });
                });

                // load layout configurations
                $.each(data.layouts, function(key, layout) {
                    that.layouts[layout.id] = layout;
                });

                // listen to history and fallback to hashtags if HTML5 is not supported
                Path.history.listen(true);
                Path.history.popState();
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

        // set current view id
        this.currentView = id;
        document.title = view['title'];

        // if there is a layout change, initialize it
        if (layout != view.layout) {
            var $layout = $(tmpl['layout-' + view.layout]({}));
            that.$layout.empty().append($layout);
            that.$layout.data('layout', view.layout);
            that.$layout.removeClass();
            that.$layout.addClass('mod mod-layout skin-layout-' + view.layout);

            // initialize layout
            $.each(this.layouts[view.layout].modules, function(region, modules) {
                var $region = $('[data-region="' + region + '"]', that.$layout);
                $region.empty();
                $.each(modules, function(index, module_id) {
                    if (tmpl[module_id]) {
                        $module = $(tmpl[module_id]({}));
                        $region.append($module);
                    } else {
                        console.log('module "' + module_id + '" does not exist - skipped');
                    }
                });
                that.sandbox.addModules($region);
            });

        }

        // render modules into regions
        if (view.modules) {
            $.each(view.modules, function(region, modules) {
                var $region = $('[data-region="' + region + '"]', that.$layout);
                $region.empty();
                $.each(modules, function(index, module_id) {
                    if (tmpl[module_id]) {
                        $module = $(tmpl[module_id]({}));
                        $region.append($module);
                    } else {
                        console.log('module "' + module_id + '" does not exist - skipped');
                    }
                });
                that.sandbox.addModules($region);
            });
        }
        
    }

  });
})(Tc.$);