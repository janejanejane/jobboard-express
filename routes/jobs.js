
/*
 * GET jobs listing.
 */
var async = require("async");
var Job = require('../models/job');
var constants = require('../constants');

module.exports = {
  index : function(req, res){
    var categories = {};
    async.parallel([
      function(callback){
        Job.find({category: 0}, function(err, res){
          categories[0] = res;
          return callback(err);
        });
      },
      function(callback){
        Job.find({category: 1}, function(err, res){
          categories[1] = res;
          return callback(err);
        });
      },
      function(callback){
        Job.find({category: 2}, function(err, res){
          categories[2] = res;
          return callback(err);
        });
      },
      function(callback){
        Job.find({category: 3}, function(err, res){
          categories[3] = res;
          return callback(err);
        });
      },
      function(callback){
        Job.find({category: 4}, function(err, res){
          categories[4] = res;
          return callback(err);
        });
      },
      function(callback){
        Job.find({category: 5}, function(err, res){
          categories[5] = res;
          return callback(err);
        });
      }
    ],function(){
        // console.log("Result:", categories, "Length:", Object.keys(categories).length);
        var indexParams = { 
          title: 'All Jobs', 
          categories: categories, 
          categoriesList: constants.CATEGORY, 
          numberLimit: constants.NUMBER_LIMIT 
        }
        res.render('jobs/index', indexParams);

        //res.render('jobs/index', { title: 'All Jobs', categories: categories });
    });
    //  Job.aggregate(
    //     {
    //     $match: 
    //       {
    //         listing: new ObjectId(listingId)
    //       }
    //     },
    //     { $group: 
    //       { 
    //       _id: '$category', 
    //       category: {$addToSet : '$category'} 
    //       }
    //     },
    //     { $unwind : "$category" },
    //     { $project:
    //       { _id: 1,
    //         category: 1
    //       }
    //     }, function(err, categories) {
    //    console.log(categories);
    //    console.log(err);
    // });
    // Job.find({$group: '$category'}, function(err, logs) {
    //   console.log(logs);
    //   console.log(err);
    // }); 
  },
  show : function(req, res){
    var domain = req.protocol + '://' + req.get('host');
    var showParams = { 
      title: req.job.jobtitle + ' Job', 
      job: req.job, 
      availabilitiesList: constants.AVAILABILITY, 
      facebookUri: process.env.FACEBOOK_URI,
      facebookKey: process.env.FACEBOOK_KEY, 
      host: domain, 
      jobpath: domain + req.path 
    }
    res.render('jobs/show', showParams);  
  },
  new : function(req, res){
    var newParams = { 
      title: 'Add Job', 
      categoriesList: constants.CATEGORY, 
      availabilitiesList: constants.AVAILABILITY
    }
    res.render('jobs/new', newParams);  
  },
  preview : function(req, res){
    var previewParams = { 
      title: 'Add Job Preview', 
      job: req.body, 
      availabilitiesList: constants.AVAILABILITY 
    }
    res.render('jobs/preview', previewParams);  
  },
  create : function(req, res){
    var b = req.body;
    var job = new Job();
    job.jobtitle = b.jobtitle;
    job.location = b.location;
    job.description = b.description;
    job.apply_details = b.applydetails;
    job.company_name = b.companyname;
    job.company_website = '/^https?/'.match(b.companywebsite) ? b.companywebsite : 'http://' + b.companywebsite;
    job.confirmation_email = b.confirmationemail;
    job.salary = b.salary;
    job.jobtype = b.jobtype;
    job.minimum = b.minimum;
    job.category = b.category;

    job.save(function(err, job){
      if(err) console.log(err);
      res.redirect('/jobs/' + job._id, { title: job.jobtitle + 'Job Post' })
    });

    // res.render('jobs/show', { title: 'Job' });
  },
  // edit : function(req, res){
  //   res.render('jobs/edit', { title: 'Edit Job'});  
  // },
  // update : function(req, res){
  //   res.render('jobs/show', { title: 'Job'});
  // },
  category : function(req, res){

  },
  _loadJob : function(req, res, next, id){
    Job.find({ _id: id }, function(err, docs){
      req.job = docs[0];
      next();
    });
  }
}

