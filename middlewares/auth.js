const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized : Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //{ id:userId}
    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized : Invalid token" });
  }
};

module.exports = authenticate;
