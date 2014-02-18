var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var FeedParser = require('feedparser');

var url = 'http://www.ci.marina.ca.us/support/calendar.xml';
var meetings = [];

var finished = function() {
    fs.writeFile('../data/meetings/marina.json', JSON.stringify(meetings, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to data/meetings/marina.json");
        }
    }); 
}

var req = request(url)
  , feedparser = new FeedParser();

req.on('error', function (error) {

});
req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});


feedparser.on('error', function(error) {

});
feedparser.on('readable', function() {

  var stream = this
    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    , item;

  while (item = stream.read()) {
    var title = item.title.split(' - ');
    var meeting = {};
    meeting.city = { city: 'Marina', zip: '93933' };
    meeting.title = item.title;
    meeting.date = new Date(item.pubDate);
    meeting.url = item.link;
    meetings.push(meeting);
  }
  finished();
});
