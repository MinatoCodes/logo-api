const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: '✅ API is healthy', timestamp: Date.now() });
});

module.exports = router;
