import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import express, { Application } from "express";
import morgan from "morgan";
import { API_ENDPOINT, PORT } from "./src/constants/constants";
import errorMiddleware from "./src/middleware/ErrorHandler.middleware";
import { resolvers } from "./src/resolvers";
import { typeDefs } from "./src/schemas";
import IController from "./src/types/controller";
import { connectDB } from "./src/utils/dbConnection";
import { dataSourceContext } from "./src/context/context";
import { connectRedis } from "./src/utils/redis-connect";

class App {
  public app: Application;
  public port: number;
  constructor(controllers: IController[]) {
    this.app = express();
    this.port = PORT;

    this.initializeMiddleWares();
    this.initializeControllers(controllers);
    this.startupDB();
    this.startupRedis();
    this.app.use(errorMiddleware);
  }

  private initializeMiddleWares() {
    this.app.use(bodyParser.json());
    // this.app.use(cookieParser(["Authorization", "AccessToken"]));
    this.app.use(morgan("dev"));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Credentials", "true");
      // set the CORS policy
      res.header("Access-Control-Allow-Origin", "include");
      // set the CORS headers
      res.header(
        "Access-Control-Allow-Headers",
        "origin, X-Requested-With,Content-Type,Accept, Authorization"
      );
      // set the CORS method headers
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
        return res.status(200).json({});
      }
      next();
    });
  }
  private async startupDB() {
    try {
      await connectDB();
      console.log("🌍 | Database connected");
    } catch (error) {
      console.error("❌ | Database connection failed", error);
    }
  }
  private async startupRedis() {
    try {
      await connectRedis();
      console.log("🌍 | Redis connected");
    } catch (error) {
      console.error("❌ | Redis connection failed", error);
    }

  }
  public async startApolloServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => dataSourceContext
    });

    await server.start();
    server.applyMiddleware({ app: this.app });
  }

  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
      this.app.use(`${API_ENDPOINT}`, controller.router);
    });
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🌋 | App listening on the port ${this.port}`);
    });
  }
}

export default App;
