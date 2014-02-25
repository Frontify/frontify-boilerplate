(function($) {
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