# -------------------------------------------------------
# Dockerfile — Playwright Test Runner
# -------------------------------------------------------
# Uses the official Microsoft Playwright image which comes
# with all browser binaries and OS-level dependencies
# pre-installed.
# -------------------------------------------------------

FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Set working directory
WORKDIR /app

# Copy package files first (leverage Docker layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Default command: run all tests
ENTRYPOINT ["npx", "playwright", "test"]

# Override with extra args: docker run <image> --project=chromium
CMD []
