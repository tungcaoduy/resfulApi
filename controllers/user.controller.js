const mongoose = require("mongoose");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.get_all_user = (req, res, next) => {
  Users.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length === 0) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      //   bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      console.log("=======", req.body.password, user[0].password);

      if (req.body.password !== user[0].password) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      if (req.body.password === user[0].password) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id,
          },
          "secret",
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          message: "Auth Successful",
          token: token,
        });
      }
      res.status(401).json({
        message: "Auth failed",
      });
      //   });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.signup_user = (req, res, next) => {
  Users.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const user = new Users({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((err) => {
                res.status(500).json({ error: err });
              });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.delete_user = (req, res, next) => {
  Users.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User delete success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
