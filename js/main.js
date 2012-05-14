function setupMenu(menu) {
	menu.buildMenu({
		menuWidth:200,
		openOnRight:false,
		menuSelector: ".menuContainer",
		iconPath:"ico/",
		hasImages:true,
		fadeInTime:100,
		fadeOutTime:300,
		adjustLeft:2,
		minZindex:"auto",
		adjustTop:10,
		opacity:.95,
		shadow:false,
		shadowColor:"#ccc",
		hoverIntent:0,
		openOnClick:true,
		closeOnMouseOut:false,
		closeAfter:1000,
		submenuHoverIntent:200
	});
}

var editors = {};

function setupEditor(editorId, mode, editorValue) {
	var codeMirrorEditor = CodeMirror.fromTextArea($('#' + editorId)[0], {
		mode: mode,
		theme: 'nojw',
		
		indentUnit: 4,
		lineNumbers: true,
		matchBrackets: true,
		tabMode: "indent",
		onCursorActivity : function () {
			var pos = codeMirrorEditor.getCursor();
			$('#cursor_' + editorId).html((pos.line + 1) + ':' + (pos.ch + 1)); 
		}
	});
	codeMirrorEditor.setValue(editorValue);
	editors[editorId] = codeMirrorEditor;
}

function executeScheem(editorId) {
	$('#result_div_' + editorId).fadeOut(function() {
		var cursor = $('body').css('cursor');
		$('body').css('cursor', 'wait');
		try {
			var parsed = scheem.parse(editors[editorId].getValue());
			var result = scheem.evalScheem(parsed, {});
			$('#result_' + editorId).html('<p class="success">' + JSON.stringify(result) + '</p>');
		}
		catch(e) {
			$('#result_' + editorId).html('<p class="error">' + e + '</p>');
		}
		finally {
			$('body').css('cursor', cursor);
			$('#result_div_' + editorId).fadeIn();
		}
	});
}

function toogleCollapse(element) {
	$('#' + element).slideToggle();
}