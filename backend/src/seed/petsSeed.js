const { Op } = require('sequelize');
const Item = require('../models/Item');
const pets = require('../data/diabloPets');
const { withPetRarity } = require('../data/petRarity');
const { withPetCategory } = require('../data/petCategories');
const { withPetContext } = require('../data/petContext');

async function seedPets() {
  let inserted = 0;
  let updated = 0;
  const titles = pets.map((pet) => pet.title);

  const removed = await Item.destroy({
    where: {
      guideType: 'MASCOTE',
      title: { [Op.notIn]: titles },
    },
  });
  if (removed > 0) {
    console.log(`Seed de pets: ${removed} entradas obsoletas removidas.`);
  }

  for (const raw of pets) {
    const pet = withPetContext(withPetCategory(withPetRarity({ ...raw, guideType: 'MASCOTE' })));
    const existing = await Item.findOne({ where: { title: pet.title, guideType: 'MASCOTE' } });

    if (existing) {
      await existing.update({
        category: pet.category,
        rating: pet.rating,
        rarity: pet.rarity,
        description: pet.description,
        guide: pet.guide,
        howTo: pet.howTo,
        averageTime: pet.averageTime,
        location: pet.location,
        status: existing.status || pet.status,
      });
      updated += 1;
    } else {
      await Item.create(pet);
      inserted += 1;
    }
  }

  console.log(`Seed de pets: ${inserted} inseridos, ${updated} atualizados (total ${pets.length}).`);
}

module.exports = { seedPets };
