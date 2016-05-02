$(document).ready(function() {
	var fileCount = 1;

	$('#add-song-btn').click(function() {
		// Appends a new row of form input 
		$('#songs-form').prepend("<div class='row'>" +
				"<div class='form-group col-sm-4'>" +
					"<label>Song Name:</label>" +
					"<input class='form-control' type='text' name='songName' placeholder='Song Name' required autofocus>" +
				"</div>" +
				"<div class='form-group col-sm-4'>" +
					"<label> Artist: </label>" +
					"<input class='form-control' type='text' name='artistName' placeholder='Artist Name' required autofocus>" +
				"</div>" +
				"<div class='form-group col-sm-4'>" +
					"<label> Song File: </label>" +
					"<input type='file' name='song-file'>" +
				"</div>" +
			"</div>");

		// User can't upload more than 12 files, so we remove the option to add more files.
		fileCount++;
		if (fileCount >= 12) {
			$(this).remove();
		}
	});
});
