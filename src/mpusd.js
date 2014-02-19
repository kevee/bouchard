var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://monterey.csbaagendaonline.net/cgi-bin/WebObjects/monterey-eAgenda.woa/wa/displayCalendar';
var meetings = [];

var finished = function() {
	fs.writeFile('../data/meetings/mpusd.json', JSON.stringify(meetings, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to data/meetings/mpusd.json");
	    }
	}); 
}

request(url, function(err, resp, body) {
    if (err) {
        throw err;
    }
    $ = cheerio.load(body);
    $('table:has(.oddRow) tr').each(function() {
    	if(this.find('td:nth-child(1) a').length == 1) {
    		var meeting = {};
	    	meeting.title = this.find('td:nth-child(3) font').text();
	    	meeting.date = new Date(this.find('td:nth-child(1) a').text());
	    	meeting.url = 'http://monterey.csbaagendaonline.net/' + this.find('td:nth-child(0) a').attr('href');
	    	if(meeting.url.length && meeting.title.trim().length) {
		    	meetings.push(meeting);
		    }
    	}
    });

    finished();


});
