import { Register } from "./register";
// import { Login } from "./login";
import { Logout } from "./logout";

//import from libraries
import { Collection, Db, MongoClient } from "mongodb";
require("dotenv").config();

// import types
import { beforeAll } from "../types/index";

// Tests time configuration - for each 'describe'
jest.setTimeout(5000);

describe("Authentication", () => {
  //  test's global vars
  console.log(process.env.DB, ":envvvvv");
  let db: Db;
  let connection: MongoClient;

  const collections: Promise<beforeAll> = new Promise(
    async (resolve, reject) => {
      connection = new MongoClient(
        `mongodb://192.168.1.111:27017/${process.env.DB}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      await connection.connect();

      db = connection.db(process.env.DB); // together_test
      resolve({
        users: db.collection("users"),
        refreshTokens: db.collection("refreshtokens"),
        accessTokens: db.collection("accesstokens"),
      });
    }
  );

  beforeAll(async () => {
    await page.goto("http://192.168.1.111:3000/register");
    
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
  });

  Register(collections);
});
