/*
Contains all API calls for an event.
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/event.js');
var Fuse = require('fuse.js');

var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "eventname",
]
};


//handle user search
router.get('/findEvents/:qu?',function(req,res){
   Event.find(function (err, events) {
      if (err)
        res.send(err);
 	  
 	  /*decodeURIComponent(req.params.qu);*/
 	  if (req.params.qu =="undefined" || req.params.qu == null  ) res.json(events);
 	  else
 	  {
      var fuse = new Fuse(events, options); // "list" is the item array
	  var result = fuse.search(req.params.qu);
      res.json(result);
  	  }
    });
})	

//POST message for event creation, not all necessairy data included yet
router.post("/createEvent", function(req, res) {  
    var ev = new Event({
        eventname: req.body.eventname,
		price: req.body.price,
		description: req.body.description,
		minage: req.body.minage,
		maxage: req.body.maxage
    });

    ev.save(function(err, status) {
        if (err) return res.json(err);
        return res.json(status);			//status in fact is data, just for debugging
    });
});

//handle user single event click
router.get("/singleEvent/:id?", function(req, res) {  
    Event.findById(req.params.id, function(err, event){
    if (err)
      res.send(err);
    res.json(event);
  });
});


module.exports = router;