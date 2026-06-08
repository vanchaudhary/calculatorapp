const express = require('express');
const apiRoutes = require('./routes/api');
const config = require('./config/config');

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});