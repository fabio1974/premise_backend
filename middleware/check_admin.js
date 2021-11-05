const config = require("config");

module.exports = function(req, res, next) {
  // 401 Unauthorized => No token
  // 400 Invalid token
  // 403 Forbidden => has no permissions
  if (!config.get("requiresAuth"))
    return next();

  console.log("USER AT MIDDLEWARE",req.user)

  if (!req.user.isAdmin)
    return res.status(403).send("Message from server middleware: No Admin! Access denied.");

  next();
};
