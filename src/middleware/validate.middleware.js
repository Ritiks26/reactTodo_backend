export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map(({ path, message }) => ({
        field: path.join("."),
        message,
      })),
    });
  }

  req[source] = result.data;
  next();
};
