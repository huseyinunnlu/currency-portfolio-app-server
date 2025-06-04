import { Request, Response } from 'express';
import authService from '@/services/auth.service';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';

// Register a new user
const register = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    const token = await authService.register(userData);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            token,
        },
    });
});

// Login user
const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authService.login(email, password);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
        },
    });
});

// Get user profile
const getProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const profile = await authService.getProfile(userId);

    res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile,
    });
});

// Update user profile
const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const profileData = req.body;
    const result = await authService.updateProfile(userId, profileData);

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            profile: result?.profile,
            token: result?.token,
        },
    });
});

// Change user password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    const token = await authService.changePassword(userId || '', currentPassword, newPassword);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: {
            token,
        },
    });
});

export default {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};
