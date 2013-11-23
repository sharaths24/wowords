var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
var utils    = require( 'connect' ).utils;

exports.index = function ( req, res, next ){
res.render( 'index', {
          title : 'Wowords!'
      });
};


exports.main = function ( req, res, next ){
  var user_id = req.user.identifier;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'main', {
          title : 'Wowords!',
          todos : todos
      });
    });
};


exports.create = function ( req, res, next ){
  var user_id = req.user.identifier;		
  var natural = require('natural');
  var wordnet = new natural.WordNet();
  var word_meaning="";
  console.log(req.body.word);
  wordnet.lookup(req.body.word, function(results) {
    results.forEach(function(result) {
        //console.log('------------------------------------');
        //console.log(result.synsetOffset);
        //console.log(result.pos);
        //console.log(result.lemma);
        //console.log(result.synonyms);
        //console.log(result.pos);
        word_meaning = word_meaning + result.gloss+"\n-----------\n";
    });
      new Todo({
      user_id : ruser_id,
      word : req.body.word,
      comment:'test',
      meaning:word_meaning,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );

     res.redirect('/main');
  });
  });
};

exports.destroy = function ( req, res, next ){
    Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.user.identifier;

    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }
    todo.remove( function ( err, todo ){
      if( err ) return next( err );

      res.redirect( '/main' );
    });
  }); 
};

exports.edit = function( req, res, next ){
  var user_id = req.user.identifier;
  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.user.identifier;
    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }
    //sys.puts(sys.inspect(someVariable));	
    todo.comment    = req.body.comment;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/main' );
    });
  });
};

exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};
