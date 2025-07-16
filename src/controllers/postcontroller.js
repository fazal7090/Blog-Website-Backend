import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a new post for a user (userId from req.user.userId)
export const addPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.userId;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: Number(userId),
      },
    });
    res.status(201).json({ message: 'Post created successfully', data: post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all posts for a user (userId from token)
export const deletePostsByUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    // First, check if any posts exist for this user
    const posts = await prisma.post.findMany({ where: { userId: Number(userId) } });
    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: 'No post to delete' });
    }
    const deleted = await prisma.post.deleteMany({
      where: { userId: Number(userId) },
    });
    res.status(200).json({ message: 'All posts deleted for user', data: { deletedCount: deleted.count } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a post by postId (only if owned by user)
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body; // userId is not needed from body
  const userId = req.user.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this post' });
    }
    const updated = await prisma.post.update({
      where: { id: Number(postId) },
      data: { title, content },
    });
    res.status(200).json({ message: 'Post updated successfully', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a post by postId (public, no user check)
export const getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post fetched successfully', data: post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts of a specific user (userId from token)
export const getallPosts = async (req, res) => {
 const userId = req.user.userId;
 console.log("User ID from token:", userId);
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const posts = await prisma.post.findMany({
      where: { userId: Number(userId) },
    });
    res.status(200).json({ message: 'All Posts fetched successfully', data: posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific post by postId (only if owned by user)
export const deletePostById = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }
    await prisma.post.delete({
      where: { id: Number(postId) },
    });
    res.status(200).json({ message: 'Post deleted successfully', data: post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 