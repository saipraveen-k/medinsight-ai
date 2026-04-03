


# Use lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for PDF/Image processing
RUN apt-get update && apt-get install -y \
    gcc \
    wget \
    libjpeg-dev \
    libfreetype6-dev \
    zlib1g-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user (security best practice)
RUN useradd -m appuser

# Copy project files
COPY . .

# Create storage directory and fix permissions
RUN mkdir -p storage && chown -R appuser:appuser /app
USER appuser

# Expose app port
EXPOSE 8000

# Start FastAPI app (production mode - no reload)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
