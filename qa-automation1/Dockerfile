# The official Playwright image already includes the browsers and all the
# Linux system libraries they need. This is why you do NOT have to install
# browsers on your own machine — everything runs inside the container.
#
# The tag (v1.60.0) MUST match the @playwright/test version in package.json.
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

# 1) Install dependencies first (this layer is cached until package files change).
COPY package.json package-lock.json* ./
RUN npm install

# 2) Copy the rest of the framework into the image.
COPY . .

# Sensible defaults for running inside CI/containers.
# Override any of these with `-e VAR=value` or in docker-compose.yml.
ENV CI=true \
    HEADLESS=true \
    TEST_ENV=qa

# By default, run Chromium + Firefox (both preinstalled in the base image).
# Edge runs locally on Windows/macOS; override the command to run other suites.
CMD ["npx", "playwright", "test", "--project=chromium", "--project=firefox"]
