const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Admin {
  constructor(adminId, password, name, email, address, unitNo, postalCode, department, branch, position, phoneNo, joinDate) {
    this.adminId = adminId;
    this.password = password;
    this.name = name;
    this.email = email;
    this.address = address;
    this.unitNo = unitNo;
    this.postalCode = postalCode;
    this.department = department;
    this.branch = branch;
    this.position = position;
    this.phoneNo = phoneNo;
    this.joinDate = joinDate;
  }

 
}

module.exports = Admin;
