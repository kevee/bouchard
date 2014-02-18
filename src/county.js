var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var FeedParser = require('feedparser');

var url = 'https://monterey.legistar.com/Feed.ashx?M=Calendar&ID=1070914&GUID=95e09118-ffb2-4d23-8979-87c9695efcde&Mode=This%20Year&Title=Monterey+County+-+Calendar+(This+Year)';
var meetings = [];

var finished = function() {
	fs.writeFile('../data/meetings/county.json', JSON.stringify(meetings, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to data/meetings/county.json");
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
  	meeting.title = title[0];
  	meeting.date = new Date(title[1] + ' ' + title[2]);
  	meeting.url = item.link;
  	meetings.push(meeting);
  }
  finished();
});
