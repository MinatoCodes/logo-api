const effects = require('../effects');

module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    total: effects.length,
    effects
  });
};
