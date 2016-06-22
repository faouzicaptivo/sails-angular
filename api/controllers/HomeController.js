/**
 * HomeController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  index: function(req, res) {

    //res.send(req.user);

    res.view({
      user: req.user
    });
  }
};
