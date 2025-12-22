
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const pinoHttp = require('pino-http');
const { v4: uuidv4 } = require('uuid');
const { getConfig } = require('./config/env');

// Validate and load environment configuration
const config = getConfig();

const app = express();

const PORT = config.port;
const API_BASE = config.apiBase;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// set request id early
app.use(require('./middleware/logging'));

// pino http middleware for structured logging; uses req.requestId if present
app.use(pinoHttp({
	logger,
	genReqId: (req) => req.requestId || req.headers['x-request-id'] || uuidv4(),
	customLogLevel: (req, res, err) => {
		if (res.statusCode >= 500 || err) return 'error';
		if (res.statusCode >= 400) return 'warn';
		return 'info';
	}
}));

// attach useful props at top-level for easier parsing: requestId and userId when available
app.use((req, res, next) => {
	try {
		if (req.log) {
			const userId = req.user && req.user.id ? req.user.id : null;
			req.log = req.log.child({ requestId: req.id || req.requestId || null, userId });
		}
	} catch (e) {
		// noop
	}
	next();
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = config.corsOrigin.split(',').map(o => o.trim());
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Security middlewares
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'"],
				imgSrc: ["'self'", 'data:', 'https:'],
			},
		},
		crossOriginEmbedderPolicy: false,
	})
);

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		standardHeaders: true,
		legacyHeaders: false,
		message: 'Too many requests from this IP, please try again later.',
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
app.use(`${API_BASE}/swaps`, require('./routes/swaps'));
app.use(`${API_BASE}/notifications`, require('./routes/notifications'));
app.use(`${API_BASE}/friendships`, require('./routes/friendships'));
app.use(`${API_BASE}/admin`, require('./routes/admin'));
app.use(`${API_BASE}/search`, require('./routes/search'));
app.use(`${API_BASE}/health`, require('./routes/health'));

// (debug endpoints removed)

// 404 handler - must be after all routes
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

// centralized error handler
app.use((err, req, res, next) => {
	// Defensive: ensure err exists
	const isDev = config.nodeEnv === 'development';
	const message = err && err.message ? err.message : 'Internal Server Error';
	const stack = err && err.stack ? err.stack : undefined;

		// Log error
		logger.error('Error:', {
				message,
				stack: isDev ? stack : undefined,
				path: req && req.path,
				method: req && req.method,
		});

		// Ensure stack is included in error logs
		logger.error({ err }, 'Unhandled error');

	res.status((err && err.status) || 500).json({
		error: message,
		...(isDev && { stack }),
	});
});

app.listen(PORT, () => {
	logger.info(`Shareup backend running on port ${PORT} (base: ${API_BASE})`);
});
