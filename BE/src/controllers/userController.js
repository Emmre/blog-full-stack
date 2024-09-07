const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/helpers");
const prisma = new PrismaClient();

const { BACKEND_URL } = process.env;

// exports.addUser = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return sendResponse(res, 400, "Username and password are required");
//   }

//   try {
//     const existingUser = await prisma.user.findUnique({
//       where: { username },
//     });

//     if (existingUser) {
//       return sendResponse(res, 409, "Username already exists");
//     }

//     const user = await prisma.user.create({
//       data: {
//         username,
//         password,
//       },
//     });

//     sendResponse(res, 201, "User added successfully", user);
//   } catch (err) {
//     console.error("Error adding user:", err);
//     sendResponse(res, 500, "Server error");
//   }
// };

exports.updateUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return sendResponse(res, 400, "Invalid ID");
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return sendResponse(res, 404, "User not found");
    }

    // Prepare data for update
    const updateData = {
      ...req.body, // Spread body fields for update
    };

    // If a new file (image) is uploaded, update the image field
    if (req.file) {
      updateData.image = `${BACKEND_URL}/images/${req.file.filename}`; // Ensure BACKEND_URL is set correctly
    }

    // Update the user with new data
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, createdAt, ...newUser } = updatedUser;

    sendResponse(res, 200, "User updated successfully", newUser);
  } catch (err) {
    console.error("Error updating user:", err);
    sendResponse(res, 500, "Server error");
  }
};

exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return sendResponse(res, 400, "Invalid ID");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    sendResponse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    console.error("Error retrieving user with posts:", err);
    sendResponse(res, 500, "Server error");
  }
};

// exports.getAllUsers = async (req, res) => {
//   const { post } = req.query;
//   const showPost = post === "true";

//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         posts: showPost,
//       },
//     });

//     const processedUsers = users.map((user) => {
//       if (showPost) {
//         return {
//           ...user,
//           posts: user.posts.map(({ userId, ...rest }) => rest),
//         };
//       } else {
//         return {
//           ...user,
//           posts: [],
//         };
//       }
//     });

//     sendResponse(res, 200, "Users retrieved successfully", {
//       users: processedUsers,
//       post: showPost,
//     });
//   } catch (err) {
//     console.error("Error retrieving users with posts:", err);
//     sendResponse(res, 500, "Server error");
//   }
// };
