$(document).ready(function () {
	$('#autocomplete').autocomplete({
		source: function(req, res) {
			console.log('Getting source');
			$.ajax({
				url: '/autocomplete?queryTerms=' + req.term,
				dataType: 'json',
				type: 'GET',
				data: {
					term: req.term
				},
				success: function(data) {
					console.log(data);
					res($.map(data, function(item) {
						return {
							label: item.name + ' by ' + item.artist,
							value: item.name,
							id: item.songId
						};
					}));
				},
				error: function(xhr) {
					alert(xhr.status + ' : ' + xhr.statusText);
				}
			});
		},
		select: function(event, ui) {
			$('#songs-selected').append('<p>' + ui.item.label + ' added.</p>');
			$('#playlist-form').append('<input type="hidden" name="songValue" value="' + ui.item.id + '" />');
		}
	});
});