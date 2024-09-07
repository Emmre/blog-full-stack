const redisClient = require("../config/redis");

exports.cache = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log("Cache hit:", key);
      return res.status(200).json(JSON.parse(data));
    } else {
      console.log("Cache miss:", key);
      res.sendResponse = res.send;
      res.send = (body) => {
        redisClient.set(key, body);
        res.sendResponse(body);
      };
      next();
    }
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
};
