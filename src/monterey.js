var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://isearchmonterey.org/meetresults.aspx?SortBy=Date%20Asc&keywords=&startdate=01/01/2014&enddate=12/31/2015&page=0&meettype=City%20Council|Appeals%20Hearing%20Board|Architectural%20Review|Colton%20Hall/Cultural%20Arts|Historic%20Preservation|Library%20Board|Mayors%20Subcommittee|Monterey%20Peninsula%20Regional%20Water%20Authority|Neighborhood%20Improvement|Oversight%20Board|Parks%20and%20Recreation|Planning|Zoning%20Administrator'
var page = 0;
var go = true;
var meetings = [];
var getMeetings = function() {
    url = url.replace(/\&page=([0-9]*)\&/, '&page=' + page + '&');
    console.log(url);
    request(url, function(err, resp, body) {
        if (err) {
            throw err;
        }
        $ = cheerio.load(body);
        
        $('table[width=800px]:has(.datagridheader) tr:not(.datagridheader)').each(function() {
        	var meeting = {};
        	meeting.title = this.find('td:nth-child(2)').html();
        	meeting.date = new Date(this.find('td:nth-child(3)').text());
        	meeting.url = 'http://isearchmonterey.org/' + this.find('td:nth-child(4) a:nth-child(0)').attr('src');
        	meeting.agenda = 'http://isearchmonterey.org/' + this.find('td:nth-child(4) a:nth-child(1)').attr('src');
        	meetings.push(meeting);
        });
    });
}
getMeetings();