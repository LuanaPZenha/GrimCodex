const profileService = require('../services/profileService');

async function list(req, res, next) {
  try {
    const profiles = await profileService.listProfiles();
    res.json(profiles);
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const profile = await profileService.getOwnProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function getByUsername(req, res, next) {
  try {
    const profile = await profileService.getProfileByUsername(req.params.username);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateStats(req, res, next) {
  try {
    const profile = await profileService.updateOwnStats(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  me,
  getByUsername,
  updateStats,
};
