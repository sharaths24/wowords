var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Todo = new Schema({
    user_id    : String,
    word    : String,
    comment    : String,	
    updated_at : Date
});

mongoose.model( 'Todo', Todo );

mongoose.connect( 'mongodb://sharaths24:rolodex@paulo.mongohq.com:10090/wowords' );
