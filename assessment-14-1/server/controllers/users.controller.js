var users = require('../models/users');

module.exports = {
  getUserDetails: async (req, res) => {
    try {
      const result = await users.findOne({ _id: req.params.userId })
        .populate('city', 'name')
        .populate('state', 'name');
        
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }
};