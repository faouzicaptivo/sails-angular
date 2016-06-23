/**
 * HangoutController
 *
 * @description :: Server-side logic for managing hangouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * Get All messages.
     */
    getAllMessages: function (req, res) {
            Message.findAll()

            .spread(function ( messages ) {
                res.json( messages );
            })

            .fail(function (err) {
                console.log(err);
                res.send(404);
            })
    },  

    /**
     * Get message by ID.
     */
    getOneMssage: function ( req, res ) {
        
        if( undefined === req.param('id') ){
            return res.badRequest(' There was an error occured, no id provided.');
        }
        
        Message.findOne( req.param('id'))
        .spread( function ( message ) {

            res.json( message )

        })
        .fail(function ( err ) {
            res.send(404);
        })

    },

    /**
     * Create message.
     */
    createMessage: function ( req, res ) {

        var uid = req.param('uid');
        var message = req.param('message');

        var data = {
            title: message,
            user: uid
        }

        Message.create( data , function (err, message ) {
            Message.publishCreate( message );
        })
    }
	
};

