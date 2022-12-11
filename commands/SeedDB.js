const dotenv = require('dotenv');
dotenv.config();
const { faker } = require('@faker-js/faker');

const { db, UserModel, TeamModel } = require('../src/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    await db.authenticate();
    await db.sync({ force: true });
    const hashedPassword = await bcrypt.hash('password', 10);

    for (let i = 0; i < 20; i += 1) {
      const userKey = `user_${i}`;
      const user = await UserModel.create({
        email: `${userKey}@gmail.com`,
        password: hashedPassword,
        is_admin: i % 5 == 0,
      });
      for (let j = 0; j < 5; j += 1) {
        await TeamModel.create({
          name: `${userKey}_team_${j}`,
          city: faker.address.city(),
          state: faker.address.state(),
          user_id: user.id,
        });
      }
    }
    console.log('Database has been seeded.');
  } catch (e) {
    console.log(e);
  }
}

seed();
