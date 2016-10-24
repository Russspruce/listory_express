exports.up = function(pgm) {
  pgm.createTable( 'users', { id: { type: 'serial', primaryKey: true },
                              firstname: {type: 'string'},
                              lastname: {type: 'string'},
                              email: { type: 'string'},
                              image: {type: 'string'},
                              password: {type: 'string'},
                              createdAt: {type: 'datetime'},
                              updatedAt: {type: 'datetime'},
                              user_events: {type: 'integer'}});

};

exports.down = function(pgm) {
  pgm.dropTable( 'users');

};
