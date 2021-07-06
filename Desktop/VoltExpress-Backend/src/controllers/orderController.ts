import * as express from 'express';
import IController from '../interfaces/IController';
import IUserRequest from '../interfaces/IUserRequest';
import validationMiddleware from '../middleware/validationMiddleware';
import authMiddleware from '../middleware/authMiddleware';
import CreateOrderDto from '../dtos/createOrder.dto';
import IOrder from '../interfaces/IOrder';
import orderModel from '../models/Order';
import HttpException from '../exceptions/httpException';
import Response from './../modules/Response';
import orderStatusModel from './../models/OrderStatus';
import IOrderStatus from './../interfaces/IOrderStatus';
import bulkOrderDto from '../dtos/bulkOrder.dto';
import { shipmentTypes } from '../utils/constants';
import { getOrdersWithStatus } from '../utils/getOrderWithStatus';
import SetStatusDto from '../dtos/setStatus.dto';
import IStatus from './../interfaces/IStatus';
import OrderDto from './../dtos/order.dto';
import voltIdModel from '../models/VoltId';
import userModel from '../models/User';
import IUser from '../interfaces/IUser';

class orderController implements IController {
  public path: string;
  public router: express.Router;

  constructor() {
    this.path = '/order';
    this.router = express.Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/makeOrder`,
      authMiddleware,
      validationMiddleware(CreateOrderDto),
      this.makeOrder
    );
    this.router.get(
      `${this.path}/viewClientOrders`,
      authMiddleware,
      this.viewClientOrders
    );
    this.router.get(
      `
    ${this.path}/getShipmentTypes`,
      this.getShipmentTypes
    );
    this.router.get(
      `
    ${this.path}/getOrderStatuses`,
      this.getOrderStatuses
    );
    this.router.post(
      `${this.path}/makeBulkOrder`,
      authMiddleware,
      validationMiddleware(bulkOrderDto),
      this.makeBulkOrder
    );
    this.router.get(
      `${this.path}/viewPendingOrders`,
      authMiddleware,
      this.viewPendingOrders
    );
    this.router.patch(
      `${this.path}/setOrderStatus`,
      authMiddleware,
      validationMiddleware(SetStatusDto),
      this.setOrderStatus
    );
    this.router.patch(
      `${this.path}/assignOrder`,
      authMiddleware,
      validationMiddleware(OrderDto),
      this.assignOrder
    );
    this.router.get(
      `${this.path}/getAssignedOrders`,
      authMiddleware,
      this.getAssignedOrders
    );
    this.router.get(`${this.path}/getOrders`, authMiddleware, this.getOrders);
    this.router.post(
      `${this.path}/getPolicy`,
      authMiddleware,
      validationMiddleware(OrderDto),
      this.getPolicy
    );

    this.router.patch(
      `${this.path}/deliverCash`,
      authMiddleware,
      validationMiddleware(OrderDto),
      this.deliverCash
    );
  }

  //Made for client
  private makeOrder = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    let order: CreateOrderDto = request.body;

    if (request.user.role === 'Client') {
      await orderStatusModel
        .findOne({ status: 'Pending' })
        .then(async (orderStatus: IOrderStatus) => {
          await voltIdModel
            .findOneAndUpdate({ type: 'Order' }, { $inc: { max: 1 } })
            .then(async (oldRec) => {
              await orderModel
                .create({
                  ...order,
                  userId: request.user._id,
                  userVoltId: request.user.voltId,
                  'status.statusId': orderStatus._id,
                  voltId: `V_O${oldRec.max}`,
                })
                .then((order: IOrder) => {
                  if (order) {
                    response
                      .status(201)
                      .send(new Response('Order Created Succesfully'));
                  } else {
                    next(new HttpException(500, 'Could not create order!'));
                  }
                })
                .catch((error) => {
                  next(new HttpException(500, error));
                });
            });
        })

        .catch((err) => {});
    } else {
      next(new HttpException(400, 'Unauthorized User!'));
    }
  };

  //Made for client
  //input shape
  // {
  //   orders:[
  //     {
  // order1
  //     },
  //     {
  // order2
  //     }
  //   ]
  // }
  private makeBulkOrder = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    let orders: IOrder[] = request.body.orders;
    const userId = request.user._id;
    if (request.user.role === 'Client') {
      await orderStatusModel
        .findOne({ status: 'Pending' })
        .then(async (orderStatus: IOrderStatus) => {
          await voltIdModel
            .findOne({ type: 'Order' })
            .then(async(oldRec) => {
              for(let i=0; i<orders.length; i++) {
                await orderModel.create({
                  ...orders[i],
                  'status.statusId': orderStatus._id,
                  userId: userId,
                  userVoltId: request.user.voltId,
                  voltId: `V_O${oldRec.max + i}`,
                })
              }
              oldRec.max = oldRec.max + orders.length;
              await voltIdModel
              oldRec.save();
            })
          })
        .then(() => {
          response
            .status(201)
            .send(new Response('Orders successfuly created!'));
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal server error'));
        });
    }
  };

  //Made for client
  private viewClientOrders = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Client') {
      let status: string = null;
      request.query.status
        ? (status = request.query.status.toString())
        : undefined;

      let statusId: string;
      if (status) {
        await orderStatusModel
          .findOne({ status: status })
          .then(async (orderStatus: IOrderStatus) => {
            statusId = orderStatus._id;
          })
          .catch((err) => {
            next(new HttpException(500, 'Internal Server Error'));
          });
      }
      let query;
      if (status) {
        query = {
          userId: request.user._id,
          status: {
            statusId: statusId,
          },
        };
      } else {
        query = {
          userId: request.user._id,
        };
      }
      await orderModel
        .find(query, '-userId -__v')
        .sort({ createdAt: -1 })
        .then(async (orders: IOrder[]) => {
          await getOrdersWithStatus(orders, status)
            .then((newOrders) => {
              response
                .status(200)
                .send(new Response(undefined, { orders: newOrders }));
            })
            .catch((err) => {
              next(new HttpException(500, 'Internal Server Error'));
            });
        })
        .catch((err) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };

  //Helper method
  private getShipmentTypes = (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (shipmentTypes) {
      response.status(200).send(new Response(undefined, { shipmentTypes }));
    } else {
      next(new HttpException(500, 'Internal Server Error'));
    }
  };

  //Helper method
  private getOrderStatuses = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await orderStatusModel
      .find()
      .then((fields) => {
        const statuses = fields.map((field) => {
          return field.status;
        });
        response.status(200).send(new Response(undefined, { statuses }));
      })
      .catch((error) => {
        next(new HttpException(500, error));
      });
  };

  //Made for courier
  private viewPendingOrders = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const filteredArea = request.query.area
      ? request.query.area.toString()
      : undefined;
    const statusName = 'Pending';
    let query;
    if (request.user.role === 'Courier' || request.user.role === 'Admin') {
      await orderStatusModel
        .findOne({ status: statusName })
        .then(async (orderStatus: IOrderStatus) => {
          const pendingId = orderStatus._id;
          if (filteredArea === undefined) {
            query = {
              "status.statusId": pendingId,
              assignable: true,
            };
          } else {
            query = {
              "status.statusId": pendingId,
              'recieverDetails.area': filteredArea,
              assignable: true
            };
          }
          await orderModel
            .find(query, '-__v')
            .sort({ createdAt: -1 })
            .then(async (todoOrders) => {
              await getOrdersWithStatus(todoOrders,statusName)
                .then((newOrders) => {
                  response
                    .status(201)
                    .send(new Response(undefined, { newOrders }));
                })
                .catch((error) => {
                  next(new HttpException(500, error));
                });
            })
            .catch((error) => {
              next(new HttpException(500, error));
            });
        })
        .catch((error) => {
          next(new HttpException(500, error));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };

  private assignOrder = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const order: OrderDto = request.body;
    if (request.user.role === 'Courier') {
      await orderModel
        .findById(order.orderId)
        .then(async(order: IOrder) => {
          if (order.assignedCourier) {
            next(new HttpException(409, 'Already Assigned to other courier'));
          } else {
            order.assignedCourier = request.user._id;
            await orderStatusModel
            .findOne({status:"Out For Delivery"})
            .then(async(stat) => {
              if(stat){
                await userModel
                .findById(request.user._id)
                .then((courier) => {
                  order.assignedCourierVoltId = courier.voltId;
                  order.status.statusId = stat._id;
                  order.assignable = false;
                  order
                  .save()
                  .then((saved) => {
                    response
                      .status(200)
                      .send(new Response(`Order Assigned To ${request.user.name}`));
                  })
                  .catch((error) => {
                    next(new HttpException(500, 'Internal Sever Error'));
                  });
                })
                .catch((error) => {
                  next(new HttpException(500, 'Internal Sever Error'));
                })
              }else{
                next(new HttpException(500, 'Internal Sever Error'));
              }
            })
            .catch(error => {

            }) 
          }
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Sever Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };
  //Made for courier
  // expected input
  // {
  //   "orderId",
  //   "newStatus"
  // }
  private setOrderStatus = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const role = request.user.role;
    const setStatus: SetStatusDto = request.body;

    if (role === 'Courier' || role === 'Admin') {
      await orderStatusModel
        .findOne({ status: setStatus.newStatus })
        .then(async (status: IOrderStatus) => {
          await orderModel
            .findById(setStatus.orderId)
            .then((order: IOrder) => {
              if (
                role === 'Admin' ||
                request.user._id.equals(order.assignedCourier)
              ) {
                if (setStatus.newStatus === 'Undelivered') {
                  if (setStatus.feedback) {
                    order.status.feedback = setStatus.feedback;
                  } else {
                    next(
                      new HttpException(
                        400,
                        'Courier must provide reason for undelivered status'
                      )
                    );
                  }
                }
                order.status.statusId = status._id;
                order.assignedCourier = undefined;
                order.assignedCourierVoltId = undefined;
                order.assignable = true;
                order
                  .save()
                  .then((order: IOrder) => {
                    response
                      .status(200)
                      .send(new Response('Order Status Set Successfully'));
                  })
                  .catch((error) => {
                    next(new HttpException(500, 'Internal Server Error'));
                  });
              } else {
                next(
                  new HttpException(
                    401,
                    'This Order is assigned to another courier'
                  )
                );
              }
            })
            .catch((error) => {
              next(new HttpException(500, 'Internal Server Error'));
            });
        })
        .catch(() => {
          next(new HttpException(500, 'Could Not Update User'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };

  private getAssignedOrders = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Courier') {
      await orderStatusModel
      .findOne({status: 'Out For Delivery'})
      .then(async(stat) => {
        await orderModel
        .find({
          assignedCourier: request.user._id,
          "status.statusId" : stat._id
        })
        .sort({ createdAt: -1 })
        .then(async (assignedOrders: IOrder[]) => {
          if (assignedOrders.length > 0) {
              await getOrdersWithStatus(assignedOrders, undefined)
              .then((newOrders) => {
                response
                  .status(200)
                  .send(new Response('Assigned Orders!', newOrders));
              })
              .catch((error) => {
                next(new HttpException(500, 'Internal Server Error'));
              });
          } else if (assignedOrders.length === 0) {
            response
              .status(404)
              .send(
                new Response(`${request.user.name} has no assigned orders!`)
              );
          } else {
            next(new HttpException(500, 'Internal Server Error'));
          }
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
      })
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };

  private getOrders = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin') {
      await orderModel
        .find()
        .sort({ createdAt: -1 })
        .then(async (orders) => {
          await getOrdersWithStatus(orders, undefined).then((newOrders) => {
            response.status(200).send(new Response(undefined, newOrders));
          });
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };

  private getPolicy = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin') {
      const orderIds = request.body.orderIds;
      let policies = [];
      await orderModel
        .find({ _id: { $in: orderIds } })
        .then(async (orders: IOrder[]) => {
          for (let i = 0; i < orders.length; i++) {
            await userModel.findById(orders[i].userId).then((user: IUser) => {
              let policy = {
                dockerNo: orders[i].voltId,
                bookingDate: new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                }).format(new Date(Date.parse(orders[i]['createdAt']))),
                bookingPerson: orders[i].shipperName,
                shipper: orders[i].shipperName,
                shipperPhoneNumber: user.phoneNumber.phoneNumber1,
                recieverDetails: orders[i].recieverDetails,
                description: orders[i].description,
                shipmentType: orders[i].shipmentType,
                price: orders[i].price,
              };
              policies.push(policy);
            });
          }
        })
        .then(() => {
          response.status(200).send(new Response(undefined, policies));
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized'));
    }
  };

  private deliverCash = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin') {
      await orderModel
        .findByIdAndUpdate(request.body.orderId, { cashDelivered: true })
        .then((order) => {
          response.status(200).send(new Response('Cash Delivered Succesfuly'));
        })
        .catch(() => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized'));
    }
  };
}

export default orderController;
