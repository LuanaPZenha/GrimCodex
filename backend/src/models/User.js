const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const PLATFORMS = ['PC', 'PS5', 'Xbox', 'Switch', 'Multiplataforma'];
const CLASSES = ['Barbarian', 'Druid', 'Necromancer', 'Rogue', 'Sorcerer', 'Spiritborn', 'Nenhuma'];

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'PC',
    },
    favoriteClass: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'favorite_class',
    },
    bio: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    hoursPlayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'hours_played',
      validate: { min: 0, max: 99999 },
    },
    achievementsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'achievements_completed',
      validate: { min: 0, max: 9999 },
    },
    mostUsedClass: {
      type: DataTypes.STRING(30),
      allowNull: true,
      field: 'most_used_class',
    },
    seasonsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'seasons_completed',
      validate: { min: 0, max: 99 },
    },
    bossesDefeated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'bosses_defeated',
      validate: { min: 0, max: 9999 },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

User.prototype.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

User.prototype.toSafeJSON = function toSafeJSON() {
  const {
    id, name, username, email, platform, favoriteClass, bio, role, createdAt, updatedAt,
    hoursPlayed, achievementsCompleted, mostUsedClass, seasonsCompleted, bossesDefeated,
  } = this.toJSON();
  return {
    id, name, username, email, platform, favoriteClass, bio, role, createdAt, updatedAt,
    hoursPlayed, achievementsCompleted, mostUsedClass, seasonsCompleted, bossesDefeated,
  };
};

User.prototype.toPublicJSON = function toPublicJSON({ includeEmail = false } = {}) {
  const {
    id, name, username, email, platform, favoriteClass, bio, role, createdAt,
    hoursPlayed, achievementsCompleted, mostUsedClass, seasonsCompleted, bossesDefeated,
  } = this.toJSON();

  const profile = {
    id,
    name,
    username,
    platform,
    favoriteClass,
    bio,
    role,
    createdAt,
    hoursPlayed: hoursPlayed ?? 0,
    achievementsCompleted: achievementsCompleted ?? 0,
    mostUsedClass: mostUsedClass || favoriteClass || null,
    seasonsCompleted: seasonsCompleted ?? 0,
    bossesDefeated: bossesDefeated ?? 0,
  };

  if (includeEmail) {
    profile.email = email;
  }

  return profile;
};

module.exports = User;
module.exports.PLATFORMS = PLATFORMS;
module.exports.CLASSES = CLASSES;
