const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { port } = require('./config/config');
require("dotenv").config();



const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API working fine' });
});
app.use('/api/', require('./routes/authRoutes'));
app.use('/api/', require('./routes/candidateRoutes'));
app.use('/api/', require('./routes/companyRoutes'));
app.use('/api/', require('./routes/superadminRoutes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});