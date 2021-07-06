import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as express from 'express';
import * as cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware';
import IController from 'interfaces/IController';

import * as swaggerUi from 'swagger-ui-express'


class App {
  private app: express.Application;
  private PORT: number;

  constructor(controllers: IController[]) {
    this.app = express();
    this.PORT = parseInt(process.env.PORT) || 5000;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorMiddleware();
    this.connectToDatabase();
  }
  private initializeErrorMiddleware() {
    this.app.use('/', swaggerUi.serve, swaggerUi.setup(undefined,{
      swaggerOptions: {
        url: "/swagger.json"
      }
    }));
    this.app.use(errorMiddleware);
  }
  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }
  private initializeControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
      this.app.use('/api/', controller.router);
    });
  }
  private connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD } = process.env;
    mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@voltexpress.q899i.mongodb.net/VoltExpress?retryWrites=true&w=majority`,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err) => {
        if (err) {
          console.log('Error in Database connection');
        } else {
          console.log('Connected To Database');
        }
      }
    );
  }
  public listen() {
    this.app.listen(this.PORT, () => {
      console.log(`App Listening On Port ${this.PORT}`);
    });
  }
}

export default App;
