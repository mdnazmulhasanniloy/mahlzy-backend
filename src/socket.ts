/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import httpStatus from 'http-status';
import AppError from './app/error/AppError';
import getUserDetailsFromToken from './app/helpers/getUserDetailsFromToken';
import callbackFn from './app/utils/callbackFn';
import { User } from './app/modules/user/user.models';
import DeliveryMan from './app/modules/deliveryMan/deliveryMan.models';

const initializeSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Online users
  const onlineUser = new Set();

  io.on('connection', async socket => {
    console.log('connected', socket?.id);

    try {
      //----------------------user token get from front end-------------------------//
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;
      //----------------------check Token and return user details-------------------------//
      const user: any = await getUserDetailsFromToken(token);
      if (!user) {
        // io.emit('io-error', {success:false, message:'invalid Token'});
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      socket.join(user?._id?.toString());

      //----------------------user id set in online array-------------------------//
      onlineUser.add(user?._id?.toString());

      socket.on('check', (data, callback) => {
        callback({ success: true });
      });

      socket.on('update-my-Location', async (data, callback) => {
        if (!data?.location) {
          callbackFn(callback, {
            success: false,
            message: 'location is required',
          });
        }

        const deliveryMan = await DeliveryMan.findByIdAndUpdate(user._id, {
          lastLocation: data.location,
        });
      });
      //-----------------------Disconnect------------------------//
      socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString());
        io.emit('onlineUser', Array.from(onlineUser));
        console.log('disconnect user ', socket.id);
      });
    } catch (error) {
      console.error('-- socket.io connection error --', error);
    }
  });

  return io;
};

export default initializeSocketIO;
