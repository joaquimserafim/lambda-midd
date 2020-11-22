require("jest-extended");

const midd = require("./middlewares");

const event = {
  body: '{"foo":"bar"}',
};

const context = {};

describe("Testing the available middlewares", () => {
  describe("jsonBodyParser", () => {
    test("should be a function", () => {
      expect.hasAssertions();
      expect(midd.jsonBodyParser).toBeFunction();
    });

    test("should return a function", () => {
      expect.hasAssertions();
      expect(midd.jsonBodyParser()).toBeFunction();
    });

    test("should parse a valid json object from the `event.body`", () => {
      expect.hasAssertions();
      midd.jsonBodyParser()(event);
      expect(event.body).toBeObject();
    });

    test("should throw an error when is an invalid json object", () => {
      expect.hasAssertions();
      expect(() => midd.jsonBodyParser()({ body: "{aaaa}" })).toThrow(
        "Unexpected token a in JSON at position 1"
      );
    });
  });

  describe("jsonsResponseSerializer ", () => {
    test("should be a function", () => {
      expect.hasAssertions();
      expect(midd.jsonsResponseSerializer).toBeFunction();
    });

    test("should return a function", () => {
      expect.hasAssertions();
      expect(midd.jsonsResponseSerializer()).toBeFunction();
    });

    test("should return and object with stringified body and the content type", async () => {
      expect.hasAssertions();
      const handler = async () => ({ body: { foo: "bar" } });

      await expect(midd.jsonsResponseSerializer()(handler())).resolves.toEqual({
        body: '{"foo":"bar"}',
        headers: { "Content-Type": "application/json" },
      });
    });

    test("should throw an error when the arg received isn't a valid handler return", async () => {
      expect.hasAssertions();
      await expect(midd.jsonsResponseSerializer()()).rejects.toThrow(
        "Cannot read property 'headers' of undefined"
      );
    });
  });

  describe("doNotWaitForEmptyEventLoop ", () => {
    test("should be a function", () => {
      expect.hasAssertions();
      expect(midd.doNotWaitForEmptyEventLoop).toBeFunction();
    });

    test("should return a function", () => {
      expect.hasAssertions();
      expect(midd.doNotWaitForEmptyEventLoop()).toBeFunction();
    });

    test("should set to false the callbackWaitsForEmptyEventLoop prop when context exists", () => {
      expect.hasAssertions();
      midd.doNotWaitForEmptyEventLoop()(event, context);
      expect(context).toHaveProperty("callbackWaitsForEmptyEventLoop", false);
    });

    test("should throw an error when context doesn't exist", () => {
      expect.hasAssertions();
      expect(() => midd.doNotWaitForEmptyEventLoop()()).toThrow(
        "Cannot set property 'callbackWaitsForEmptyEventLoop' of undefined"
      );
    });
  });

  describe("errorHandler", () => {
    test("should be a function", () => {
      expect.hasAssertions();
      expect(midd.errorHandler).toBeFunction();
    });

    test("should return a function", () => {
      expect.hasAssertions();
      expect(midd.errorHandler()).toBeFunction();
    });

    test("should return the error message when not defining a return type", async () => {
      const err = new Error("errorrrr");
      expect.hasAssertions();
      const res = midd.errorHandler()(err);
      expect(res).toEqual(err);
    });

    test("should return the config setup", async () => {
      expect.hasAssertions();
      const res = midd.errorHandler({ config: { statusCode: 500 } })(
        new Error("errorrrr")
      );
      expect(res).toEqual({ statusCode: 500 });
    });
  });
});
