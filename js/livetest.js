var scheemCodeValue = null;

function onChange_scheem_code(editor) {
	scheemCodeValue = editor.getValue();
}

function updateResults() {
	if(scheemCodeValue != null) {
		var tempValue = scheemCodeValue;
		$('#results').fadeOut(function() {
			try {
				try {
					var parsed = scheem.parse(tempValue);
					$('#parsed').html('<p class="success">' + JSON.stringify(parsed) + '</p>');
					try {
						var result = scheem.evalScheem(parsed, {});
						$('#result').html('<p class="success">' + JSON.stringify(result) + '</p>');
					}
					catch(e) {
						$('#result').html('<p class="error">' + e + '</p>');
					}
				}
				catch(e) {
					$('#parsed').html('<p class="error">' + e + '</p>');
					$('#result').html('');
				}
			}
			finally {
				$('#results').fadeIn();
			}
		});
		
	}
	scheemCodeValue = null;
	window.setTimeout(updateResults, 2000);
}

window.setTimeout(updateResults, 2000);