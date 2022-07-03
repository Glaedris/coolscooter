import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { Types } from 'mongoose';

const emailRegex = (): RegExp => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
};

const isValidPassword = async (hashPassword, plainTextPassword) => {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

const getHashPassword = async (password): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

function resetToken() {
  return randomUUID().substring(0, 8).toUpperCase();
}

function isObjectId(id) {
  return Types.ObjectId.isValid(id);
}

const getCurrentAccessToken = (req: Request): string => {
  let getToken = req.headers.authorization;
  if (getToken) getToken = getToken.substring(7).trim();
  return getToken;
};

const calcTripDistance = (locations) => {
  if (locations.length > 1) {
    const calcDistance = (lat1, lon1, lat2, lon2): string => {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      const result = dist * 1.609344;
      //
      return parseFloat(result.toString()).toFixed(3);
    };
    let total = 0;
    for (let i = 1; i < locations.length; i++) {
      const latInicial = locations[i - 1].position.coordinates[1];
      const lonInicial = locations[i - 1].position.coordinates[0];
      const latFinal = locations[i].position.coordinates[1];
      const lonFinal = locations[i].position.coordinates[0];
      const current = parseFloat(
        calcDistance(latInicial, lonInicial, latFinal, lonFinal),
      );
      total += current;
    }
    return total;
  }
  return 0;
};

const metrosToKm = (value: number) => {
  return value * 1000;
};

export {
  emailRegex,
  isValidPassword,
  getHashPassword,
  resetToken,
  isObjectId,
  getCurrentAccessToken,
  metrosToKm,
  calcTripDistance,
};
