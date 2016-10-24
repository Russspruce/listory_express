exports.up = function(pgm) {
  pgm.createTable( 'items', { id: { type: 'serial', primaryKey: true },
                                   item_name: {type: 'string'},
                                   item_image: {type: 'string'},
                                   user_id: {type: 'integer'},
                                   comment: {type: 'string'},
                                   timestamp: {type: 'datetime'}
                                 });

};

exports.down = function(pgm) {

};
