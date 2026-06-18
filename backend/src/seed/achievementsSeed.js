const { Op } = require('sequelize');
const Item = require('../models/Item');
const achievements = require('../data/diabloAchievements');
const { withRarity } = require('../data/rarity');
const { withCategory } = require('../data/categories');
const { withContext } = require('../data/achievementContext');

async function seedAchievements() {
  let inserted = 0;
  let updated = 0;

  for (const raw of achievements) {
    const achievement = withContext(withCategory(withRarity({ ...raw, guideType: 'CONQUISTA' })));
    const existing = await Item.findOne({
      where: {
        title: achievement.title,
        [Op.or]: [
          { guideType: 'CONQUISTA' },
          { guideType: null },
        ],
      },
    });

    if (existing) {
      await existing.update({
        guideType: achievement.guideType || 'CONQUISTA',
        category: achievement.category,
        rating: achievement.rating,
        rarity: achievement.rarity,
        description: achievement.description,
        guide: achievement.guide,
        howTo: achievement.howTo,
        averageTime: achievement.averageTime,
        location: achievement.location,
        status: existing.status || achievement.status,
      });
      updated += 1;
    } else {
      await Item.create(achievement);
      inserted += 1;
    }
  }

  console.log(`Seed de conquistas: ${inserted} inseridas, ${updated} atualizadas (total ${achievements.length}).`);
}

module.exports = { seedAchievements };
