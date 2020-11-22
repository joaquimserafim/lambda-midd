const pLimit = require("p-limit");

const midd = require("./middlewares");

//
//
//

const lambdaMidd = ({
  handler,
  errorHandler,
  before = [],
  after = [],
}) => async (event = {}, context = {}) => {
  const limit = pLimit(1);

  handler.isHandler = true;

  const fns = [...before, handler, ...after];
  const length = fns.length;
  const ops = [];

  for (let i = 0; i < length; i++) {
    let op = fns[i];

    ops.push(
      limit(() => {
        if (op.isHandler) {
          event = op(event, context);
          context = undefined;
          return event;
        }
        return op(event, context);
      })
    );
  }

  try {
    const res = await Promise.all(ops);
    return res.pop();
  } catch (err) {
    errorHandler = errorHandler || midd.errorHandler({ context });
    return errorHandler(err);
  }
};

module.exports = { lambdaMidd, ...midd };
