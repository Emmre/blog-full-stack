const slugify = require("slugify");
const { PrismaClient } = require("@prisma/client");
const { sendResponse } = require("../utils/helpers");
const prisma = new PrismaClient();

const { BACKEND_URL } = process.env;
const DEFAULT_BACKGROUND_IMAGE_URL = `${BACKEND_URL}/images/empty-prof-pic.webp`;

// Format response
const formatResponse = (data, extraFields = {}) => ({
  id: data.id,
  title: data.title,
  content: data.content,
  slug: data.slug,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  backgroundImage: data.backgroundImage,
  author: {
    id: data.authorId,
    name: data.author.fullname,
    image: data.author.image,
  },
  categories: data.categories || [],
  ...extraFields,
});

// Handle slug existence
const checkSlugExists = async (slug, postId = undefined) => {
  return await prisma.post.findFirst({
    where: {
      slug: slug,
      NOT: postId ? { id: postId } : undefined,
    },
  });
};

// Create Post
exports.createPost = async (req, res) => {
  const { title, content, authorId, categories = [], slug } = req.body;
  console.log("Categories:", categories);
  console.log("Type of categories:", typeof categories);

  // Validate required fields
  if (!title || !content || !authorId || !slug) {
    return sendResponse(
      res,
      400,
      "Title, content, authorId, and slug are required"
    );
  }

  try {
    const authorIdInt = parseInt(authorId, 10);
    if (isNaN(authorIdInt)) {
      return sendResponse(res, 400, "Invalid authorId provided");
    }

    const user = await prisma.user.findUnique({ where: { id: authorIdInt } });
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const categoriesToConnectOrCreate = categories.map((category) => ({
      where: { name: category },
      create: { name: category },
    }));

    // Check if slug exists
    const existingPostWithSlug = await checkSlugExists(slug);
    if (existingPostWithSlug) {
      return sendResponse(res, 400, "A post with this slug already exists");
    }

    // Set background image URL or default
    const backgroundImage = req.file
      ? `${BACKEND_URL}/images/${req.file.filename}`
      : DEFAULT_BACKGROUND_IMAGE_URL;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: authorIdInt,
        categories: { connectOrCreate: categoriesToConnectOrCreate },
        slug,
        backgroundImage,
      },
    });

    const createdPost = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    sendResponse(
      res,
      201,
      "Post created successfully",
      formatResponse(createdPost)
    );
  } catch (err) {
    console.error("Error creating post:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  console.log("getAllPosts");
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    const formattedPosts = posts.map((post) => formatResponse(post));
    sendResponse(res, 200, "Posts retrieved successfully", {
      posts: formattedPosts,
    });
  } catch (err) {
    console.error("Error retrieving posts:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get Post by ID
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return sendResponse(res, 400, "Invalid post ID");
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    if (!post) {
      return sendResponse(res, 404, "Post not found");
    }

    sendResponse(res, 200, "Post retrieved successfully", formatResponse(post));
  } catch (err) {
    console.error("Error retrieving post:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get Post by Slug
exports.getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  console.log("slug", slug);

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: `/${slug}`,
      },
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    if (!post) {
      return sendResponse(res, 404, "Post not found");
    }

    sendResponse(res, 200, "Post retrieved successfully", formatResponse(post));
  } catch (err) {
    console.error("Error retrieving post:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get Posts by Category
exports.getPostsByCategory = async (req, res) => {
  const category = req.params.categoryId;

  // Validate category parameter
  if (!category) {
    return sendResponse(res, 400, "Category is required.");
  }

  try {
    // Fetch posts with the specified category
    const posts = await prisma.post.findMany({
      where: {
        categories: {
          some: {
            name: category, // Filter posts where at least one category has the specified name
          },
        },
      },
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    // Format the posts and send response
    const formattedPosts = posts.map((post) => formatResponse(post));
    sendResponse(res, 200, "Posts retrieved successfully", {
      posts: formattedPosts,
    });
  } catch (err) {
    console.error("Error retrieving posts by category:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Create Category
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return sendResponse(res, 400, "Category name is required.");
  }

  try {
    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return sendResponse(res, 400, "Category already exists.");
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: { name },
    });

    // Extract only id and name from the created category
    const { id, name: categoryName } = newCategory;

    sendResponse(res, 201, "Category created successfully", {
      id,
      name: categoryName,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  const { hasPost } = req.query; // Parametreyi alın
  console.log("hasPost", hasPost);
  try {
    let categories;

    if (hasPost === "true") {
      // Eğer hasPost parametresi varsa, sadece post içeren kategorileri getir
      categories = await prisma.category.findMany({
        where: {
          posts: {
            some: {}, // En az bir post içeren kategoriler
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    } else {
      // Parametre yoksa, tüm kategorileri getir
      categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    }

    sendResponse(res, 200, "Categories retrieved successfully", categories);
  } catch (err) {
    console.error("Error retrieving categories:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return sendResponse(res, 400, "Category ID is required.");
  }

  try {
    // Get category by ID
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      return sendResponse(res, 404, "Category not found.");
    }

    sendResponse(res, 200, "Category retrieved successfully", category);
  } catch (err) {
    console.error("Error retrieving category:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id) {
    return sendResponse(res, 400, "Category ID is required.");
  }

  try {
    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!category) {
      return sendResponse(res, 404, "Category not found.");
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: parseInt(id, 10) },
    });

    sendResponse(res, 200, "Category deleted successfully.");
  } catch (err) {
    console.error("Error deleting category:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Delete All Category
exports.deleteAllCategory = async (req, res) => {
  try {
    await prisma.category.deleteMany();

    sendResponse(res, 200, "All categories deleted successfully");
  } catch (err) {
    console.error("Error deleting categories:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Add Favorite Post
exports.addFavoritePost = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return sendResponse(res, 400, "UserId and PostId are required");
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const postExists = await prisma.post.findUnique({ where: { id: postId } });

    if (!userExists || !postExists) {
      return sendResponse(res, 404, "User or Post not found");
    }

    const existingFavorite = await prisma.favoritePost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favoritePost.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return sendResponse(res, 200, "Post removed from favorites");
    } else {
      await prisma.favoritePost.create({
        data: {
          userId,
          postId,
        },
      });
      return sendResponse(res, 200, "Post added to favorites");
    }
  } catch (err) {
    console.error("Error adding/removing favorite post:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Get Favorite Post
exports.getFavoritePost = async (req, res) => {
  const userId = req.headers["userid"];

  if (!userId) {
    return sendResponse(res, 400, "UserId is required");
  }

  try {
    // Kullanıcının favori postlarını al
    const favoritePosts = await prisma.favoritePost.findMany({
      where: { userId: Number(userId) },
      include: {
        post: {
          include: {
            author: {
              select: {
                fullname: true,
                image: true,
              },
            },
            categories: true,
            favoritedBy: {
              where: { userId: Number(userId) },
              select: { userId: true },
            },
          },
        },
      },
    });

    // Favori postlar bulunamadıysa boş dizi döndür
    if (favoritePosts.length === 0) {
      return sendResponse(res, 200, "No favorite posts found", []);
    }

    // Favori postları formatla ve isFavorite özelliğini ekle
    const formattedFavoritePosts = favoritePosts.map((favorite) => {
      const formattedPost = formatResponse(favorite.post);
      formattedPost.isFavorite = true; // Her post favori olduğu için isFavorite true olarak ayarlanır
      return formattedPost;
    });

    sendResponse(res, 200, "Favorite posts retrieved", formattedFavoritePosts);
  } catch (err) {
    console.error("Error retrieving favorite posts:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Delete Post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  console.log(id, "DELETE POST ID GELDİ");
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return sendResponse(res, 400, "Invalid post ID");
  }

  try {
    // Post'u bul
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return sendResponse(res, 404, "Post not found");
    }

    // Post'u sil
    await prisma.post.delete({
      where: { id: postId },
    });

    sendResponse(res, 200, "Post deleted successfully");
  } catch (err) {
    console.error("Error deleting post:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Delete All Posts
exports.deleteAllPosts = async (req, res) => {
  try {
    await prisma.favoritePost.deleteMany({
      where: {
        postId: {
          in: (
            await prisma.post.findMany({ select: { id: true } })
          ).map((post) => post.id),
        },
      },
    });

    await prisma.post.deleteMany();

    sendResponse(res, 200, "All posts deleted successfully");
  } catch (err) {
    console.error("Error deleting posts:", err);
    sendResponse(res, 500, "Server error");
  }
};

// Update Post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, slug, categories = [] } = req.body;

  if (!slug) {
    return sendResponse(res, 400, "Slug is required");
  }

  try {
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return sendResponse(res, 400, "Invalid post ID");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { categories: true },
    });
    if (!post) {
      return sendResponse(res, 404, "Post not found");
    }

    // Kategori dizisi varsa ve tanımlıysa, eski kategorileri kontrol et
    const currentCategories = post.categories || [];
    const categoriesToConnectOrCreate = categories.map((category) => ({
      where: { name: category },
      create: { name: category },
    }));

    // Kategori isimlerini al
    const categoryNames = categories.map((cat) => cat.toLowerCase());

    // Mevcut kategoriler ile yeni kategorileri karşılaştır
    const categoriesToDisconnect = currentCategories
      .filter((cat) => !categoryNames.includes(cat.name.toLowerCase()))
      .map((cat) => ({ id: cat.id }));

    const existingPostWithSlug = await checkSlugExists(slug, postId);
    if (existingPostWithSlug) {
      return sendResponse(res, 400, "A post with this slug already exists");
    }

    const backgroundImage = req.file
      ? `${BACKEND_URL}/images/${req.file.filename}`
      : DEFAULT_BACKGROUND_IMAGE_URL;

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title || post.title,
        content: content || post.content,
        slug: slug,
        backgroundImage,
        categories: {
          connectOrCreate: categoriesToConnectOrCreate,
          disconnect: categoriesToDisconnect,
        },
      },
    });

    const updatedPostWithData = await prisma.post.findUnique({
      where: { id: updatedPost.id },
      include: {
        author: { select: { fullname: true, image: true } },
        categories: true,
      },
    });

    console.log(updatedPostWithData, "updatedPostWithData");

    sendResponse(
      res,
      200,
      "Post updated successfully",
      formatResponse(updatedPostWithData)
    );
  } catch (err) {
    console.error("Error updating post:", err);
    sendResponse(res, 500, "Server error");
  }
};
