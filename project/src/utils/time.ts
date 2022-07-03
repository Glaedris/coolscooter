const secondsToHours = (totalSeconds: number) => {
  let h = ('0' + Math.floor(totalSeconds / 3600)).slice(-2);
  let m = ('0' + Math.floor((totalSeconds % 3600) / 60)).slice(-2);
  let s = ('0' + Math.floor((totalSeconds % 3600) % 60)).slice(-2);

  return {
    hours: h,
    minutes: m,
    seconds: s,
  };
};

const getCurrentTimestamp = () => {
  return Math.round(new Date().getTime() / 1000);
};

const getRefreshTokenExpiration = () => {
  return getCurrentTimestamp() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE);
};

const getResetPasswordExpiration = () => {
  const currentTime = Math.round(new Date().getTime() / 1000);
  const expireTime = parseInt(process.env.RESET_PASSWORD_EXPIRE);
  const expire = currentTime + expireTime;
  return expire;
};

export {
  secondsToHours,
  getCurrentTimestamp,
  getRefreshTokenExpiration,
  getResetPasswordExpiration,
};
