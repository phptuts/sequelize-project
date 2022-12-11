const express = require('express');
const { Op } = require('sequelize');
const { TeamModel, UserModel } = require('../db');
const teamRouter = express.Router();
const responseFormat = require('../helpers/request.formatter');

teamRouter.get('/', async (req, res, next) => {
  try {
    const teams = await TeamModel.findAll();
    res.json(responseFormat('teams', teams));
  } catch (error) {
    next(error);
  }
});

teamRouter.get('/:id', async (req, res, next) => {
  try {
    const team = await TeamModel.findByPk(req.params.id);
    if (!team) {
      res.status(404).json(responseFormat('not_found', null));
      return;
    }
    res.json(responseFormat('team', team));
  } catch (error) {
    next(error);
  }
});

teamRouter.post('/', async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      res.status(422).json(
        responseFormat('bad_request', {
          user_id: 'Invalid User Id',
        })
      );
      return;
    }

    const teamWithName = await TeamModel.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (teamWithName) {
      res.status(422).json(
        responseFormat('bad_request', {
          name: 'Name is already taken',
        })
      );
      return;
    }

    const team = await TeamModel.create(req.body);
    res.json(responseFormat('team', team));
  } catch (error) {
    next(error);
  }
});

teamRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const team = await TeamModel.findByPk(id);
    if (!team) {
      res
        .status(404)
        .json(responseFormat('not_found', `Team id ${id} not found.`));
      return;
    }

    const userId = req.body.user_id;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      res.status(422).json(
        responseFormat('bad_request', {
          user_id: 'Invalid User Id',
        })
      );
      return;
    }

    const teamWithName = await TeamModel.findOne({
      where: {
        name: req.body.name,
        id: {
          [Op.not]: team.id,
        },
      },
    });
    if (teamWithName) {
      res.status(422).json(
        responseFormat('bad_request', {
          name: 'Name is already taken',
        })
      );
      return;
    }
    await team.update(req.body);
    res.json(responseFormat('team', team));
  } catch (error) {
    next(error);
  }
});

teamRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const team = await TeamModel.findByPk(id);
    if (!team) {
      res.status(404).json(responseFormat('not_found', null));
      return;
    }
    await team.destroy();
    res.status(204).send('');
  } catch (error) {
    next(error);
  }
});
module.exports = teamRouter;
