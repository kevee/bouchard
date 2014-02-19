var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'http://isearchmonterey.org/docsresults.aspx?pagetype=results&di=true&srchtext=Agenda&keywords=Agenda';
var meetings = [];

var finished = function() {
    fs.writeFile('../data/meetings/monterey.json', JSON.stringify(meetings, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to data/meetings/monterey.json");
        }
    }); 
}
var count = 0;
request(url, function(err, resp, body) {
    if (err) {
        throw err;
    }
    $ = cheerio.load(body);
    var table = $('tr.datagridheader:nth-child(1)').first().parents('table').first();
    table.find('tr').each(function() {
        if(this.hasClass('datagrid2') || this.hasClass('datagridheader')) {
            return;
        }
        if(this.find('td').length == 4) {
            var meeting = {};
            meeting.title = this.find('td:nth-child(4)').text();
            meeting.date = new Date(this.find('td:nth-child(3)').text());
            meeting.url = this.find('td[align=center] a').attr('href');
            meeting.agenda = this.find('td[align=center] a').attr('href');
            if(meeting.date.getYear() > 112) {
                meetings.push(meeting);
            }
        }
    });
    finished();
});