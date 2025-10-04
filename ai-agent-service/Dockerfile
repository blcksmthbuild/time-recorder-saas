# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port
EXPOSE 4000

# Set environment variables
ENV PORT=4000

# Run the application
CMD ["python", "main.py"]
# CMD ["python", "test_api.py"]
