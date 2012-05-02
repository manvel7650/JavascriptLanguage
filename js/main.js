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

function setupEditor(editor, cursor, mode, callback) {
	var editor = CodeMirror.fromTextArea(editor[0], {
		mode: mode,
		theme: 'nojw',
		indentUnit: 4,
		lineNumbers: true,
		matchBrackets: true,
		tabMode: "indent",
		onCursorActivity : function () {
			var pos = editor.getCursor();
			cursor.html((pos.line + 1) + ':' + (pos.ch + 1)); 
		},
		onChange : function(editor) {
			callback(editor);
		}
	});
}