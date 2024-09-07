const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/helpers");
const prisma = new PrismaClient();

const { ACCESS_TOKEN_SECRET } = process.env;

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return sendResponse(res, 401, "No token provided");

  try {
    const blacklistedToken = await prisma.blacklistedToken.findUnique({
      where: { token },
    });

    if (blacklistedToken) return sendResponse(res, 403, "Token is blacklisted");

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return sendResponse(res, 403, "Invalid token");
      req.user = user;
      next();
    });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, "Server error");
  }
};
