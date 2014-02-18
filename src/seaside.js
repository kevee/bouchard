var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://www.ci.seaside.ca.us/index.aspx?page=254';
var meetings = [];

var finished = function() {
	fs.writeFile('../data/meetings/seaside.json', JSON.stringify(meetings, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to data/meetings/seaside.json");
	    }
	}); 
}

var getAgenda = function(meeting, last) {
	request(meeting.url, function(err, resp, body) {
		var $ = cheerio.load(body);
		$('a').each(function() {
			if($(this).text() == 'Agenda') {
				meeting.agenda = 'http://www.ci.seaside.ca.us/' + $(this).attr('href');
			}
		});
		if(last) {
			finished();
		}
	});
}

request(url, function(err, resp, body) {
    if (err) {
        throw err;
    }
    $ = cheerio.load(body);
    
    $('.listtable tr').each(function() {
    	if(!this.find('th').length) {
	    	var meeting = {};
    		meeting.city = { city: 'Seaside', zip: '93955' };
	    	meeting.title = this.find('td:nth-child(1) a').text();
	    	meeting.date = new Date(this.find('td:nth-child(2)').text());
	    	meeting.url = 'http://www.ci.seaside.ca.us/' + this.find('td:nth-child(1) a').attr('href');
	    	if(meeting.url.length) {
		    	meetings.push(meeting);
		    }
		  }
    });

    for(var i = 0; i < meetings.length; i++) {
    	getAgenda(meetings[i], (i == meetings.length - 1));
    }


});
