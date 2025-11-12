# Deployment - required secrets (concise)

This file lists the GitHub repository secrets you should add before running staging or production deploys. Do NOT put secrets in source code.

Recommended secrets (use names your workflows expect):

- BACKEND_DATABASE_URL or DATABASE_URL
- BACKEND_JWT_SECRET or JWT_SECRET
- SESSION_SECRET
- AWS_ACCESS_KEY_ID (or SPACES_KEY)
- AWS_SECRET_ACCESS_KEY (or SPACES_SECRET)
- S3_BUCKET (or SPACES_BUCKET)
- S3_ENDPOINT (or SPACES_ENDPOINT) — optional for S3-compatible providers
- DOCKER_USERNAME
- DOCKER_PASSWORD
- DOCKER_REPO
- SSH_PRIVATE_KEY
- SSH_HOST
- SSH_USER
- SONAR_TOKEN
- MAIL_API_KEY (SendGrid/Mailgun/etc.)

Notes:
- Use separate secrets for staging and production (e.g. STAGING_DATABASE_URL, PROD_DATABASE_URL).
- Give minimal scope to service tokens and rotate them regularly.

If you want, I can create a PR that adds a staging deploy workflow which references these secrets (placeholders only).
