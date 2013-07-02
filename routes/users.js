
/*
 * GET users listing.
 */

var User = require('../models/user');

module.exports = {
  index : function(req, res){
    User.find({}, function(err, docs){
      res.render('users/index', { title: 'All Developers', users: docs });
    });
  },
  show : function(req, res){
    res.render('users/show', { title: 'Developer Profile' });
  },
  new : function(req, res){
    res.render('users/new', { title: 'Add User' });
  },
  create : function(req, res){
    var b = req.body;
    var user = new User();
    user.name = b.name;
    user.password = b.password;
    user.description = b.description;
    user.save(function(err, user){
      if(err) res.json(err);
      res.redirect('/users/' + user._id);
    });

    // res.render('users/show', { title: 'User' });
  },
  edit : function(req, res){
    res.render('users/edit', { title: 'Edit User'});
  },
  update : function(req, res){
    res.render('users/show', { title: 'User'});
  },
  _loadUser : function(req, res, next, id){
    User.find({ _id: id }, function(err, docs) {
      req.user = docs[0];
      next();
    });
  }
}
