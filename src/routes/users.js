const express = require('express');
const { UserModel } = require('../db');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const responseFormat = require('../helpers/request.formatter');

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await UserModel.findAll();

    res.json(responseFormat('users', users));
  } catch (error) {
    next(error);
  }
});

userRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      res.status(404).json(responseFormat('not_found', null));
      return;
    }
    res.json(responseFormat('user', user));
  } catch (error) {
    next(error);
  }
});

userRouter.post('/', async (req, res) => {
  try {
    const userData = req.body;
    userData.password = bcrypt.hash(userData.password, 10);
    userData.is_admin = false;
    const user = await UserModel.create(req.body);
    res.json(responseFormat('user', user));
  } catch (error) {
    next(error);
  }
});

userRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const email = req.body.email;
    const user = await UserModel.findByPk(id);
    if (!user) {
      res.status(404).json(responseFormat('not_found', null));
      return;
    }
    await user.update({ email });
    res.json(responseFormat('user', user));
  } catch (error) {
    next(error);
  }
});

userRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findByPk(id);
    if (!user) {
      res.status(404).json(responseFormat('not_found', null));
      return;
    }
    await user.destroy();
    res.status(204).send('');
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
