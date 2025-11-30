
const express = require('express');
const path = require('path');
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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// 404 handler - must be after all routes
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

// centralized error handler
app.use((err, req, res, next) => {
	// Log error
	logger.error('Error:', {
		message: err.message,
		stack: config.nodeEnv === 'development' ? err.stack : undefined,
		path: req.path,
		method: req.method,
	});

	// Don't expose stack trace in production
	const isDev = config.nodeEnv === 'development';
	
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
		...(isDev && { stack: err.stack }),
	});
});

app.listen(PORT, () => {
	logger.info(`Shareup backend running on port ${PORT} (base: ${API_BASE})`);
});
