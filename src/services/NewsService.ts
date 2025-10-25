import axios, { AxiosResponse } from "axios";
import NodeCache from "node-cache";
import { NewsApiResponse, NewsQueryParams, TopHeadlinesParams } from "../types";

const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

export class NewsService {
	private static readonly BASE_URL = "https://newsapi.org/v2";
	private static readonly API_KEY = process.env.NEWS_API_KEY || "5103a829f9b54e68a5462aab26b93fe7";

	static async getEverything(params: NewsQueryParams): Promise<NewsApiResponse> {
		const cacheKey = `everything_${JSON.stringify(params)}`;
		const cached = cache.get<NewsApiResponse>(cacheKey);

		if (cached) {
			return cached;
		}

		try {
			const response: AxiosResponse<NewsApiResponse> = await axios.get(`${this.BASE_URL}/everything`, {
				params: {
					...params,
					apiKey: this.API_KEY,
				},
			});

			if (response.data.status === "error") {
				throw new Error(response.data.message || "News API error");
			}

			cache.set(cacheKey, response.data);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`News API error: ${error.response?.data?.message || error.message}`);
			}
			throw error;
		}
	}

	static async getTopHeadlines(params: TopHeadlinesParams): Promise<NewsApiResponse> {
		const cacheKey = `headlines_${JSON.stringify(params)}`;
		const cached = cache.get<NewsApiResponse>(cacheKey);

		if (cached) {
			return cached;
		}

		try {
			const response: AxiosResponse<NewsApiResponse> = await axios.get(`${this.BASE_URL}/top-headlines`, {
				params: {
					...params,
					apiKey: this.API_KEY,
				},
			});

			if (response.data.status === "error") {
				throw new Error(response.data.message || "News API error");
			}

			cache.set(cacheKey, response.data);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`News API error: ${error.response?.data?.message || error.message}`);
			}
			throw error;
		}
	}

	static async getSources(): Promise<any> {
		const cacheKey = "sources";
		const cached = cache.get(cacheKey);

		if (cached) {
			return cached;
		}

		try {
			const response = await axios.get(`${this.BASE_URL}/sources`, {
				params: { apiKey: this.API_KEY },
			});

			cache.set(cacheKey, response.data, 3600); // Cache for 1 hour
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`News API error: ${error.response?.data?.message || error.message}`);
			}
			throw error;
		}
	}

	static clearCache(): void {
		cache.flushAll();
	}
}
