
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('anon_color_vote', function(table){
            table.increments()
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
            'rgb'.split('').forEach( (component) => {
                // limit to 255 w/ knex?
                table.integer(component).unsigned().notNullable()
            })
        })
        .raw("ALTER TABLE anon_color_vote ADD CONSTRAINT eight_bit_color CHECK (r >= 0 AND r <= 255 AND g >= 0 AND g <= 255 AND b >= 0 AND b <= 255)")
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('anon_color_vote')
    ])
};
