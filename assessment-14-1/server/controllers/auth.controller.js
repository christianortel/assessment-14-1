const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userM = require("../models/users");
const { secretKey } = require("../config/config");

module.exports = {
  userLogin: async (req, res) => {
    let loginType;
    if (req.body.emailPhone && req.body.password) {
      if (isNaN(req.body.emailPhone)) loginType = "email";
      else loginType = "phoneNo";

      try {
        const query = {};
        query[loginType] = req.body.emailPhone;

        const data = await userM.findOne(query);

        if (data) {
          const passMatch = await bcrypt.compare(req.body.password, data.password);
          if (passMatch) {
            let jwtData = {
              _id: data["_id"],
              fname: data["fname"],
              lname: data["lname"],
              email: data["email"],
              isAdmin: data["isAdmin"]
            };
            var token = jwt.sign({ user: jwtData }, secretKey);
            res.status(200).json({ message: "Login Successful", token: token });
          } else {
            res.status(401).json({ message: "Invalid Credentials" });
          }
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      res.status(400).json({ message: "Provide all Credentials" });
    }
  },

  userRegistration: async (req, res) => {
    try {
      const users = new userM();
      users.fname = req.body.fname;
      users.lname = req.body.lName;
      users.email = req.body.email;
      users.phoneNo = req.body.phoneNo;
      users.state = req.body.state;
      users.city = req.body.city;
      users.pincode = req.body.pincode;
      users.userType = req.body.user_type;
      users.createdOn = new Date();

      const hash = await bcrypt.hash(req.body.password, 10);
      users.password = hash;

      const data = await users.save();
      res.status(200).json({ message: "User Added Successfully", id: data._id });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  userList: async (req, res) => {
    try {
      const data = await userM.find();
      res.status(200).json({ message: "Success", data });
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong", data: err });
    }
  },

  changePass: async (req, res) => {
    try {
      const user = await userM.findOne({ _id: req.body._id });
      if (user) {
        const hash = await bcrypt.hash(req.body.password, 10);
        const result = await userM.updateOne({ _id: req.body._id }, { password: hash });
        res.status(200).json({
          message: "Password Changed Successfully",
          id: result
        });
      } else {
        res.status(400).json({ message: "User not found" });
      }
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong", data: err });
    }
  }
};
