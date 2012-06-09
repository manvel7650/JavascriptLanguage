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
			turtle.add_binding(env, 'draw', function(cont, d) { turtles[canvasId].draw(d); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'move', function(cont, d) { turtles[canvasId].move(d); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'right', function(cont, a) { turtles[canvasId].right(a); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'left', function(cont, a) { turtles[canvasId].left(a); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'rect', function(cont, a) { turtles[canvasId].rect(a); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'circle', function(cont, a) { turtles[canvasId].circle(a); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'text', function(cont, a) { turtles[canvasId].text(a); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'home', function(cont, a) { turtles[canvasId].home(); return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'color', function(cont, c) { turtles[canvasId].params.stroke = c; return continuations.thunk(cont, undefined); });
			turtle.add_binding(env, 'opacity', function(cont, o) { turtles[canvasId].params.opacity = o; return continuations.thunk(cont, undefined); });
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