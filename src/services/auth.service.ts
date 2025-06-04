import jwt from 'jsonwebtoken';
import { userRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/user.model';
import { BadRequestError, InternalServerError, NotFoundError, UnauthorizedError, ConflictError } from '@/lib/errors';
import { ERRORS } from '@/constants';
import 'dotenv/config';

// Types
type RegisterData = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'profilePic'>;
type TokenPayload = {
    id: string;
} & Omit<IUser, 'password'>;
type UpdateProfileData = Pick<IUser, 'firstName' | 'lastName' | 'profilePic' | 'email'>;

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';
// Token expiration time
const TOKEN_EXPIRY = '365d';

// Register a new user
async function register(userData: RegisterData): Promise<string | null> {
    const emailExists = await userRepository.emailExists(userData.email);
    if (emailExists) {
        throw new ConflictError(ERRORS.USER_EMAIL_EXISTS);
    }

    const user = await userRepository.create(userData);

    if (!user) {
        throw new InternalServerError(ERRORS.USER_CREATION_FAILED);
    }
    return generateToken(user);
}

// Login user
async function login(email: string, password: string): Promise<string> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new UnauthorizedError(ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new UnauthorizedError(ERRORS.INVALID_CREDENTIALS);
    }

    const token = generateToken(user);
    return token;
}

// Get user profile
async function getProfile(userId: string): Promise<Partial<IUser> | null> {
    const profile = await userRepository.getProfile(userId);
    if (!profile) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    }

    return profile;
}

// Update user profile
async function updateProfile(
    userId: string,
    data: UpdateProfileData
): Promise<{ profile: Partial<IUser>; token: string } | null> {
    if (!userId) {
        throw new BadRequestError(ERRORS.MISSING_PARAMETERS);
    }

    const updatedProfile = await userRepository.updateProfile(userId, data);
    if (!updatedProfile) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    }

    // Get the full user object to generate a new token
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    }

    // Generate a new token with updated user data
    const token = generateToken(user);

    return { profile: updatedProfile, token };
}

// Change user password
async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<string> {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new NotFoundError(ERRORS.USER_NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new BadRequestError(ERRORS.CURRENT_PASSWORD_INCORRECT);
    }

    // Update password
    const updatedUser = await userRepository.changePassword(userId, newPassword);
    if (!updatedUser) {
        throw new InternalServerError(ERRORS.PASSWORD_CHANGE_FAILED);
    }

    // Generate a new token
    return generateToken(updatedUser);
}

// Generate JWT token
function generateToken(user: IUser): string {
    const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    });
}

// Verify JWT token
function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

export default {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    verifyToken
};
