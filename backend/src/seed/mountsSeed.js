const Item = require('../models/Item');
const mounts = require('../data/diabloMounts');
const { withMountRarity } = require('../data/mountRarity');
const { withMountCategory } = require('../data/mountCategories');
const { withMountContext } = require('../data/mountContext');

async function seedMounts() {
  let inserted = 0;
  let updated = 0;

  for (const raw of mounts) {
    const mount = withMountContext(withMountCategory(withMountRarity({ ...raw, guideType: 'MONTARIA' })));
    const existing = await Item.findOne({ where: { title: mount.title, guideType: 'MONTARIA' } });

    if (existing) {
      await existing.update({
        category: mount.category,
        rating: mount.rating,
        rarity: mount.rarity,
        description: mount.description,
        guide: mount.guide,
        howTo: mount.howTo,
        averageTime: mount.averageTime,
        location: mount.location,
        status: existing.status || mount.status,
      });
      updated += 1;
    } else {
      await Item.create(mount);
      inserted += 1;
    }
  }

  console.log(`Seed de montarias: ${inserted} inseridas, ${updated} atualizadas (total ${mounts.length}).`);
}

module.exports = { seedMounts };
