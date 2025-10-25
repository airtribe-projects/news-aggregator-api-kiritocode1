export interface User {
	id: string;
	email: string;
	password: string;
	preferences: UserPreferences;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserPreferences {
	categories: string[];
	sources: string[];
	countries: string[];
	languages: string[];
}

export interface NewsArticle {
	source: {
		id: string | null;
		name: string;
	};
	author: string | null;
	title: string;
	description: string | null;
	url: string;
	urlToImage: string | null;
	publishedAt: string;
	content: string | null;
}

export interface NewsApiResponse {
	status: string;
	totalResults: number;
	articles: NewsArticle[];
}

export interface NewsQueryParams {
	q?: string;
	sources?: string;
	domains?: string;
	from?: string;
	to?: string;
	language?: string;
	sortBy?: "relevancy" | "popularity" | "publishedAt";
	pageSize?: number;
	page?: number;
}

export interface TopHeadlinesParams {
	country?: string;
	category?: string;
	sources?: string;
	q?: string;
	pageSize?: number;
	page?: number;
}

export interface AuthRequest extends Request {
	user?: {
		id: string;
		email: string;
	};
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}
