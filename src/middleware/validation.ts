import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const { error } = schema.validate(req.body);

		if (error) {
			res.status(400).json({
				success: false,
				error: error.details[0].message,
			});
			return;
		}

		next();
	};
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const { error } = schema.validate(req.query);

		if (error) {
			res.status(400).json({
				success: false,
				error: error.details[0].message,
			});
			return;
		}

		next();
	};
};

// Validation schemas
export const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	preferences: Joi.object({
		categories: Joi.array().items(Joi.string()).default([]),
		sources: Joi.array().items(Joi.string()).default([]),
		countries: Joi.array().items(Joi.string()).default([]),
		languages: Joi.array().items(Joi.string()).default([]),
	}).default({}),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const newsQuerySchema = Joi.object({
	q: Joi.string().optional(),
	sources: Joi.string().optional(),
	domains: Joi.string().optional(),
	from: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	to: Joi.string()
		.pattern(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	language: Joi.string().length(2).optional(),
	sortBy: Joi.string().valid("relevancy", "popularity", "publishedAt").optional(),
	pageSize: Joi.number().min(1).max(100).default(20),
	page: Joi.number().min(1).default(1),
});

export const headlinesQuerySchema = Joi.object({
	country: Joi.string().length(2).optional(),
	category: Joi.string().optional(),
	sources: Joi.string().optional(),
	q: Joi.string().optional(),
	pageSize: Joi.number().min(1).max(100).default(20),
	page: Joi.number().min(1).default(1),
});
