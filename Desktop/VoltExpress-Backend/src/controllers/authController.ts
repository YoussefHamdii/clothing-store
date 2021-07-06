import * as express from 'express';
import * as bcrypt from 'bcrypt';
import LoginDto from '../dtos/login.dto';
import registerDto from '../dtos/register.dto';
import IController from '../interfaces/IController';
import IUser from '../interfaces/IUser';
import validationMiddleware from '../middleware/validationMiddleware';
import userModel from '../models/User';
import voltIdModel from '../models/VoltId';
import HttpException from '../exceptions/httpException';
import createToken from '../utils/createToken';
import Response from './../modules/Response';
import authMiddleware from './../middleware/authMiddleware';
import IUserRequest from './../interfaces/IUserRequest';
import { userRoles } from '../utils/constants';

class authController implements IController {
  path: string;
  router: express.Router;

  constructor() {
    this.path = '/auth';
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.login
    );
    this.router.post(
      `${this.path}/register`,
      authMiddleware,
      validationMiddleware(registerDto),
      this.register
    );
    this.router.post(
      `${this.path}/refreshToken`,
      authMiddleware,
      this.refreshToken
    );
    this.router.get(`${this.path}/userRoles`, authMiddleware, this.userRoles);
    this.router.get(`${this.path}/viewUsers`, authMiddleware, this.viewUsers);
    this.router.post(
      `${this.path}/courierData`,
      authMiddleware,
      this.courierData
    );
    this.router.put(
      `${this.path}/changePassword`,
      authMiddleware,
      this.changePassword
    );
    this.router.put(
      `${this.path}/resetPassword`,
      authMiddleware,
      this.resetPassword
    );
  }

  //Expected Input:
  //1- Email
  //2- Password
  private login = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const loginData: LoginDto = request.body;

    await userModel
      .findOne({
        email: loginData.email.toLowerCase(),
      })
      .then(async (user: IUser) => {
        if (user) {
          await bcrypt
            .compare(loginData.password, user.password)
            .then((matched: boolean) => {
              if (matched) {
                const refreshToken = createToken(user, 604800);
                const accessToken = createToken(user, 86400);
                response.status(200).send(
                  new Response('Login Success', {
                    refreshToken,
                    accessToken,
                    userRole: user.role,
                    userVoltId: user.voltId
                  })
                );
              } else {
                next(new HttpException(401, 'Incorrect email or password!'));
              }
            })
            .catch((error) => {
              next(new HttpException(500, error));
            });
        } else {
          next(new HttpException(401, 'Incorrect email or password!'));
        }
      })
      .catch((error) => {
        next(new HttpException(500, error));
      });
  };

  private register = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin') {
      const registerData: registerDto = request.body;
      await userModel
        .findOne({
          email: registerData.email.toLowerCase(),
        })
        .then(async (user: IUser) => {
          if (!user) {
            await bcrypt
              .hash(registerData.password, 10)
              .then(async (hashedPassword) => {
                let registerDataToEnter = {
                  name: registerData.name,
                  email: registerData.email.toLowerCase(),
                  password: hashedPassword,
                  role: registerData.role,
                  phoneNumber: {
                    phoneNumber1: registerData.phoneNumber1,
                    phoneNumber2: registerData.phoneNumber2,
                  },
                  voltId: '',
                };
                await voltIdModel
                  .findOneAndUpdate({ type: 'User' }, { $inc: { max: 1 } })
                  .then((oldRec) => {
                    if (oldRec) {
                      registerDataToEnter.voltId = `V_U${oldRec.max}`;
                      const createdUser = new userModel(registerDataToEnter);
                      createdUser
                        .save()
                        .then((savedUser: IUser) => {
                          response
                            .status(201)
                            .send(new Response('User Created Successfully'));
                        })
                        .catch((err) => {
                          next(new HttpException(500, 'Internal Server Error'));
                        });
                    } else {
                      next(new HttpException(404, 'Not found Max!'));
                    }
                  })
                  .catch((error) => {
                    next(new HttpException(500, error));
                  });
              })
              .catch((error) => {
                next(new HttpException(500, error));
              });
          } else {
            next(
              new HttpException(
                409,
                'This email account is already registered!'
              )
            );
          }
        })
        .catch((error) => {
          next(new HttpException(500, error));
        });
    } else {
      next(new HttpException(401, 'Not Authorized Account'));
    }
  };

  private refreshToken = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const newAccessToken = createToken(request.user, 86400);
    response.status(200).send(new Response(undefined, { newAccessToken }));
  };

  private userRoles = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    response.status(200).send(new Response(undefined, { userRoles }));
  };

  private changePassword = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (
      request.user._id === request.body.userId ||
      request.user.role === 'Admin'
    ) {
      await bcrypt
        .hash(request.body.newPassword, 10)
        .then(async (hashed) => {
          await userModel
            .findByIdAndUpdate(request.body.userId, { password: hashed })
            .then((updatedUser) => {
              if (updatedUser) {
                response.status(200).send(new Response('Password Changed'));
              } else {
                next(new HttpException(404, 'User Not Found!'));
              }
            })
            .catch(() => {
              next(new HttpException(500, 'Internal Server Error'));
            });
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };
  
  private resetPassword = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    let newPassword = request.body;
    await bcrypt
      .compare(newPassword.oldPassword, request.user.password)
      .then(async (value: boolean) => {
        if (value) {
          await bcrypt
            .hash(newPassword.newPassword, 10)
            .then(async (pass: string) => {
              request.user.password = pass;
              await request.user
                .save()
                .then((user: IUser) => {
                  response
                    .status(201)
                    .send(new Response('Password Updated Successfully'));
                })
                .catch((err) => {
                  next(new HttpException(500, err));
                });
            })
            .catch((err) => {
              next(new HttpException(500, err));
            });
        } else {
          next(new HttpException(401, 'Old Password Dosent Match'));
        }
      })
      .catch((err) => {
        next(new HttpException(500, err));
      });
  };

  private courierData = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    await userModel
      .findById(request.body.courierId)
      .then((courier) => {
        if (courier) {
          response.status(200).send(new Response(undefined, courier));
        } else {
          next(new HttpException(404, 'Courier Not Found!'));
        }
      })
      .catch((error) => {
        next(new HttpException(500, 'Internal Server Error'));
      });
  };

  private viewUsers = async (
    request: IUserRequest,
    response: express.Response,
    next: express.NextFunction
  ) => {
    if (request.user.role === 'Admin') {
      await userModel
        .find()
        .sort({ voltId: -1 })
        .collation({ locale: 'en_US', numericOrdering: true })
        .then((users: IUser[]) => {
          if (users) {
            response.status(200).send(new Response(undefined, users));
          } else {
            next(new HttpException(500, 'Internal Server Error'));
          }
        })
        .catch((error) => {
          next(new HttpException(500, 'Internal Server Error'));
        });
    } else {
      next(new HttpException(401, 'Not Authorized User'));
    }
  };
}

export default authController;
