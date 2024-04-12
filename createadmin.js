const bcrypt = require('bcrypt');
const User = require('./app/models/user');

// Assuming you're using async/await syntax
async function createAdminUser() {
  try {
    const password = 'oishi123'; // Plain text password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    
    const newAdminUser = await User.create({
      name: 'Oishi Bhattacharyya',
      email: 'admin@gmail.com',
      password: hashedPassword, // Store the hashed password in the database
      role: 'admin' // Set the role to 'admin'
    });
    console.log('Admin user created:', newAdminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Call the createAdminUser function
createAdminUser();
