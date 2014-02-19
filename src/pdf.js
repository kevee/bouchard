var request = require('request');
var fs = require('fs');
var pdfText = require('pdf-text')

var url = 'http://about.csumb.edu/sites/default/files/53/attachments/files/3939_general_campus_map_update_14.pdf';

request(url, function (error, response, body) {
	pdfText(body, function(err, chunks) {
		console.log(err);
	});

});