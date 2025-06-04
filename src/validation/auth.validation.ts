import { z } from 'zod';

// Register validation schema
export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, 'First name must be at least 2 characters')
            .max(255, 'First name cannot exceed 255 characters'),
        lastName: z
            .string()
            .min(2, 'Last name must be at least 2 characters')
            .max(255, 'Last name cannot exceed 255 characters'),
        email: z.string().email('Invalid email format'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(64, 'Password cannot exceed 64 characters'),
        passwordConfirmation: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(64, 'Password cannot exceed 64 characters'),
        profilePic: z.string().nullable().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// Change password validation schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .max(64, 'New password cannot exceed 64 characters'),
});

// Update profile validation schema
export const updateProfileSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(255, 'First name cannot exceed 255 characters')
        .optional(),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(255, 'Last name cannot exceed 255 characters')
        .optional(),
    email: z.string().email('Invalid email format').optional(),
    profilePic: z.string().nullable().optional(),
});
