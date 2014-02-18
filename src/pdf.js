var request = require('request');
var fs = require('fs');
var pdf_extract = require('pdf-extract');

var url = 'https://monterey.legistar.com/View.ashx?M=A&ID=298049&GUID=3A404B23-2E55-4845-9826-4E7743399B62';

var file = fs.createWriteStream("temp.pdf");
var request = request(url, function(response) {
    response.pipe(file).on('close', function(){
         postData(fs.readFileSync('temp.pdf'));
    });
});