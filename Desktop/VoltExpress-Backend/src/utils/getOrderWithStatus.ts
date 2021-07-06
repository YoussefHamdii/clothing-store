import IOrder from '../interfaces/IOrder';
import IOrderStatus from '../interfaces/IOrderStatus';

import orderStatusModel from '../models/OrderStatus';

export const getOrdersWithStatus = async (
    orders: IOrder[],
    status: string
  ): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
      let newOrders = [];
      let counter = 0;
      if(orders.length > 0){
        orders.forEach(async (order: IOrder, index: number) => {
          newOrders.push(order);
          if (status) {
            counter +=1;
            newOrders[index] = { ...order.toObject(), status };
          } else {
            await orderStatusModel
              .findById(newOrders[index].status.statusId)
              .then((orderStatus: IOrderStatus) => {
                if(newOrders[index].status.feedback){
                  counter +=1;
                  newOrders[index] = {
                    ...order.toObject(),
                    feedback: newOrders[index].status.feedback,
                    status: orderStatus.status
                  };
                }else{ 
                  counter +=1;               
                  newOrders[index] = {
                    ...order.toObject(),
                    status: orderStatus.status,
                  };
                }
              })
              .catch((err) => {
                reject(err);
              });
          }
          if (counter === orders.length){
            resolve(newOrders);
          }
        });
      }else{
        resolve([]);
      }
      
    });
  };