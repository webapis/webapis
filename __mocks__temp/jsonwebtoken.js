module.exports = {
  sign: () => {
    return global.sign;
  },
  verify: () => {
    if (global.verify.reject) {
      return Promise.reject({ message: global.verify.reject.message });
    } else {
      return Promise.reject({ message: global.verify.resolve.message });
    }
  },
};
