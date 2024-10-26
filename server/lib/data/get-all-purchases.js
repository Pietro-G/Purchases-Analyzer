import { MongoClient } from 'mongodb';

const getAllTransactions = async () => {
  const mongoClient = new MongoClient(process.env.MONGO_URI, {
    auth: {
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
    },
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-1',
  });

  const results = await mongoClient
    .db(process.env.MONGO_DB_NAME)
    .collection('purchases')
    .find({})
    .toArray();

  return results.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
};

export default getAllTransactions;
