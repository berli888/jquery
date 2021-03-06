module("offset", { teardown: moduleTeardown });

test("disconnected node", function() {
	expect(2);

	var result = jQuery( document.createElement("div") ).offset();

	equal( result.top, 0, "Check top" );
	equal( result.left, 0, "Check left" );
});

var supportsScroll = false;

testIframe("offset/absolute", "absolute", function($, iframe) {
	expect(4);

	var doc = iframe.document,
      tests, forceScroll;

	// force a scroll value on the main window
	// this insures that the results will be wrong
	// if the offset method is using the scroll offset
	// of the parent window
	forceScroll = jQuery("<div>").css({ width: 2000, height: 2000 });
	forceScroll.appendTo("body");

	window.scrollTo(200, 200);

	if ( document.documentElement.scrollTop || document.body.scrollTop ) {
		supportsScroll = true;
	}

	window.scrollTo(1, 1);

	// get offset
	tests = [
		{ id: "#absolute-1", top: 1, left: 1 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id, doc ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equal( jQuery( this.id, doc ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});


	// get position
	tests = [
		{ id: "#absolute-1", top: 0, left: 0 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id, doc ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equal( jQuery( this.id, doc ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});

	forceScroll.remove();
});

testIframe("offset/absolute", "absolute", function( jQuery ) {
	expect(178);

	// get offset tests
	var tests = [
		{ id: "#absolute-1",     top:  1, left:  1 },
		{ id: "#absolute-1-1",   top:  5, left:  5 },
		{ id: "#absolute-1-1-1", top:  9, left:  9 },
		{ id: "#absolute-2",     top: 20, left: 20 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});


	// get position
	tests = [
		{ id: "#absolute-1",     top:  0, left:  0 },
		{ id: "#absolute-1-1",   top:  1, left:  1 },
		{ id: "#absolute-1-1-1", top:  1, left:  1 },
		{ id: "#absolute-2",     top: 19, left: 19 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equal( jQuery( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});

	// test #5781
	var offset = jQuery( "#positionTest" ).offset({ top: 10, left: 10 }).offset();
	equal( offset.top,  10, "Setting offset on element with position absolute but 'auto' values." )
	equal( offset.left, 10, "Setting offset on element with position absolute but 'auto' values." )


	// set offset
	tests = [
		{ id: "#absolute-2",     top: 30, left: 30 },
		{ id: "#absolute-2",     top: 10, left: 10 },
		{ id: "#absolute-2",     top: -1, left: -1 },
		{ id: "#absolute-2",     top: 19, left: 19 },
		{ id: "#absolute-1-1-1", top: 15, left: 15 },
		{ id: "#absolute-1-1-1", top:  5, left:  5 },
		{ id: "#absolute-1-1-1", top: -1, left: -1 },
		{ id: "#absolute-1-1-1", top:  9, left:  9 },
		{ id: "#absolute-1-1",   top: 10, left: 10 },
		{ id: "#absolute-1-1",   top:  0, left:  0 },
		{ id: "#absolute-1-1",   top: -1, left: -1 },
		{ id: "#absolute-1-1",   top:  5, left:  5 },
		{ id: "#absolute-1",     top:  2, left:  2 },
		{ id: "#absolute-1",     top:  0, left:  0 },
		{ id: "#absolute-1",     top: -1, left: -1 },
		{ id: "#absolute-1",     top:  1, left:  1 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		var top = this.top, left = this.left;

		jQuery( this.id ).offset(function(i, val){
			equal( val.top, top, "Verify incoming top position." );
			equal( val.left, left, "Verify incoming top position." );
			return { top: top + 1, left: left + 1 };
		});
		equal( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + " })" );
		equal( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + " })" );

		jQuery( this.id )
			.offset({ left: this.left + 2 })
			.offset({ top:  this.top  + 2 });
		equal( jQuery( this.id ).offset().top,  this.top  + 2, "Setting one property at a time." );
		equal( jQuery( this.id ).offset().left, this.left + 2, "Setting one property at a time." );

		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equal( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equal( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testIframe("offset/relative", "relative", function( jQuery ) {
	expect(60);

	// IE is collapsing the top margin of 1px
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;

	// get offset
	var tests = [
		{ id: "#relative-1",   top: ie ?   6 :   7, left:  7 },
		{ id: "#relative-1-1", top: ie ?  13 :  15, left: 15 },
		{ id: "#relative-2",   top: ie ? 141 : 142, left: 27 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});


	// get position
	tests = [
		{ id: "#relative-1",   top: ie ?   5 :   6, left:  6 },
		{ id: "#relative-1-1", top: ie ?   4 :   5, left:  5 },
		{ id: "#relative-2",   top: ie ? 140 : 141, left: 26 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.id + "').position().top" );
		equal( jQuery( this.id ).position().left, this.left, "jQuery('" + this.id + "').position().left" );
	});


	// set offset
	tests = [
		{ id: "#relative-2",   top: 200, left:  50 },
		{ id: "#relative-2",   top: 100, left:  10 },
		{ id: "#relative-2",   top:  -5, left:  -5 },
		{ id: "#relative-2",   top: 142, left:  27 },
		{ id: "#relative-1-1", top: 100, left: 100 },
		{ id: "#relative-1-1", top:   5, left:   5 },
		{ id: "#relative-1-1", top:  -1, left:  -1 },
		{ id: "#relative-1-1", top:  15, left:  15 },
		{ id: "#relative-1",   top: 100, left: 100 },
		{ id: "#relative-1",   top:   0, left:   0 },
		{ id: "#relative-1",   top:  -1, left:  -1 },
		{ id: "#relative-1",   top:   7, left:   7 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equal( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equal( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testIframe("offset/static", "static", function( jQuery ) {
	expect(80);

	// IE is collapsing the top margin of 1px
	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;

	// get offset
	var tests = [
		{ id: "#static-1",     top: ie ?   6 :   7, left:  7 },
		{ id: "#static-1-1",   top: ie ?  13 :  15, left: 15 },
		{ id: "#static-1-1-1", top: ie ?  20 :  23, left: 23 },
		{ id: "#static-2",     top: ie ? 121 : 122, left:  7 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
	});


	// get position
	tests = [
		{ id: "#static-1",     top: ie ?   5 :   6, left:  6 },
		{ id: "#static-1-1",   top: ie ?  12 :  14, left: 14 },
		{ id: "#static-1-1-1", top: ie ?  19 :  22, left: 22 },
		{ id: "#static-2",     top: ie ? 120 : 121, left:  6 }
	];
	jQuery.each( tests, function() {
		equal( jQuery( this.id ).position().top,  this.top,  "jQuery('" + this.top  + "').position().top" );
		equal( jQuery( this.id ).position().left, this.left, "jQuery('" + this.left +"').position().left" );
	});


	// set offset
	tests = [
		{ id: "#static-2",     top: 200, left: 200 },
		{ id: "#static-2",     top: 100, left: 100 },
		{ id: "#static-2",     top:  -2, left:  -2 },
		{ id: "#static-2",     top: 121, left:   6 },
		{ id: "#static-1-1-1", top:  50, left:  50 },
		{ id: "#static-1-1-1", top:  10, left:  10 },
		{ id: "#static-1-1-1", top:  -1, left:  -1 },
		{ id: "#static-1-1-1", top:  22, left:  22 },
		{ id: "#static-1-1",   top:  25, left:  25 },
		{ id: "#static-1-1",   top:  10, left:  10 },
		{ id: "#static-1-1",   top:  -3, left:  -3 },
		{ id: "#static-1-1",   top:  14, left:  14 },
		{ id: "#static-1",     top:  30, left:  30 },
		{ id: "#static-1",     top:   2, left:   2 },
		{ id: "#static-1",     top:  -2, left:  -2 },
		{ id: "#static-1",     top:   7, left:   7 }
	];
	jQuery.each( tests, function() {
		jQuery( this.id ).offset({ top: this.top, left: this.left });
		equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
		equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

		jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
			jQuery( this ).css({
				top:  props.top  + 1,
				left: props.left + 1
			});
		}});
		equal( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
		equal( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
	});
});

testIframe("offset/fixed", "fixed", function( jQuery ) {
	expect(30);

	var tests = [
		{ id: "#fixed-1", top: 1001, left: 1001 },
		{ id: "#fixed-2", top: 1021, left: 1021 }
	];

	jQuery.each( tests, function() {
		if ( !supportsScroll ) {
			ok( true, "Browser doesn't support scroll position." );
			ok( true, "Browser doesn't support scroll position." );

		} else if ( jQuery.offset.supportsFixedPosition ) {
			equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset().top" );
			equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset().left" );
		} else {
			// need to have same number of assertions
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
		}
	});

	tests = [
		{ id: "#fixed-1", top: 100, left: 100 },
		{ id: "#fixed-1", top:   0, left:   0 },
		{ id: "#fixed-1", top:  -4, left:  -4 },
		{ id: "#fixed-2", top: 200, left: 200 },
		{ id: "#fixed-2", top:   0, left:   0 },
		{ id: "#fixed-2", top:  -5, left:  -5 }
	];

	jQuery.each( tests, function() {
		if ( jQuery.offset.supportsFixedPosition ) {
			jQuery( this.id ).offset({ top: this.top, left: this.left });
			equal( jQuery( this.id ).offset().top,  this.top,  "jQuery('" + this.id + "').offset({ top: "  + this.top  + " })" );
			equal( jQuery( this.id ).offset().left, this.left, "jQuery('" + this.id + "').offset({ left: " + this.left + " })" );

			jQuery( this.id ).offset({ top: this.top, left: this.left, using: function( props ) {
				jQuery( this ).css({
					top:  props.top  + 1,
					left: props.left + 1
				});
			}});
			equal( jQuery( this.id ).offset().top,  this.top  + 1, "jQuery('" + this.id + "').offset({ top: "  + (this.top  + 1) + ", using: fn })" );
			equal( jQuery( this.id ).offset().left, this.left + 1, "jQuery('" + this.id + "').offset({ left: " + (this.left + 1) + ", using: fn })" );
		} else {
			// need to have same number of assertions
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
			ok( true, "Fixed position is not supported" );
		}
	});

	// Bug 8316
	var $noTopLeft = jQuery("#fixed-no-top-left");
	if ( jQuery.offset.supportsFixedPosition ) {
		equal( $noTopLeft.offset().top,  1007,  "Check offset top for fixed element with no top set" );
		equal( $noTopLeft.offset().left, 1007, "Check offset left for fixed element with no left set" );
	} else {
		// need to have same number of assertions
		ok( true, "Fixed position is not supported" );
		ok( true, "Fixed position is not supported" );
	}
});

testIframe("offset/table", "table", function( jQuery ) {
	expect(4);

	equal( jQuery("#table-1").offset().top, 6, "jQuery('#table-1').offset().top" );
	equal( jQuery("#table-1").offset().left, 6, "jQuery('#table-1').offset().left" );

	equal( jQuery("#th-1").offset().top, 10, "jQuery('#th-1').offset().top" );
	equal( jQuery("#th-1").offset().left, 10, "jQuery('#th-1').offset().left" );
});

testIframe("offset/scroll", "scroll", function( jQuery, win ) {
	expect(26);

	var ie = jQuery.browser.msie && parseInt( jQuery.browser.version, 10 ) < 8;

	// IE is collapsing the top margin of 1px
	equal( jQuery("#scroll-1").offset().top, ie ? 6 : 7, "jQuery('#scroll-1').offset().top" );
	equal( jQuery("#scroll-1").offset().left, 7, "jQuery('#scroll-1').offset().left" );

	// IE is collapsing the top margin of 1px
	equal( jQuery("#scroll-1-1").offset().top, ie ? 9 : 11, "jQuery('#scroll-1-1').offset().top" );
	equal( jQuery("#scroll-1-1").offset().left, 11, "jQuery('#scroll-1-1').offset().left" );


	// scroll offset tests .scrollTop/Left
	equal( jQuery("#scroll-1").scrollTop(), 5, "jQuery('#scroll-1').scrollTop()" );
	equal( jQuery("#scroll-1").scrollLeft(), 5, "jQuery('#scroll-1').scrollLeft()" );

	equal( jQuery("#scroll-1-1").scrollTop(), 0, "jQuery('#scroll-1-1').scrollTop()" );
	equal( jQuery("#scroll-1-1").scrollLeft(), 0, "jQuery('#scroll-1-1').scrollLeft()" );

	// scroll method chaining
	equal( jQuery("#scroll-1").scrollTop(undefined).scrollTop(), 5, ".scrollTop(undefined) is chainable (#5571)" );
	equal( jQuery("#scroll-1").scrollLeft(undefined).scrollLeft(), 5, ".scrollLeft(undefined) is chainable (#5571)" );

	win.name = "test";

	if ( !supportsScroll ) {
		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );

		ok( true, "Browser doesn't support scroll position." );
		ok( true, "Browser doesn't support scroll position." );
	} else {
		equal( jQuery(win).scrollTop(), 1000, "jQuery(window).scrollTop()" );
		equal( jQuery(win).scrollLeft(), 1000, "jQuery(window).scrollLeft()" );

		equal( jQuery(win.document).scrollTop(), 1000, "jQuery(document).scrollTop()" );
		equal( jQuery(win.document).scrollLeft(), 1000, "jQuery(document).scrollLeft()" );
	}

	// test jQuery using parent window/document
	// jQuery reference here is in the iframe
	window.scrollTo(0,0);
	equal( jQuery(window).scrollTop(), 0, "jQuery(window).scrollTop() other window" );
	equal( jQuery(window).scrollLeft(), 0, "jQuery(window).scrollLeft() other window" );
	equal( jQuery(document).scrollTop(), 0, "jQuery(window).scrollTop() other document" );
	equal( jQuery(document).scrollLeft(), 0, "jQuery(window).scrollLeft() other document" );

	// Tests scrollTop/Left with empty jquery objects
	notEqual( jQuery().scrollTop(100), null, "jQuery().scrollTop(100) testing setter on empty jquery object" );
	notEqual( jQuery().scrollLeft(100), null, "jQuery().scrollLeft(100) testing setter on empty jquery object" );
	notEqual( jQuery().scrollTop(null), null, "jQuery().scrollTop(null) testing setter on empty jquery object" );
	notEqual( jQuery().scrollLeft(null), null, "jQuery().scrollLeft(null) testing setter on empty jquery object" );
	strictEqual( jQuery().scrollTop(), null, "jQuery().scrollTop(100) testing setter on empty jquery object" );
	strictEqual( jQuery().scrollLeft(), null, "jQuery().scrollLeft(100) testing setter on empty jquery object" );

	// test setting scroll
	jQuery( win ).scrollTop( 100 );
	jQuery( win ).scrollLeft( 101 );
	equal( jQuery( win ).scrollTop(), 100, "jQuery( win ).scrollTop() testing setter" );
	equal( jQuery( win ).scrollLeft(), 101, "jQuery( win ).scrollLeft() testing setter" );
});

testIframe("offset/body", "body", function( jQuery ) {
	expect(2);

	equal( jQuery("body").offset().top, 1, "jQuery('#body').offset().top" );
	equal( jQuery("body").offset().left, 1, "jQuery('#body').offset().left" );
});

test("chaining", function() {
	expect(3);
	var coords = { top:  1, left:  1 };
	equal( jQuery("#absolute-1").offset(coords).selector, "#absolute-1", "offset(coords) returns jQuery object" );
	equal( jQuery("#non-existent").offset(coords).selector, "#non-existent", "offset(coords) with empty jQuery set returns jQuery object" );
	equal( jQuery("#absolute-1").offset(undefined).selector, "#absolute-1", "offset(undefined) returns jQuery object (#5571)" );
});

test("offsetParent", function(){
	expect(11);

	var body = jQuery("body").offsetParent();
	equal( body.length, 1, "Only one offsetParent found." );
	equal( body[0], document.body, "The body is its own offsetParent." );

	var header = jQuery("#qunit-header").offsetParent();
	equal( header.length, 1, "Only one offsetParent found." );
	equal( header[0], document.body, "The body is the offsetParent." );

	var div = jQuery("#nothiddendivchild").offsetParent();
	equal( div.length, 1, "Only one offsetParent found." );
	equal( div[0], document.body, "The body is the offsetParent." );

	jQuery("#nothiddendiv").css("position", "relative");

	div = jQuery("#nothiddendivchild").offsetParent();
	equal( div.length, 1, "Only one offsetParent found." );
	equal( div[0], jQuery("#nothiddendiv")[0], "The div is the offsetParent." );

	div = jQuery("body, #nothiddendivchild").offsetParent();
	equal( div.length, 2, "Two offsetParent found." );
	equal( div[0], document.body, "The body is the offsetParent." );
	equal( div[1], jQuery("#nothiddendiv")[0], "The div is the offsetParent." );
});

test("fractions (see #7730 and #7885)", function() {
	expect(2);

	jQuery('body').append('<div id="fractions"/>');

	var expected = { top: 1000, left: 1000 };
	var div = jQuery('#fractions');

	div.css({
		position: 'absolute',
		left: '1000.7432222px',
		top: '1000.532325px',
		width: 100,
		height: 100
	});

	div.offset(expected);

	var result = div.offset();

	equal( result.top, expected.top, "Check top" );
	equal( result.left, expected.left, "Check left" );

	div.remove();
});
