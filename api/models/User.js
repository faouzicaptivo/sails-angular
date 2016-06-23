/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: 'mongo',

  attributes: {
    provider: 'STRING',
    uid: 'STRING',
    name: 'STRING',
    email: 'STRING',
    firstname: 'STRING',
    lastname: 'STRING',
    token: "STRING",

    messages_count:{
      type: 'number',
    },
    messages:{
      collection: 'message',
      via: 'user'
    }
  },


//Repository

  /**
   * Get all users.
   */
  findAll: function () {
    return User.find().
    then(function (users) {
      return [users];
    })    
  },

  /**
   * Get users by uid.
   */
  findOne: function ( id ) {
    return User.findOne( id )
    .then(function ( user ) {
      return [user];
    })

  }


};
