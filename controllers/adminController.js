require('dotenv').config()
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body; 
    console.log("Login attempt with email:", email); 

    const admin = await Admin.retrieveAdmin(email);
    console.log(admin);
    if (!admin) {
      console.log("User not found for email:", email);
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      const payload = {
        email: admin.email,
        role: admin.role
      };

      const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "1h" }); 

      console.log("Login successful for email:", email); 
      res.json({ message: "Login successful!", token, email: admin.email, role: admin.role }); 
    } else {
      console.log("Password does not match for email:", email);
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error logging in");
  }
}

async function createAdmin(req, res) {
  const { adminId, email, department, branch, position, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath} = req.body;

  try {
    const newUser = await Rider.createRider(adminId, email, department, branch, position, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath);
    if (newUser) {
      res.status(201).json({ message: "Admin created successfully!" });
    } else {
      res.status(400).json({ message: "Error creating admin" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function retrieveAdmin(req, res) {
  const email = req.query.email;

  try {
    const admin = await Admin.retrieveAdmin(email);
    if (admin) {
      res.json({
        riderId: admin.adminId,
        email: admin.email,
        name: admin.name,
        department: admin.department,
        branch: admin.branch,
        position: admin.position,
        address: admin.address,
        unitNo: admin.unitNo,
        postalCode: admin.postalCode,
        country: admin.country,
        phoneNo: admin.phoneNo,
        userBday: admin.userBday,
        imagePath: admin.imagePath,
        role: admin.role,
        joinDate: admin.joinDate,
      });
    } else {
      res.status(404).send("Admin not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
}

async function retrieveAdmins(req, res) {

  try {
    const admins = await Rider.retrieveRiders();

    if (admins) {
      console.log('Admin details in controller:', admins); // Added for debugging

      res.json(admins);
    } else {
      res.status(404).send("Admins not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
}

async function updateAdminEmail(req, res) {
  const {newEmail, oldEmail} = req.body;

  try{
    const admin = await Admin.retrieveAdmin(oldEmail);
    console.log("Attempting to update rider:", admin.name);
    const success = await Admin.updateAdminEmail(newEmail, oldEmail);
    if (success) {
      res.status(200).send("Admin updated successfully");
    } else {
      res.status(404),send("Admin not found");
    }
  } catch (error){
    console.error(error);
    res.status(500).send("Error updating admin");
  }
}

async function deleteAdmin(req, res) {
  const email = req.query.email;

  try {
    const admin = await Admin.retrieveAdmin(email);
    console.log("Attempting to delete admin:", admin.name);
    console.log(admin.name);
    const success = await Admin.deleteAdmin(email);
    if (success) {
      res.status(200).send("Admin deleted successfully");
    } else {
      res.status(404).send("Admin not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting admin");
  }
}

module.exports = {
  login,
  retrieveAdmins,
  createAdmin,
  updateAdminEmail,
  retrieveAdmin,
  deleteAdmin
};
