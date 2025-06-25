# BConomy Market Analysis Server

A server-side application for the BConomy market analysis tool, created with the game creator's permission. This project is built using NestJS and provides market analysis functionality for the game BConomy.

## Description

BConomy Market Analysis Server is an Avalanche-based (NestJS) server that provides market analysis tools for the game BConomy. The server handles authentication, data processing, and API endpoints for the BConomy market analysis client application.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- PostgreSQL (v14 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bc-market-server.git
   cd bc-market-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your specific configuration:
   ```
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   EXPOSE_SWAGGER=true
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Debug Mode
```bash
npm run start:debug
```

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Documentation

When `EXPOSE_SWAGGER=true` in your `.env` file, Swagger documentation is available at:
```
http://localhost:3000/api
```

## Testing

### Running Unit Tests
```bash
npm run test
```

### Running E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Deployment

### Using Docker

The project includes a Dockerfile for containerized deployment:

1. Build the Docker image:
   ```bash
   docker build -t bc-market-server .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env bc-market-server
   ```

### Manual Deployment

For manual deployment to a production server:

1. Clone the repository on your server
2. Install dependencies: `npm ci`
3. Build the application: `npm run build`
4. Configure your environment variables
5. Start the application: `npm run start:prod`

## Project Documentation

Generate project documentation using Compodoc:
```bash
npm run doc
```

This will create documentation that can be accessed at `http://localhost:8080`.

## Contributing

Contributions to the BConomy Market Analysis Server are welcome. Please follow these guidelines:

### Code Style and Linting

This project uses ESLint with a strict configuration. All code must pass linting checks before it can be merged:

- Run linting: `npm run lint`
- Fix linting issues: `npm run lint -- --fix`

Key linting requirements:
- 4-space indentation
- Single quotes for strings
- Explicit return types for functions
- No use of `any` type
- Maximum line length of 150 characters
- Consistent member ordering in classes
- Proper promise handling

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass: `npm run test`
5. Ensure code passes linting: `npm run lint`
6. Submit a pull request

## License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.

## Acknowledgments

- BConomy game creators for permission to create this tool
- NestJS team for the framework
