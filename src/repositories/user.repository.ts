import { BaseRepository } from './base.repository';
import User, { IUser } from '@/models/user.model';

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

    // Find user by email
    async findByEmail(email: string): Promise<IUser | null> {
        return this.findOne({ email });
    }

    // Find user by ID with password excluded
    async findByIdSecure(id: string): Promise<IUser | null> {
        return this.model.findById(id).select('-password').exec();
    }

    // Check if email already exists
    async emailExists(email: string): Promise<boolean> {
        return this.exists({ email });
    }

    // Get user profile (excluding sensitive fields)
    async getProfile(id: string): Promise<Partial<IUser> | null> {
        return this.model.findById(id).select('firstName lastName email profilePic').exec();
    }

    // Update user profile
    async updateProfile(
        id: string,
        data: Pick<IUser, 'firstName' | 'lastName' | 'profilePic'>
    ): Promise<Partial<IUser> | null> {
        return this.model
            .findByIdAndUpdate(id, data, { new: true })
            .select('firstName lastName email profilePic')
            .exec();
    }

    async changePassword(id: string, newPassword: string): Promise<IUser | null> {
        return this.model.findByIdAndUpdate(id, { password: newPassword }, { new: true });
    }
}

// Create a singleton instance
export const userRepository = new UserRepository();
