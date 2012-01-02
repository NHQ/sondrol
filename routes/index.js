
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('cms', { layout: false, title: 'Express' })
};