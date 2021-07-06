import App from './app';
import * as dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import authController from './controllers/authController';
import orderController from './controllers/orderController';
import pickupController from './controllers/pickupController';

dotenv.config();
validateEnv();


const app = new App([new authController(), new orderController(), new pickupController()]);

app.listen();
