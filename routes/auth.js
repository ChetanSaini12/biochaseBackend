const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const teamSchema = require("../models/team");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const {
      member1,
      member2,
      member3,
      email,
      cnfemail,
      phoneNum,
      cnfphoneNum,
      username,
      password,
      standard,
      school,
    } = req.body;

    if (
      !member1 ||
      !email ||
      !cnfemail ||
      !phoneNum ||
      !cnfphoneNum ||
      !username ||
      !password ||
      !standard ||
      !school
    ) {
      return res
        .status(422)
        .send({ message: "Please fill all required fields", success: false });
    }

    if (email != cnfemail) {
      return res.status(422).send({
        message: "Confirm Email doesn't match original Email!!",
        success: false,
      });
    }

    if (phoneNum != cnfphoneNum) {
      return res.status(422).send({
        message: "Confirm Phone Number doesn't match original Phone Number!!",
        success: false,
      });
    }

    if (!email.includes("@") || !email.includes(".", email.indexOf("@"))) {
      return res.status(422).send({ message: "Invalid Email", success: false });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .send({
          message: "Password length must be atleast 6 characters",
          success: false,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeam = new teamSchema({
      member1,
      member2,
      member3,
      email,
      phoneNum,
      username,
      password: hashedPassword,
      standard,
      school,
    });

    const savedTeam = await newTeam.save();

    res.status(200).send({
      message: "Successfully Signed Up",
      success: true,
      team: savedTeam,
    });
  } catch (err) {
    console.log("Error during user registration: " + err);
    let error = "Something went wrong";
    if (err.code === 11000) {
      key = Object.keys(err.keyValue)[0];
      error = `${key} already exists`;
    }

    res.status(400).send({ message: error, success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(422)
        .send({ message: "Please fill all required fields", success: false });
    }

    const team = await teamSchema.findOne({ username: username });
    if (!team) {
      return res
        .status(400)
        .send({ message: "Invaild Username", success: false });
    }

    const teamPasswordMatch = await bcrypt.compare(password, team.password);

    if (!teamPasswordMatch) {
      return res
        .status(400)
        .send({ message: "Invaild Password", success: false });
    }

    res.status(200).send({ message: "Successfully Singed In", success: true });
  } catch (err) {
    console.log("Error: " + err);
    res.status(400).send({ message: "SignIn Failed", success: false });
  }
});

module.exports = router;
