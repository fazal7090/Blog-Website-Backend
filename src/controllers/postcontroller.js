import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a new post for a user (userId from req.userId)
export const addPost = async (req, res) => {
  const { title, content, userId } = req.body;
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

// Delete all posts for a user (userId from req.userId)
export const deletePostsByUser = async (req, res) => {
  const { userId } = req.body;
  try {
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
  const { title, content, userId } = req.body; // all from body
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

// Delete a specific post by postId (only if owned by user)
export const deletePostById = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
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
    res.status(200).json({ message: 'Post deleted successfully', data: null });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 