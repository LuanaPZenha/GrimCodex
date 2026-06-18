const { DataTypes } = require('sequelize');

async function columnExists(queryInterface, table, column) {
  const desc = await queryInterface.describeTable(table);
  return Boolean(desc[column]);
}

async function patchUsersTable(sequelize) {
  const queryInterface = sequelize.getQueryInterface();

  if (!(await columnExists(queryInterface, 'users', 'username'))) {
    await queryInterface.addColumn('users', 'username', {
      type: DataTypes.STRING(50),
      allowNull: true,
    });
  }

  await sequelize.query(`
    UPDATE users
    SET username = LOWER(REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9._-]', '', 'g'))
    WHERE username IS NULL OR username = '';
  `);

  await sequelize.query(`
    UPDATE users u
    SET username = u.username || '_' || u.id::text
    WHERE EXISTS (
      SELECT 1 FROM users u2
      WHERE u2.username = u.username AND u2.id <> u.id
    );
  `);

  await queryInterface.changeColumn('users', 'username', {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  });

  if (!(await columnExists(queryInterface, 'users', 'platform'))) {
    await queryInterface.addColumn('users', 'platform', {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'PC',
    });
  }

  if (!(await columnExists(queryInterface, 'users', 'favorite_class'))) {
    await queryInterface.addColumn('users', 'favorite_class', {
      type: DataTypes.STRING(30),
      allowNull: true,
    });
  }

  if (!(await columnExists(queryInterface, 'users', 'bio'))) {
    await queryInterface.addColumn('users', 'bio', {
      type: DataTypes.STRING(300),
      allowNull: true,
    });
  }

  await sequelize.query(`
    UPDATE users SET platform = 'PC' WHERE platform IS NULL OR platform = '';
  `);

  const statsColumns = [
    { name: 'hours_played', type: DataTypes.INTEGER, defaultValue: 0 },
    { name: 'achievements_completed', type: DataTypes.INTEGER, defaultValue: 0 },
    { name: 'most_used_class', type: DataTypes.STRING(30), defaultValue: null },
    { name: 'seasons_completed', type: DataTypes.INTEGER, defaultValue: 0 },
    { name: 'bosses_defeated', type: DataTypes.INTEGER, defaultValue: 0 },
  ];

  for (const col of statsColumns) {
    if (!(await columnExists(queryInterface, 'users', col.name))) {
      await queryInterface.addColumn('users', col.name, {
        type: col.type,
        allowNull: col.name === 'most_used_class',
        defaultValue: col.defaultValue,
      });
    }
  }

  await sequelize.query(`
    UPDATE users
    SET
      hours_played = COALESCE(hours_played, 0),
      achievements_completed = COALESCE(achievements_completed, 0),
      seasons_completed = COALESCE(seasons_completed, 0),
      bosses_defeated = COALESCE(bosses_defeated, 0),
      most_used_class = COALESCE(most_used_class, favorite_class)
    WHERE hours_played IS NULL
       OR achievements_completed IS NULL
       OR seasons_completed IS NULL
       OR bosses_defeated IS NULL;
  `);
}

module.exports = { patchUsersTable };
