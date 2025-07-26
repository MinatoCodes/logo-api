const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use('/health', require('./routes/health'));
app.use('/effect', require('./routes/effect'));
app.use('/generate', require('./routes/generate'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
