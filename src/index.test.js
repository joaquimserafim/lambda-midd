const {
  lambdaMidd,
  errorHandler,
  doNotWaitForEmptyEventLoop,
  jsonBodyParser,
  jsonsResponseSerializer,
} = require("./index");

const event = {
  body: '{"foo":"bar"}',
};

const context = {
  callbackWaitsForEmptyEventLoop: true,
};

const handler = () => async (event) => {
  return {
    statusCode: 200,
    body: "all good",
    ...event,
  };
};

describe("Testing lambda-midd", () => {
  test("should work only with the lambda handler", async () => {
    expect.hasAssertions();

    const testHandler = lambdaMidd({ handler: handler() });

    await expect(testHandler()).resolves.toEqual({
      body: "all good",
      statusCode: 200,
    });
  });

  test("should use the default errorHandler when not defined", async () => {
    const err = new Error("bad handler");

    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: async () => {
        throw err;
      },
    });

    await expect(testHandler(event, context)).resolves.toEqual(err);
  });

  test("should work when using the internal errorHandler and configuring the error treatment for the response", async () => {
    const err = new Error("bad handler");

    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: async () => {
        throw err;
      },
      errorHandler: errorHandler({ config: { statusCode: 500 } }),
    });

    await expect(testHandler(event, context)).resolves.toEqual({
      statusCode: 500,
    });
  });

  test("should work when using an external errorHandler", async () => {
    const err = new Error("bad handler");

    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: async () => {
        throw err;
      },
      errorHandler: (err) => {
        return {
          statusCode: 500,
          body: err.message,
        };
      },
    });

    await expect(testHandler(event, context)).resolves.toEqual({
      statusCode: 500,
      body: err.message,
    });
  });

  test("should throw an error when explicit throwing from the external errorHandler", async () => {
    const err = new Error("bad handler");

    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: async () => {
        throw err;
      },
      errorHandler: (err) => {
        throw new Error(err.message);
      },
    });

    await expect(testHandler(event, context)).rejects.toEqual(err);
  });

  test("should work when event and context aren't passed", async () => {
    expect.hasAssertions();

    const testHandler = lambdaMidd({ handler: handler() });

    await expect(testHandler()).resolves.toEqual({
      body: "all good",
      statusCode: 200,
    });
  });

  test("should stringify the body and add the content type to the response", async () => {
    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: handler(),
      after: [jsonsResponseSerializer()],
    });

    await expect(testHandler()).resolves.toEqual({
      body: '"all good"',
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  test("should set to false the callbackWaitsForEmptyEventLoop", async () => {
    expect.hasAssertions();

    expect(context).toHaveProperty("callbackWaitsForEmptyEventLoop", true);

    const testHandler = lambdaMidd({
      handler: handler(),
      before: [doNotWaitForEmptyEventLoop()],
    });

    await expect(testHandler(event, context)).resolves.toEqual({
      body: '{"foo":"bar"}',
      statusCode: 200,
    });

    expect(context).toHaveProperty("callbackWaitsForEmptyEventLoop", false);
  });

  test("should parse the body from the event", async () => {
    expect.hasAssertions();

    const testHandler = lambdaMidd({
      handler: handler(),
      before: [jsonBodyParser()],
    });

    await expect(testHandler(event, context)).resolves.toEqual({
      body: { foo: "bar" },
      statusCode: 200,
    });
  });
});
