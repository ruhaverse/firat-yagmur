
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { getConfig } = require('./config/env');

// Validate and load environment configuration
const config = getConfig();
const app = express();

const PORT = config.port;
const API_BASE = config.apiBase;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin }));

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
	logger.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
	logger.info(`Shareup backend running on port ${PORT} (base: ${API_BASE})`);
});
