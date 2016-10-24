exports.up = function(pgm) {
  pgm.createTable( 'events', { id: { type: 'serial', primaryKey: true},
                               user_id: { id: 'integer'},
                               event_name: {type: 'string'},
                               date_time: {type: 'datetime'},
                               address: {type: 'string'},
                               description: {type: 'string'},
                               image: {type: 'string'},
                               guest_add_items: {type: 'boolean'},
                               guests_invites: {type: 'boolean'},
                               category_id { type: 'integer'}
                             });};

exports.down = function(pgm) {
  pgm.dropTable( 'events');

};
