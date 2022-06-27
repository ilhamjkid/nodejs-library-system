module.exports = (req, res, next) => {
  const method = req.body._method || req.query._method || "";
  if (method.toLowerCase() === "put") req.method = "PUT";
  if (method.toLowerCase() === "patch") req.method = "PATCH";
  if (method.toLowerCase() === "delete") req.method = "DELETE";
  return next();
};
