const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  
  name: { 
    type: String, 
    required: true 
  },
  
  email: { 
    type: String, 
    required: true 
  },
  
  password: { 
    type: String, required: true 
  },

  resetToken: {
    type: String, 
    default: null 
  }, 

  resetTokenExpiration: {
    type: Date, 
    default: null 
  }, 
  
  securityKey: { 
    type: String, 
    required: true 
  },
  
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
