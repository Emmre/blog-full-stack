const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/helpers");
const {
  sendResetPasswordEmail,
  sendMailToQueue,
} = require("../services/emailService");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, BACKEND_URL } = process.env;
const DEFAULT_PROFILE_IMAGE_URL = `${BACKEND_URL}/images/empty-prof-pic.webp`;
const prisma = new PrismaClient();

const generateTokens = (user) => {
  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return sendResponse(res, 401, "Invalid username or password");
    }

    const userResponse = {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      image: user.image,
    };

    const tokens = generateTokens({ id: user.id, username: user.username });

    sendResponse(res, 200, "Login successful", { user: userResponse, tokens });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, "Server error");
  }
};

exports.register = async (req, res) => {
  const { username, password, fullname } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
        fullname,
        image: DEFAULT_PROFILE_IMAGE_URL,
      },
    });

    const tokens = generateTokens({
      id: newUser.id,
      username: newUser.username,
    });

    sendResponse(res, 201, "User created successfully", {
      user: {
        id: newUser.id,
        username: newUser.username,
        fullname: newUser.fullname,
        image: DEFAULT_PROFILE_IMAGE_URL,
      },
      tokens,
    });
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, "Server error");
  }
};

// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await prisma.user.findUnique({ where: { username } });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return sendResponse(res, 401, "Invalid username or password");
//     }

//     const tokens = generateTokens({ id: user.id, username: user.username });
//     sendResponse(res, 200, "Login successful", tokens);
//   } catch (err) {
//     console.error(err);
//     sendResponse(res, 500, "Server error");
//   }
// };

// exports.register = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         password: hashedPassword,
//       },
//     });

//     const tokens = generateTokens({
//       id: newUser.id,
//       username: newUser.username,
//     });
//     sendResponse(res, 201, "User created successfully", tokens);
//   } catch (err) {
//     console.error(err);
//     sendResponse(res, 500, "Server error");
//   }
// };

exports.forgotPassword = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ status: 400, description: "Username is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, description: "User not found" });
    }

    await sendMailToQueue({ email: username });
    sendResetPasswordEmail();
    res
      .status(200)
      .json({ status: 200, description: "You will receive an email shortly" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, description: "Server error" });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return sendResponse(res, 401, "No refresh token provided");

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return sendResponse(res, 403, "Invalid refresh token");

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    sendResponse(res, 200, "Access token refreshed", {
      accessToken: newAccessToken,
    });
  });
};

exports.verifyToken = (req, res) => {
  const { token } = req.body;
  console.log(token, "roken", req.body);

  if (!token) {
    return sendResponse(res, 401, "No access token provided");
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return sendResponse(res, 403, "Invalid or expired access token");

    sendResponse(res, 200, "Token is valid", {
      userId: user.id,
      username: user.username,
    });
  });
};

exports.logout = async (req, res) => {
  const { token } = req.body;

  if (!token) return sendResponse(res, 401, "No token provided");

  try {
    await prisma.blacklistedToken.create({
      data: { token },
    });

    sendResponse(res, 204, "Logout successful");
  } catch (err) {
    console.error(err);
    sendResponse(res, 500, "Server error");
  }
};
