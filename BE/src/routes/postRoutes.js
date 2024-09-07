const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  getFavoritePost,
  addFavoritePost,
  deletePost,
  deleteAllPosts,
  getPostBySlug,
  updatePost,
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  deleteAllCategory,
  getPostsByCategory,
} = require("../controllers/postController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { cache } = require("../middleware/cacheMiddleware");
const { upload } = require("../middleware/multerMiddleware");

router
  .route("/posts")
  .get(getAllPosts)
  .post(upload.single("backgroundImage"), createPost);

router.route("/posts/favorites").get(getFavoritePost).post(addFavoritePost);

router.route("/posts/slug/:slug").get(getPostBySlug);

router.route("/posts/all").delete(deleteAllPosts);

router.route("/posts/category/:categoryId").get(getPostsByCategory);

router
  .route("/posts/:id")
  .get(getPostById)
  .put(upload.single("backgroundImage"), updatePost)
  .delete(deletePost);

router
  .route("/categories")
  .get(getAllCategories)
  .post(createCategory)
  .delete(deleteAllCategory);

router.route("/categories/:id").get(getCategoryById).delete(deleteCategory);

// Fetch all posts
// router.get("/", getAllPosts);

// // Create a new post
// router.post("/", upload.single("backgroundImage"), createPost);

// // Fetch favorite posts (requires userId)
// router.get("/favorites", getFavoritePost);

// // Add or remove post from favorites (requires userId and postId)
// router.post("/favorites", addFavoritePost);

// // Fetch a post by slug
// router.get("/slug/:slug", getPostBySlug);

// // Delete all posts
// router.delete("/deleteAll", deleteAllPosts);

// router.post("/categories", createCategory);

// // Route to get all categories
// router.get("/categories", getAllCategories);

// // Fetch a post by tag
// router.get("/categories/:id", getPostsByTag);

// // Route to delete a category by ID
// router.delete("/categories/:id", deleteCategory);

// // Update a post (requires post ID and backgroundImage if provided)
// router.put("/:id", upload.single("backgroundImage"), updatePost);

// // Fetch a post by ID
// router.get("/:id", getPostById);

// // Delete a post by ID
// router.delete("/:id", deletePost);

// // // Route to get a category by ID
// // router.get("/categories/:id", getCategoryById);

module.exports = router;
