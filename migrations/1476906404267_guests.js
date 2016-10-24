exports.up = function(pgm) {
  pgm.createTable( 'guests', { id: { type: 'serial', primaryKey: true },
                                   user_id: {type: 'integer'},
                                   rsvp: {type: 'boolean'}
                                 });

};

exports.down = function(pgm) {
  pgm.dropTable( 'guests');

};
