import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('point_item', (table) => {
    table.increments('id').primary();
    table
      .integer('point_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('points')
      .onDelete('CASCADE');
    table
      .integer('item_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('items');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('point_item');
}
