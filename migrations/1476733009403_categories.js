exports.up = function(pgm) {
  pgm.createTable( 'categories', { id: { type: 'serial', primaryKey: true },
                                   user_id: {type: 'string'},
                                   image: {type: 'string'},
                                   item_id: {type: 'integer'}
                                 });

};

exports.down = function(pgm) {
  pgm.dropTable( 'categories');

};
