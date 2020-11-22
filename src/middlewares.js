//
// available middlewares
//

const jsonBodyParser = () => (event) => {
  /* istanbul ignore next */
  if (event.body) {
    event.body = JSON.parse(event.body);
  }
};

const jsonsResponseSerializer = () => async (res) => {
  const response = await res;

  response.headers = {
    ...response.headers,
    "Content-Type": "application/json",
  };

  return {
    ...response,
    body: JSON.stringify(response.body),
  };
};

const doNotWaitForEmptyEventLoop = () => (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
};

const ilogger = (msg) => process.stdout.write(`Error: ${msg}\n`);

const errorHandler = ({ config = {}, context = {} } = {}) => {
  const isConfig = Object.keys(config).length;
  const logger = context.logger || ilogger;

  return (err) => {
    logger(err.message);

    return isConfig ? config : err;
  };
};

module.exports = {
  errorHandler,
  doNotWaitForEmptyEventLoop,
  jsonsResponseSerializer,
  jsonBodyParser,
};
