const responseFormat = (type, data) => {
  return {
    meta: {
      type,
    },
    data,
  };
};

module.exports = responseFormat;
