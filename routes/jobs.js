
/*
 * GET jobs listing.
 */
var async = require("async");
var Job = require('../models/job');
var constants = require('../constants');
var mailman = require('./mailer');

module.exports = {
  index : function(req, res){
    var categories = {};

    var queryFn = function(category, callback){
      Job.find({category: category, isdeleted: 0, jobkey_confirmation: {'$ne': null }}, function(err, res){
        if(res.length > 0) categories[category] = res;
        console.log(res);
        return callback(err);
      });
    }

    async.parallel([
      function(callback){
        queryFn(0, callback);
      },
      function(callback){
        queryFn(1, callback);
      },
      function(callback){
        queryFn(2, callback);
      },
      function(callback){
        queryFn(3, callback);
      },
      function(callback){
        queryFn(4, callback);
      },
      function(callback){
        queryFn(5, callback);
      }
    ],function(){
        console.log("Result:", categories, "Length:", Object.keys(categories).length);
        var indexParams = { 
          title: 'All Jobs', 
          categories: categories, 
          categoriesList: constants.CATEGORY, 
          numberLimit: constants.NUMBER_LIMIT 
        };
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
    console.log("Show !");
    if(req.job.jobkey_confirmation != null){
      var url = req.protocol + '://' + req.get('host');
      var showParams = { 
        title: req.job.jobtitle + ' Job', 
        job: req.job, 
        categoriesList: constants.CATEGORY, 
        availabilitiesList: constants.AVAILABILITY, 
        facebookUri: process.env.FACEBOOK_URI,
        facebookKey: process.env.FACEBOOK_KEY, 
        host: url, 
        jobpath: url + req.path 
      }
      res.render('jobs/show', showParams);   
    }else{
      res.render('jobs/error');
    }
  },
  new : function(req, res){
    var newParams = { 
      title: 'Add Job', 
      categoriesList: constants.CATEGORY, 
      availabilitiesList: constants.AVAILABILITY
    };
    res.render('jobs/new', newParams);  
  },
  preview : function(req, res){
    var previewParams = { 
      title: 'Add Job Preview', 
      job: req.body, 
      availabilitiesList: constants.AVAILABILITY 
    }; 
    res.render('jobs/preview', previewParams); 
  },
  create : function(req, res){
    var b = req.body;
    var job = new Job();
    var createHash = require('crypto').randomBytes(20).toString('hex');

    job.jobtitle = b.jobtitle;
    job.location = b.location;
    job.description = b.description;
    job.apply_details = b.applydetails;
    job.company_name = b.companyname;
    job.company_website = '/^https?/'.match(b.companywebsite) ? b.companywebsite : 'http://' + b.companywebsite;
    job.confirmation_email = b.confirmationemail;
    req.confirmKey = job.jobkey = createHash;
    job.salary = b.salary;
    job.jobtype = b.jobtype;
    job.minimum = b.minimum;
    job.category = b.category;

    job.save(function(err, job){
      if(err) console.log(err);
      // res.redirect('/jobs/' + job._id, { title: job.jobtitle + 'Job Post' });
      res.render('jobs/success', { confirmationEmail: req.body.confirmationemail });
      req.jobId = job._id;
      mailman.confirmation(req, res);
      return;
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
    Job.find({ category: req.category }, function(err, docs){
      // console.log("err", err, "docs", docs);
      var categoryParams = {
        category: constants.CATEGORY[req.category],
        jobList: docs
      }
      res.render('jobs/category', categoryParams);
    });
  },
  confirm : function(req, res, next){
    var id = req.job.id;
    var confirmKey = req.query.code;
    console.log('CONFIRMKEY: ', confirmKey, 'id', id);
    if(confirmKey){
      Job.findOne({ _id: id }, function(err, job){
        console.log('err', err, 'job', job);

        if(err){
          console.log("Job not found: " + id);
          res.render('jobs/error');
          return;
        }

        var url = req.protocol + '://' + req.get('host');
        var showParams = { 
          title: req.job.jobtitle + ' Job', 
          job: req.job, 
          categoriesList: constants.CATEGORY, 
          availabilitiesList: constants.AVAILABILITY, 
          facebookUri: process.env.FACEBOOK_URI,
          facebookKey: process.env.FACEBOOK_KEY, 
          host: url, 
          jobpath: url + req.path 
        }
        
        if(job.jobkey_confirmation === null){
          job.jobkey_confirmation = confirmKey;
          job.save(function(err, affected){
            console.log('affected rows %d', affected);
          });
          // Job.update({_id: id}, updateConfirmation, function(err, affected) {
          //   console.log('affected rows %d', affected);
          //   res.render('jobs/success'); 
          // });
          showParams.confirmMsg = 'Job confirmed successfully!';
          res.render('jobs/show', showParams);
        }else{
          showParams.duplicateMsg = 'Job already confirmed!';
          console.log('Job already confirmed', showParams);
          res.render('jobs/show', showParams);
        }
      });

      
    }
  },
  _loadJob : function(req, res, next, id){
    Job.find({ _id: id }, function(err, docs){
      if(docs != null){
        req.job = docs[0];
        console.log('inside _loadJob!!!', id, docs);
        next(); 
      }else{
        next('route');
      }
    });
  },
  _checkCategory : function(req, res, next, category){
    var categoriesList = constants.CATEGORY;
    var idx = categoriesList.indexOf(category);
    if(idx != -1){
      req.category = idx;
      console.log("category", idx);
      next();
    }else{
      next('route');
    }
  }
}

