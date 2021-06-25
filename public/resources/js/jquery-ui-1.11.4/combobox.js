$.widget( "custom.combobox", {
	options: {
		iwidth:50,
		iheight:17,
		bwidth:32,
		bheight:19,
		scss:null,
		iblur:null,
		ireadonly:null,
		icss:null,
		icssClassName:null,
		bcss:null,
		bcssClassName:null,
		layerId:null,
	},
	_create: function() {
		this.wrapper = $( "<span>" )
		.addClass( "custom-combobox" )
		.insertAfter( this.element );
		if(this.options.scss != null) {
			this.wrapper.css(this.options.scss);
		}

		this.element.hide();
		this._createAutocomplete();
		this._createShowAllButton();
	},

	_createAutocomplete: function() {
		var selected = this.element.children( ":selected" ),
		value = selected.val() ? selected.text() : "";
		var acopt = {
				delay: 0,
				minLength: 0,
				source: $.proxy( this, "_source" ),
				appendTo: "#" + this.options.layerId,
		};

		this.input = $( "<input>" )
		.appendTo( this.wrapper )
		.val( value )
		.attr( "title", "" )
//		.addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
		.autocomplete(acopt)
		.css({"width":this.options.iwidth + "px", "height":this.options.iheight + "px"})
		.tooltip({
			tooltipClass: "ui-state-highlight"
		});
		if(this.options.icss != null) {
			this.input.css(this.options.icss);
		}
		if(this.options.icssClassName != null) {
			this.input.addClass(this.options.icssClassName);
		}
		if(this.options.iblur != null) {
			this.input.on("blur", {"blur":this.options.iblur, "selected":this.element}, function(e) {
				e.data.blur(e.data.selected);
			});
		}
		if(this.options.ireadonly != null) {
			this.input.prop("readonly", this.options.ireadonly);
		}
		
		this._on( this.input, {
			autocompleteselect: function( event, ui ) {
				ui.item.option.selected = true;
				this._trigger( "select", event, {
					item: ui.item.option
				});
				this.input.trigger("blur");
			},

			autocompletechange: "_removeIfInvalid"
		});
	},

	_createShowAllButton: function() {
		var input = this.input,
		wasOpen = false;

		this.a = $( "<a>" )
		.attr( "tabIndex", -1 )
		.attr( "title", "" )
		.tooltip()
		.appendTo( this.wrapper )
		.button({
			icons: {
				primary: "ui-icon-triangle-1-s"
			},
			text: false
		})
		.removeClass( "ui-corner-all" )
//		.addClass( "custom-combobox-toggle ui-corner-right" )
		.mousedown(function() {
			wasOpen = input.autocomplete( "widget" ).is( ":visible" );
		})
		.css({"width":this.options.bwidth + "px", "height":this.options.bheight + "px"})
		.click(function() {
			input.focus();

			// Close if already visible
			if ( wasOpen ) {
				return;
			}

			// Pass empty string as value to search for, displaying all results
			input.autocomplete( "search", "" );
		});
		var button = this.a;
		if(this.options.ireadonly != null && this.options.ireadonly == true) {
			input.on("mousedown", function() {
				wasOpen = input.autocomplete( "widget" ).is( ":visible" );
			});
			input.on("click", function() {
				input.focus();
				if(wasOpen) {
					return ;
				}
				input.autocomplete( "search", "" );
			});
		}
		if(this.options.bcss != null) {
			button.css(this.options.bcss);
		}
		if(this.options.bcssClassName != null) {
			button.addClass(this.options.bcssClassName);
		}
	},

	_source: function( request, response ) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
		response( this.element.children( "option" ).map(function() {
			var text = $( this ).text();
			if ( this.value && ( !request.term || matcher.test(text) ) )
				return {
				label: text,
				value: text,
				option: this
			};
		}) );
	},

	_removeIfInvalid: function( event, ui ) {

		// Selected an item, nothing to do
		if ( ui.item ) {
			return;
		}

		// Search for a match (case-insensitive)
		var value = this.input.val(),
		valueLowerCase = value.toLowerCase(),
		valid = false;
		this.element.children( "option" ).each(function() {
			if ( $( this ).text().toLowerCase() === valueLowerCase ) {
				this.selected = valid = true;
				return false;
			}
		});

		// Found a match, nothing to do
		if ( valid ) {
			return;
		}

		// Remove invalid value
		this.input
		.val( "" )
//		.attr( "title", value + " didn't match any item" )
		.attr( "title", "" )
		.tooltip( "open" );
		this.element.val( "" );
		this._delay(function() {
			this.input.tooltip( "close" ).attr( "title", "" );
		}, 2500 );
		this.input.autocomplete( "instance" ).term = "";
	},

	_destroy: function() {
		this.wrapper.remove();
		this.element.show();
	},
	
	autocomplete: function(value) {
		this.element.val(value);
		this.input.val(this.element.children("option:selected").text());
	},
	
	disable: function() {
	    this.input.prop('disabled',true);
	    this.input.autocomplete("disable");
	    this.a.button("disable");
	},
	enable: function() {
	    this.input.prop('disabled',false);
	    this.input.autocomplete("enable");
	    this.a.button("enable");
	}
});