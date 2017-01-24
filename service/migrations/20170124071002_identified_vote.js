
exports.up = function(knex, Promise) {
    const colorConstraint = "eight_bit_color CHECK "+
        "(r >= 0 AND r <= 255 AND g >= 0 AND g <= 255 AND b >= 0 AND b <= 255)"
    return Promise.all([
        knex.schema.createTable('identified_vote', function(table){
            table.increments()
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
            table.string('email').unique().notNullable()
            table.boolean('email_verified')
            table.string('email_verification_code').unique().notNullable()
            'rgb'.split('').forEach( (component) => {
                table.integer(component).unsigned().notNullable()
            })
        })
        .raw("ALTER TABLE identified_vote ADD CONSTRAINT "+colorConstraint)
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('identified_color_vote')
    ])
};
