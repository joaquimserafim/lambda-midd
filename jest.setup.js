if (process.env.NO_LOG === "true") {
  jest.spyOn(process.stdout, "write").mockImplementation(() => true);
}
