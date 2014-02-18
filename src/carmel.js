var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://ci.carmel.ca.us/carmel/index.cfm/government/city-meetings-agendas/';
var meetings = [];

var finished = function() {
	fs.writeFile('../data/meetings/carmel.json', JSON.stringify(meetings, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to data/meetings/carmel.json");
	    }
	}); 
}

request(url, function(err, resp, body) {
    if (err) {
        throw err;
    }
    $ = cheerio.load(body);
    
    $('#portal dl').each(function() {
    	var meeting = {};
    	meeting.title = this.find('dt a').text();
    	meeting.date = new Date(this.find('dt.releaseDate').text());
    	meeting.url = 'http://ci.carmel.ca.us' + this.find('dt a').attr('href');
    	if(meeting.url.length) {
	    	meetings.push(meeting);
	    }
    });
    finished();
});
