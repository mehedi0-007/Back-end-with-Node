const handler = {};

handler.notFoundHandler = (handlerProperty, callback) => {
  console.log(handlerProperty);

  callback(404, {
    msg: "Page not found and request aborted",
  });
};

module.exports = handler;
