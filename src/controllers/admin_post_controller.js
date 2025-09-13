// All the routes that are same for admin and user for posts are in postcontroller.


// This file contains routes for admin-specific post management actions.
// The admin gets displayed all posts of all users
// The admin gets displayed all posts of a specific user
// The admin can delete a specific post of a user
// The admin can update a specific post of a user

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all posts of all users
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });
    res.status(200).json({ message: 'All posts fetched', data: posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts of a specific user (userId in body)
export const getPostsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: { userId: Number(userId) }
    });
    res.status(200).json({ message: 'User posts fetched', data: posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a specific post of a user (postId and userId in params)
export const adminDeletePost = async (req, res) => {
  const { postId, userId } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) }
    });
    if (!post || post.userId !== Number(userId)) {
      return res.status(404).json({ error: 'Post not found for this user' });
    }
    await prisma.post.delete({
      where: { id: Number(postId) }
    });
    res.status(200).json({ message: 'Post deleted', data: post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Update a specific post of a user (postId, userId, title, content in body)
export const adminUpdatePost = async (req, res) => {
  const { postId, userId, title, content } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) }
    });
    if (!post || post.userId !== Number(userId)) {
      return res.status(404).json({ error: 'Post not found for this user' });
    }
    const updated = await prisma.post.update({
      where: { id: Number(postId) },
      data: { title, content }
    });
    res.status(200).json({ message: 'Post updated', data: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};