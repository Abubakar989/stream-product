This service manages product data by fetching it from an external API and provides REST endpoints to interact with the product data. It runs using Docker Compose, which starts both the backend server and a mock product data container.

Clone the repository:

git clone https://github.com/your-username/stream-product.git
cd stream-product/server

Set up environment variables:
cp .env.example .env

Run the application:

docker-compose up --build

Access the API documentation:

Swagger docs: http://localhost:19000/api/docs
