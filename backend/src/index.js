
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const deps = require('./common');
const logger = deps.logger;
const pinoHttp = require('pino-http');
const { v4: uuidv4 } = require('uuid');
const config = deps.config;

const app = express();

const PORT = config.port;
const API_BASE = config.apiBase;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// set request id early
app.use(require('./common/middleware/logging'));

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
	} catch {
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

// domain loader: load any domain modules under src/domains
const fs = require('fs');
const domainsDir = path.join(__dirname, 'domains');
if (fs.existsSync(domainsDir)) {
	fs.readdirSync(domainsDir).forEach((d) => {
		try {
			const domainIndex = path.join(domainsDir, d, 'index.js');
			if (fs.existsSync(domainIndex)) {
				const domain = require(domainIndex);
				if (domain && typeof domain.register === 'function') {
					domain.register(app, deps);
					logger.info(`Loaded domain: ${d}`);
				}
			}
		} catch (e) {
			logger.warn({ err: e }, `Failed to load domain ${d}`);
		}
	});
}

// legacy routes removed — domains now register routes under `src/domains/*`
// If you need to re-enable legacy routes temporarily, restore the requires above or
// add explicit checks (fs.existsSync) or use an env flag `ENABLE_LEGACY_ROUTES=true`.

// (debug endpoints removed)

// 404 handler - must be after all routes
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

// centralized error handler
app.use((err, req, res, _next) => {
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

// Export app for testing and allow starting only when run directly
if (require.main === module) {
	app.listen(PORT, () => {
		logger.info(`Shareup backend running on port ${PORT} (base: ${API_BASE})`);
	});
}

module.exports = app;
