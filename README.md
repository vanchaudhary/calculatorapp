# 🚀 Calculator App - CI/CD Demo with Azure Container Registry

A Node.js calculator application showcasing complete **CI/CD pipeline** with **Azure Container Registry (ACR)** and **Azure Container Instances (ACI)**.

## 🎯 Live Demo

**Latest Deployment**: Check [GitHub Actions](../../actions) for the live URL!  
**Format**: `http://calculator-demo-X.eastus.azurecontainer.io:3000`

## ✨ Features

### Application Features:
- ✅ **Basic Calculator**: Add, subtract, multiply, divide
- ✅ **Web Interface**: Clean, responsive design
- ✅ **Node.js/Express**: Modern web framework
- ✅ **Containerized**: Docker-ready application

### CI/CD Features:
- 🔄 **Automated Building**: Docker images built on every push
- 🧪 **Automated Testing**: Health checks and validation
- 📦 **Container Registry**: Secure image storage in Azure ACR
- 🚀 **Auto Deployment**: Live deployment to Azure Container Instances
- 🌐 **Public URLs**: Instant access via Azure-provided domains

## 📚 Documentation

### 📖 Complete Setup Guide
**[AZURE-CICD-GUIDE.md](./AZURE-CICD-GUIDE.md)** - Step-by-step instructions for creating this CI/CD pipeline from scratch

### ⚡ Quick Reference  
**[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Essential commands and troubleshooting

## 🏗️ Architecture

```
GitHub Repository → GitHub Actions → Docker Build → Azure Container Registry → Azure Container Instances → Live Application
```

### Key Components:
- **GitHub Actions**: CI/CD automation
- **Docker**: Application containerization  
- **Azure Container Registry**: Private image storage
- **Azure Container Instances**: Serverless hosting
- **Node.js/Express**: Application framework

## 🚀 Getting Started

### Option 1: Use the Live Demo
Visit the latest deployment URL from [GitHub Actions](../../actions)

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/vanchaudhary/calculatorapp.git
   cd calculatorapp
   ```

2. **Install dependencies**

   ```bash
   npm install express body-parser
   ```

3. **Run the application**

   ```bash
   node app.js
   ```

4. **Open in your browser**

   Go to [http://localhost:3000](http://localhost:3000).

## Usage

- Enter the first number.
- Select the desired operation (`+`, `-`, `×`, `÷`).
- Enter the second number.
- Click "Calculate" to see the result.

## Project Structure

```
calculatorapp/
├── app.js
├── index.html
├── public/
│   └── style.css
└── README.md
```

## License

MIT
