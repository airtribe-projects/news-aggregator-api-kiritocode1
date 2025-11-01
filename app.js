// Legacy app.js - now using TypeScript version in src/index.ts
// This file is kept for compatibility with existing tests

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for demo purposes
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const NEWS_API_KEY = process.env.NEWS_API_KEY || "5103a829f9b54e68a5462aab26b93fe7";

// Helper functions
const generateToken = (userId, email) => {
	return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: "24h" });
};

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Access token required" });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid or expired token" });
		}
		req.user = user;
		next();
	});
};

// Health check endpoint
app.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "News API is running",
		timestamp: new Date().toISOString(),
	});
});

// Basic route for testing
app.get("/", (req, res) => {
	res.json({
		message: "News Aggregator API - Use TypeScript version for full features",
		endpoints: {
			health: "/health",
			typescript: 'Run "pnpm dev" for full TypeScript API',
		},
	});
});

// Auth endpoints (matching test expectations)
app.post("/users/signup", async (req, res) => {
	try {
		const { name, email, password, preferences } = req.body;

		// Validate required fields
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		}
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}

		// Check if user already exists
		const existingUser = users.find((user) => user.email === email);
		if (existingUser) {
			return res.status(409).json({ error: "User already exists" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const user = {
			id: Math.random().toString(36).substr(2, 9),
			name,
			email,
			password: hashedPassword,
			preferences: preferences || [],
			createdAt: new Date(),
		};

		users.push(user);

		res.status(200).json({
			message: "User created successfully",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				preferences: user.preferences,
			},
		});
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/users/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user
		const user = users.find((u) => u.email === email);
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate token
		const token = generateToken(user.id, user.email);

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				preferences: user.preferences,
			},
		});
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

// Preferences endpoints
app.get("/users/preferences", authenticateToken, (req, res) => {
	try {
		const user = users.find((u) => u.id === req.user.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({
			preferences: user.preferences,
		});
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.put("/users/preferences", authenticateToken, (req, res) => {
	try {
		const userIndex = users.findIndex((u) => u.id === req.user.id);
		if (userIndex === -1) {
			return res.status(404).json({ error: "User not found" });
		}

		users[userIndex].preferences = req.body.preferences;

		res.status(200).json({
			message: "Preferences updated successfully",
			preferences: users[userIndex].preferences,
		});
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

// News endpoint
app.get("/news", authenticateToken, async (req, res) => {
	try {
		const response = await axios.get("https://newsapi.org/v2/everything", {
			params: {
				q: "technology",
				pageSize: 10,
				apiKey: NEWS_API_KEY,
			},
		});

		res.status(200).json({
			news: response.data.articles,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch news" });
	}
});

app.listen(port, (err) => {
	if (err) {
		return console.log("Something bad happened", err);
	}
	console.log(`Server is listening on ${port}`);
	console.log("For full features, run: pnpm dev");
});

module.exports = app;
