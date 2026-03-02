const handler = {};

handler.sampleHandler = (handlerProperty, callback) => {
  console.log(handlerProperty);
  callback(200, {
    msg: "Data recieved and used as main resource",
  });
};

module.exports = handler;
