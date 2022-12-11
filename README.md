# Sequelize CheatSheet

An example project to show you how to use Sequelize if you never used it before.

## Setup

You will need to install docker or install postgres on your laptop / computer.  If you already have progres install skip step 2. [Postman File](./postman-collection.json) you can download to play around with the api.

1. docker-compose up -d
2. copy over the example .env file and change to fit your database
3. Run npm run seed
4. Run npm start

## Command

Start the app

```bash
npm start
```
Seeds the database

```bash
npm run seed
```

## Notes

There is no validation which is terrible.  This is for example only.  You should have validation and security around any production based API.

## Sequelize Setup

Create a function that returns a model.

```js
const { DataTypes } = require('sequelize');

module.exports = (db) => {
  return db.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
```

Create a database.js that initializes the database.  Import all your models here.  This is where all your relationships will go.  Export all the models and relationships.

```js
const { Sequelize } = require('sequelize');
const User = require('./model/User');
const Team = require('./model/Team');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log,
  }
);

const UserModel = User(db);
const TeamModel = Team(db);

UserModel.Teams = UserModel.hasMany(TeamModel, { foreignKey: 'user_id' });
TeamModel.User = TeamModel.belongsTo(UserModel, { foreignKey: 'user_id' });
module.exports = { db, UserModel, TeamModel };

```

In your index.js wrap your app.listen in authenticate promise callback.  That way you know the database is connected before you start accepting requests.

```js
const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config();

const { db } = require('./db');


db.authenticate().then(() => {
  app.listen(process.env.PORT, function () {
    console.log('application started');
  });
});
```

## Queries

Selecting all everything

```js
const users = await UserModel.findAll();
```

Selecting something by id

```js
    const user = await UserModel.findByPk(req.params.id);
```

Selecting with a where clause

```js
const teamWithName = await TeamModel.findOne({
    where: {
    name: req.body.name,
    },
});
```

Selecting with a more advanced where clause

```js
const teamWithName = await TeamModel.findOne({
      where: {
        name: req.body.name,
        id: {
          [Op.not]: team.id,
        },
      },
    });
```

Creating 

```js
    const user = await UserModel.create(req.body);
```

Updating

```js
    await user.update({ email });
```

Deleting

```js
    await user.destroy();
```