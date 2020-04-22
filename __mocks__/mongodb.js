import { JsonWebTokenError } from 'jsonwebtoken';

export class MongoClient {
  connect = () => {
    return {
      db: () => {
        return {
          collection: () => {
            return {
              findOne: () => {
                debugger;
                return global.findOne;
              },
              insertOne: () => {
                return global.insertOne;
              },
              findOneAndUpdate: () => {
                return global.findOneAndUpdate;
              },
            };
          },
        };
      },
    };
  };
}

export class ObjectID {}
