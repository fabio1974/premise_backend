const config = require("config");

module.exports = function(req, res, next) {
  // 401 Unauthorized => No token
  // 400 Invalid token
  // 403 Forbidden => has no permissions
  if (!config.get("requiresAuth"))
    return next();

  if (!req.user.isAdmin)
    return res.status(403).send("No Admin! Access denied.");

  next();
};
