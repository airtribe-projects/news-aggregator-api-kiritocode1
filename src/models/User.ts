import { User as UserType, UserPreferences } from "../types";

// In-memory storage for demo purposes
// In production, use a proper database like MongoDB or PostgreSQL
const users: UserType[] = [];

export class User {
	static async create(userData: Omit<UserType, "id" | "createdAt" | "updatedAt">): Promise<UserType> {
		const user: UserType = {
			id: Math.random().toString(36).substr(2, 9),
			...userData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		users.push(user);
		return user;
	}

	static async findByEmail(email: string): Promise<UserType | null> {
		return users.find((user) => user.email === email) || null;
	}

	static async findById(id: string): Promise<UserType | null> {
		return users.find((user) => user.id === id) || null;
	}

	static async updatePreferences(id: string, preferences: Partial<UserPreferences>): Promise<UserType | null> {
		const userIndex = users.findIndex((user) => user.id === id);
		if (userIndex === -1) return null;

		users[userIndex].preferences = { ...users[userIndex].preferences, ...preferences };
		users[userIndex].updatedAt = new Date();

		return users[userIndex];
	}

	static async getAll(): Promise<UserType[]> {
		return users;
	}
}
