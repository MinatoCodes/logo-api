const express = require('express');
const router = express.Router();
const effects = require('../effects');

router.get('/', (req, res) => {
  res.json({
    count: effects.length,
    effects
  });
});

module.exports = router;
