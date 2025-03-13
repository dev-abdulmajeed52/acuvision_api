const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role });
    await user.save();
    
    const token = generateToken(user);
    res.status(201).json({ token,
      message : 'Register successfully',
      user :{
        name: user.name,
        email: user.email,
        role: user.role
      }
     });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, 
      user :{
        id : user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
       });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};