exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.text("email").notNullable();
  table.text("password").notNullable();

  // enum cria restriçoes, primeiro parametro nome que queremos para a coluna
  // dentro do array, colocamos quais as opcoes que a coluna irá ter
  // enumName é o nome das restricoes que ira criar
  table.enum("role", ["admin", "customer"], { useNative: true, enumName: "roles" }).notNullable().default("customer")

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");