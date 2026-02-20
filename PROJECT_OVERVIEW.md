# Calculator App - Project Overview

## 📝 Project Description

This is a simple, yet robust web-based calculator application built with Node.js and Express. The application provides a clean web interface for performing basic arithmetic operations (addition, subtraction, multiplication, and division) on two numbers.

## 🎯 Purpose

The Calculator App serves as:
- A demonstration of basic web application development using Node.js
- An example of separation of concerns (business logic vs. web interface)
- A foundation for learning testing, containerization, and deployment practices
- A reference implementation for Azure deployment scenarios

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js (v5.1.0)
- **Testing Framework**: Jest (v30.2.0)
- **Testing Utilities**: Supertest (v7.2.2)
- **Containerization**: Docker

### Project Structure

```
calculatorapp/
├── app.js                 # Express server and web interface
├── calculator.js          # Core calculation logic module
├── calculator.test.js     # Unit tests for calculator module
├── app.test.js            # Integration tests for web app
├── package.json           # Node.js dependencies and scripts
├── Dockerfile             # Docker configuration for containerization
├── .gitignore            # Git ignore patterns
└── README.md             # Basic usage documentation
```

### Components

#### 1. Calculator Module (`calculator.js`)
The core business logic module that handles all mathematical operations.

**Key Functions:**
- `calculate(num1, num2, op)`: Performs arithmetic operations
  - Validates input numbers
  - Executes the operation based on the operator
  - Returns success/error status with result or error message
  
- `isValidNumber(value)`: Validates if a value is a valid number
  - Checks for empty, null, undefined values
  - Validates numeric format
  - Ensures finite numbers

**Supported Operations:**
- Addition (`+`)
- Subtraction (`-`)
- Multiplication (`*`)
- Division (`/`)

**Error Handling:**
- Invalid input validation
- Division by zero protection
- Invalid operator detection

#### 2. Web Application (`app.js`)
Express.js server that provides the web interface.

**Features:**
- Simple HTML form interface
- GET `/`: Displays calculator form
- POST `/calculate`: Processes calculations and displays results
- Error messages displayed to users
- Port: 3000 (default)

#### 3. Test Suite
Comprehensive testing with Jest.

**Calculator Module Tests (`calculator.test.js`):**
- Input validation tests
- Addition operations (positive, negative, decimal numbers)
- Subtraction operations
- Multiplication operations (including by zero)
- Division operations (including division by zero error)
- Invalid input handling
- Invalid operator handling

**Coverage:**
- All arithmetic operations
- Edge cases (zero, negative numbers, decimals)
- Error scenarios
- Input validation

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vanchaudhary/calculatorapp.git
   cd calculatorapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

**Start the server:**
```bash
node app.js
```

**Access the application:**
Open your browser and navigate to `http://localhost:3000`

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

## 🐳 Docker Support

The application includes Docker support for easy containerization and deployment.

### Building the Docker Image

```bash
docker build -t calculatorapp .
```

### Running the Container

```bash
docker run -p 3000:3000 calculatorapp
```

The application will be accessible at `http://localhost:3000`

## 🔍 Usage Example

1. Open the application in your browser (`http://localhost:3000`)
2. Enter the first number
3. Select an operation (+, -, *, /)
4. Enter the second number
5. Click "Calculate" to see the result
6. Click "Try again" to perform another calculation

## 🧪 Testing Strategy

The project follows a comprehensive testing approach:

### Unit Tests
- Test individual functions in isolation
- Validate input validation logic
- Test each arithmetic operation separately
- Cover edge cases and error conditions

### Test Cases Include:
- ✅ Valid number inputs
- ✅ Invalid inputs (empty, null, undefined, non-numeric)
- ✅ All arithmetic operations
- ✅ Positive, negative, and decimal numbers
- ✅ Division by zero error handling
- ✅ Invalid operator handling

## 📊 Key Features

1. **Input Validation**: Robust validation ensures only valid numeric inputs are processed
2. **Error Handling**: Clear error messages for division by zero and invalid inputs
3. **Modular Design**: Separation of calculation logic from web interface
4. **Comprehensive Testing**: High test coverage with Jest
5. **Docker Support**: Easy deployment with containerization
6. **Lightweight**: Minimal dependencies for fast startup and low resource usage

## 🔧 Development

### Code Organization

- **Separation of Concerns**: Business logic (calculator.js) is separate from presentation layer (app.js)
- **Modularity**: Each component can be tested and maintained independently
- **Testability**: Pure functions make unit testing straightforward

### Best Practices Implemented

- Input validation before processing
- Error handling with descriptive messages
- CommonJS module exports for reusability
- Comprehensive test coverage
- Docker containerization for consistent environments

## 📦 Dependencies

### Production Dependencies
- `express`: ^5.1.0 - Web framework for Node.js

### Development Dependencies
- `jest`: ^30.2.0 - Testing framework
- `supertest`: ^7.2.2 - HTTP testing utility

## 🚦 Continuous Integration

The project is designed to be CI/CD friendly with:
- Automated tests via Jest
- Docker support for containerized deployments
- Simple deployment process

## 📄 License

ISC License

## 🤝 Contributing

This project serves as a learning and demonstration tool. Contributions are welcome to:
- Add new operations
- Improve the UI
- Enhance error handling
- Add more comprehensive tests
- Improve documentation

## 📞 Support

For issues and questions, please use the GitHub issue tracker at:
https://github.com/vanchaudhary/calculatorapp/issues

## 🎓 Learning Outcomes

By studying this project, you can learn about:
- Building web applications with Node.js and Express
- Implementing business logic in separate modules
- Writing comprehensive unit tests with Jest
- Containerizing Node.js applications with Docker
- Input validation and error handling
- RESTful API design patterns
- Test-driven development practices
