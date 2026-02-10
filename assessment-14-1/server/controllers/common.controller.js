const mongoose = require('mongoose');
var state_model = require('../models/state');
var city_model = require('../models/city');
var users = require('../models/users');

module.exports = {
  getStateList: async (req, res) => {
    try {
      const data = await state_model.find({ is_active: true });
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  addState: async (req, res) => {
    try {
      var state = new state_model();
      state.name = req.body.name;
      await state.save();
      res.json({ message: 'State added successfully' });
    } catch (err) {
      res.send(err);
    }
  },
  getAllCities: async (req, res) => {
    try {
      const data = await city_model.find({ is_active: true }).populate('state_id', 'name');
      res.status(200).json(data);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  getCityList: async (req, res) => {
    try {
      const data = await city_model.find({ state_id: req.params.state_id, is_active: true })
        .populate('state_id', 'name');
      res.status(200).json(data);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  addCity: async (req, res) => {
    try {
      var city = new city_model(req.body);
      const result = await city.save();
      console.log({ result });
      if (result) res.status(200).json({ message: 'City added successfully' });
      else throw new Error('Something Went Wrong');
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  removeCity: async (req, res) => {
    try {
      const result = await city_model.deleteOne({ _id: req.params.cityId });
      res.status(200).json({ message: 'City removed successfully', data: result });
    } catch (err) {
      res.status(400).send(err);
    }
  },
  checkemailAvailability: async (req, res) => {
    try {
      var email = req.params.email;
      const result = await users.find({ email: email });
      if (result.length > 0)
        res.status(200).json({ response: true });
      else
        res.status(200).json({ response: false });
    } catch (err) {
      res.status(400).send(err);
    }
  }
};