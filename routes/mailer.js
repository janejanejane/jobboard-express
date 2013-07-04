
/*
 * GET mail listing.
 */
var jade = require('jade');
var SendGrid = require('sendgrid').SendGrid;
var Email = require('sendgrid').Email;
var mailman = new SendGrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

var confirmTemplate = require('fs').readFileSync('./views/mail/confirmation.jade', 'utf8');
var jadeConfirmationTemplate = jade.compile(confirmTemplate, {filename: './views/mail/confirmation.jade', pretty: true});
var reminderTemplate = require('fs').readFileSync('./views/mail/reminder.jade', 'utf8');
var jadeReminderTemplate = jade.compile(reminderTemplate, {filename: './views/mail/reminder.jade', pretty: true});

module.exports = {
  confirmation: function(req, res){
    var b = req.body;
    var url = req.protocol + '://' + req.get('host');
    var job = {
      jobpost: b.jobtitle,
      confirmKey: req.confirmKey,
      url: url + '/jobs/' + req.jobId
    };
    var mailHtml = jadeConfirmationTemplate({job: job});

    console.log("JOB:", job);
    var optionalParams = {
      to: b.confirmationemail,
      from: 'noreply@igda.com',
      subject: 'Confirmation',
      html: mailHtml
    };
    var email = new Email(optionalParams);
    mailman.send(
      email, function(success, message){
      if(success){
        console.log('Confirmation EMAIL Success!!!');
      }else{
        console.log('Confirmation EMAIL Error: ',message);
      }
    });
  },
  reminder: function(req, res){
    var b = req.body;
    var url = req.protocol + '://' + req.get('host');
    var job = {
      jobpost: b.jobtitle,
      confirmKey: req.confirmKey,
      url: url + '/jobs/' + req.jobId
    };
    var mailHtml = jadeReminderTemplate({job: job});

    console.log("JOB:", job);
    var optionalParams = {
      to: b.confirmationemail,
      from: 'noreply@igda.com',
      subject: 'Reminder',
      html: mailHtml
    };
    var email = new Email(optionalParams);
    mailman.send(
      email, function(success, message){
      if(success){
        console.log('Reminder EMAIL Success!!!');
      }else{
        console.log('Reminder EMAIL Error: ',message);
      }
    });
  }
}
