
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();

const PORT = process.env.PORT || 8080;
const API_BASE = process.env.API_BASE || '/api/v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Security middlewares
app.use(helmet());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		standardHeaders: true,
		legacyHeaders: false,
	})
);

// serve uploads directory for local dev (storage.makeFileUrl points to /uploads/<filename>)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// health
app.get('/', (req, res) => res.json({ ok: true, service: 'shareup-backend' }));

// routes
app.use(`${API_BASE}/users`, require('./routes/auth'));
app.use(`${API_BASE}/posts`, require('./routes/posts'));
app.use(`${API_BASE}/reels`, require('./routes/reels'));

// centralized error handler minimal
app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`Shareup backend running on port ${PORT} (base: ${API_BASE})`);
});
