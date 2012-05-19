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

function setupCanvas(canvasId) {
	new Raphael(canvasId, null, 600, function() { initTurtle(this, canvasId); });
}

var turtles = {};

function initTurtle(raphael, canvasId) {
	turtles[canvasId] = new Tortoise('./images/tortoise.svg', raphael, 500);
}

function executeScheem(editorId) {
	$('#result_div_' + editorId).fadeOut(function() {
		try {
			var parsed = scheem.parse(editors[editorId].getValue());
			var result = scheem.evalScheem(parsed, {});
			$('#result_' + editorId).html('<p class="success">' + JSON.stringify(result) + '</p>');
		}
		catch(e) {
			$('#result_' + editorId).html('<p class="error">' + e + '</p>');
		}
		finally {
			$('#result_div_' + editorId).fadeIn();
		}
	});
}

function executeTurtle(editorId, canvasId) {
	$('#result_div_' + editorId).fadeOut(function() {
		try {
			var env = { };
			turtles[canvasId].clear();
			turtle.add_binding(env, 'draw', function(d) { turtles[canvasId].draw(d); });
			turtle.add_binding(env, 'move', function(d) { turtles[canvasId].move(d); });
			turtle.add_binding(env, 'right', function(a) { turtles[canvasId].right(a); });
			turtle.add_binding(env, 'left', function(a) { turtles[canvasId].left(a); });
			turtle.add_binding(env, 'rect', function(a) { turtles[canvasId].left(a); });
			turtle.add_binding(env, 'circle', function(a) { turtles[canvasId].left(a); });
			turtle.add_binding(env, 'text', function(a) { turtles[canvasId].left(a); });
			turtle.add_binding(env, 'color', function(c) { turtles[canvasId].params.stroke = c; });			
			var parsed = TURTLE.parse(editors[editorId].getValue());
            var result = turtle.evalStatements(parsed, env);
			$('#result_' + editorId).html('<p class="success">' + JSON.stringify(result) + '</p>');
			turtles[canvasId].run(1);
		}
		catch(e) {
			$('#result_' + editorId).html('<p class="error">' + e + '</p>');
		}
		finally {
			$('#result_div_' + editorId).fadeIn();
		}
	});
	
}

function toogleCollapse(element) {
	$('#' + element).slideToggle();
}