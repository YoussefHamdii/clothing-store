import * as express from 'express';

import IController from '../interfaces/IController';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import createPickupDto from '../dtos/createPickup.dto';
import IUserRequest from '../interfaces/IUserRequest';
import HttpException from '../exceptions/httpException';
import IPickup from '../interfaces/IPickup';
import pickupModel from '../models/Pickup';
import Response from '../modules/Response';
import AssignPickupDto from '../dtos/pickup.dto';
import PickupDto from './../dtos/pickup.dto';
import * as mongoose from 'mongoose';
import { isInstance } from 'class-validator';
import voltIdModel from '../models/VoltId';

class pickupController implements IController {
  public path: string;
  public router: express.Router;

  constructor() {
    this.path = '/pickup';
    this.router = express.Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/makePickup`,
      authMiddleware,
      validationMiddleware(createPickupDto),
      this.makePickup
    );
    this.router.get(
      `${this.path}/viewClientPickups`,
      authMiddleware,
      this.viewClientPickups
    );
    this.router.get(
      `${this.path}/viewPendingPickups`,
      authMiddleware,
      this.viewPendingPickups
    );
    this.router.patch(
      `${this.path}/assignPickup`,
      authMiddleware,
      validationMiddleware(PickupDto),
      this.assignPickup
    );
    this.router.post(
      `${this.path}/pickup`,
      authMiddleware,
      validationMiddleware(PickupDto),
      this.pickup
    );
    this.router.get(
      `${this.path}/getAssignedPickups`,
      authMiddleware,
      this.getAssignedPickups
    )
  }

  private makePickup = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const role = request.user.role;

    let pickup = request.body;
    pickup.userId = request.user._id;
    await voltIdModel
    .findOneAndUpdate({type:"Pickup"},{$inc: {'max': 1 }})
    .then((oldRec) => {
      pickup.voltId = `V_P${oldRec.max}`
    })

    if (role === 'Client') {
      const savedPickup: IPickup = pickup;
      await pickupModel
        .create(savedPickup)
        .then((savedPost: IPickup) => {
          if (savedPost) {
            response
              .status(201)
              .send(new Response('Pickup Created Succesfully'));
          } else {
            next(new HttpException(500, 'Could not create order!'));
          }
        })
        .catch((error) => {
          next(new HttpException(500, error));
        });
    } else {
      next(new HttpException(400, 'Unauthorized User!'));
    }
  };
  private viewClientPickups = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Client') {
      await pickupModel
        .find(
          {
            userId: request.user._id,
          },
          '-userId -__v'
        ).sort({"createdAt":-1})
        .then((pickups) => {
          response.status(200).send(new Response(undefined, { pickups }));
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    }
  };
  private viewPendingPickups = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin' || request.user.role === 'Courier') {
      const area = request.query.area ? request.query.area : undefined;
      let query;
      area
        ? (query = {
            'pickupDetails.area': area,
            isPickedup: false,
            assignedCourrier: { $exists: false },
          })
        : (query = { isPickedup: false, assignedCourrier: { $exists: false } });
      await pickupModel
        .find(query).sort({"createdAt":-1})
        .then((pickups: IPickup[]) => {
          response.status(200).send(new Response(undefined, { pickups }));
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };
  private assignPickup = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const pickup: PickupDto = request.body;

    if (request.user.role === 'Courier') {
      await pickupModel
        .findByIdAndUpdate(pickup.pickupId, {
          assignedCourrier: request.user._id,
        })
        .then((pickup: IPickup) => {
          response
            .status(200)
            .send(new Response(`Pickup Assigned to ${request.user.name}`));
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Sever Error'));
        });
    } else {
      next(new HttpException(401, 'User Not Authorized'));
    }
  };
  private pickup = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Courier') {
      const pickup: PickupDto = request.body;
      await pickupModel
        .findById(pickup.pickupId)
        .then(async (pickup: IPickup) => {
          if (request.user._id.equals(pickup.assignedCourier)) {
            pickup.isPickedup = true;
            await pickup
              .save()
              .then((pickup: IPickup) => {
                response
                  .status(200)
                  .send(new Response('Order PickedUp Successfully'));
              })
              .catch((error) => {
                new HttpException(500, 'Internal Server Error');
              });
          } else {
            next(
              new HttpException(
                400,
                'This Pickup is assigned to another courier'
              )
            );
          }
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'User Not Authroized'));
    }
  };

  private getAssignedPickups = (async(
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if(request.user.role === 'Courier'){
      await pickupModel
        .find({
          assignedCourier : request.user._id
        }).sort({"createdAt":-1})
        .then((assignedpickups: IPickup[]) => {
          if(assignedpickups.length > 0){
            response.status(200).send(new Response("Assigned Orders!" , assignedpickups))
          }else if(assignedpickups.length === 0){
            response.status(404).send(new Response(`${request.user.name} has no assigned orders!`));
          }else{
            next(new HttpException(500, 'Internal Server Error'));
          } 
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        })
    }else{
      next(new HttpException(401, 'Not Authorized User'));
    }
  });
}

export default pickupController;
