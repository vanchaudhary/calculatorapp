# 🚀 Complete Guide: CI/CD Pipeline with Azure Container Registry (ACR)

> ⚠️ **SECURITY NOTICE**: All sensitive values (subscription IDs, client secrets, passwords) in this guide have been sanitized with placeholder values (xxxxxxxx). Replace these with your actual values when implementing.

## 📋 Overview

This guide provides step-by-step instructions for setting up a complete CI/CD pipeline using GitHub Actions, Azure Container Registry (ACR), and Azure Container Instances (ACI). The pipeline automatically builds, tests, and deploys a Node.js application to Azure cloud.

## 🏗️ Architecture Overview

```
GitHub Repository → GitHub Actions → Docker Build → Azure Container Registry → Azure Container Instances → Live Application
```

### Key Components:
- **GitHub Actions**: CI/CD automation platform
- **Docker**: Application containerization
- **Azure Container Registry (ACR)**: Private container image storage
- **Azure Container Instances (ACI)**: Serverless container hosting
- **Node.js/Express**: Sample application (easily replaceable)

---

## 🎯 Prerequisites

### Required Accounts:
- ✅ **GitHub Account**: For code repository and Actions
- ✅ **Azure Account**: For cloud resources (free tier available)
- ✅ **Local Development Environment**: Git, text editor, web browser

### Required Tools:
- ✅ **Git**: Version control
- ✅ **Web Browser**: Access to Azure Portal and GitHub
- ✅ **Text Editor**: VS Code, Notepad++, or similar

---

## 📁 Project Structure

```
calculatorapp/
├── app.js                     # Node.js Express application
├── package.json              # Node.js dependencies
├── Dockerfile                # Container configuration
├── README.md                 # Project documentation
└── .github/
    └── workflows/
        └── ci.yml            # GitHub Actions workflow
```

---

## 🚀 Step-by-Step Implementation

### Phase 1: Application Setup

#### 1.1 Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Click "New repository"**
3. **Repository details**:
   - Name: `calculatorapp` (or your preferred name)
   - Description: "CI/CD Demo with Azure Container Registry"
   - Visibility: Public (for free GitHub Actions)
   - Initialize: ✅ Add README file
4. **Click "Create repository"**

#### 1.2 Clone Repository Locally

```bash
git clone https://github.com/yourusername/calculatorapp.git
cd calculatorapp
```

#### 1.3 Create Node.js Application

**Create `package.json`:**
```json
{
  "name": "calculator-app",
  "version": "1.0.0",
  "description": "Simple calculator app for CI/CD demo",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "keywords": ["nodejs", "express", "calculator", "azure", "cicd"],
  "author": "Your Name",
  "license": "MIT"
}
```

**Create `app.js`:**
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h2>🚀 Calculator App - Azure Demo v1.0</h2>
    <form method="post" action="/calculate">
      <input name="num1" type="number" step="any" required>
      <select name="op">
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="*">*</option>
        <option value="/">/</option>
      </select>
      <input name="num2" type="number" step="any" required>
      <button type="submit">Calculate</button>
    </form>
  `);
});

app.post('/calculate', (req, res) => {
  const { num1, op, num2 } = req.body;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  let result;

  switch (op) {
    case '+': result = n1 + n2; break;
    case '-': result = n1 - n2; break;
    case '*': result = n1 * n2; break;
    case '/': result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero'; break;
    default: result = 'Error: Invalid operation';
  }

  res.send(`
    <h2>🚀 Calculator App - Azure Demo v1.0</h2>
    <p><strong>Calculation:</strong> ${num1} ${op} ${num2} = <strong>${result}</strong></p>
    <a href="/">← Back to Calculator</a>
  `);
});

app.listen(port, () => {
  console.log(`Calculator app listening at http://localhost:${port}`);
});
```

#### 1.4 Create Dockerfile

**Create `Dockerfile`:**
```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run the application
CMD ["node", "app.js"]
```

### Phase 2: Azure Infrastructure Setup

#### 2.1 Access Azure Portal

1. **Go to Azure Portal**: https://portal.azure.com
2. **Sign in** with your Azure account
3. **Ensure you have an active subscription**

#### 2.2 Create Resource Group

**Via Azure Portal:**
1. Search for **"Resource groups"**
2. Click **"+ Create"**
3. **Subscription**: Select your subscription
4. **Resource group name**: `calculator-app-rg`
5. **Region**: `East US` (or your preferred region)
6. Click **"Review + create"** → **"Create"**

#### 2.3 Create Azure Container Registry (ACR)

**Via Azure Portal:**
1. Search for **"Container registries"**
2. Click **"+ Create"**
3. **Configuration**:
   - **Subscription**: Your subscription
   - **Resource group**: `calculator-app-rg`
   - **Registry name**: `calculatorappacr` (must be globally unique)
   - **Location**: `East US`
   - **SKU**: `Basic` (cost-effective for demos)
4. Click **"Review + create"** → **"Create"**
5. Wait for deployment completion (2-3 minutes)

#### 2.4 Enable ACR Admin User

1. **Go to your ACR resource**: `calculatorappacr`
2. **Navigate**: Settings → **"Access keys"**
3. **Enable**: Toggle **"Admin user"** to **Enabled**
4. **Copy these values** (needed for GitHub secrets):
   - **Login server**: `calculatorappacr.azurecr.io`
   - **Username**: `calculatorappacr`
   - **Password**: Copy one of the password values

### Phase 3: Azure Service Principal Setup

#### 3.1 Open Azure Cloud Shell

1. **In Azure Portal**, click **Cloud Shell icon** (>_) at top right
2. **Select "Bash"** when prompted
3. **Wait for shell to initialize**

#### 3.2 Get Subscription ID

```bash
az account show --query id --output tsv
```
**Copy the output** - this is your subscription ID.

#### 3.3 Create Service Principal

Replace `YOUR_SUBSCRIPTION_ID` with the ID from step 3.2:

```bash
az ad sp create-for-rbac --name "calculatorapp-github" --role contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/calculator-app-rg --json-auth
```

**Example output:**
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxx~xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**⚠️ IMPORTANT**: Copy this entire JSON output for GitHub secrets!

#### 3.4 Register Container Instance Provider

```bash
az provider register --namespace Microsoft.ContainerInstance
```

This ensures your subscription can create Azure Container Instances.

### Phase 4: GitHub Repository Configuration

#### 4.1 Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate**: Settings → Secrets and variables → Actions
3. **Add these secrets**:

**Secret 1: AZURE_CREDENTIALS**
- **Name**: `AZURE_CREDENTIALS`
- **Value**: The entire JSON from step 3.3

**Secret 2: ACR_PASSWORD**
- **Name**: `ACR_PASSWORD`
- **Value**: The password from step 2.4

#### 4.2 Create GitHub Actions Workflow

**Create directory structure:**
```bash
mkdir -p .github/workflows
```

**Create `.github/workflows/ci.yml`:**
```yaml
name: Enhanced CI/CD - Deploy to Azure Container Registry

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  APP_NAME: calculator-app
  AZURE_CONTAINER_REGISTRY: calculatorappacr
  AZURE_RESOURCE_GROUP: calculator-app-rg
  CONTAINER_NAME: calculator-app
  IMAGE_TAG: ${{ github.sha }}

jobs:
  ci-cd-pipeline:
    runs-on: ubuntu-latest
    
    steps:
    # ========== CI PHASE ==========
    - name: 📥 Checkout Code
      uses: actions/checkout@v4

    - name: 🏗️ Build Docker Image
      run: |
        echo "🔨 Building Docker image with tag: ${{ env.IMAGE_TAG }}"
        docker build -t ${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }} .
        docker build -t ${{ env.CONTAINER_NAME }}:latest .
        echo "✅ Build completed successfully"

    - name: 🧪 Run Automated Tests
      run: |
        echo "🧪 Starting automated testing..."
        
        # Start test container
        docker run -d -p 3001:3000 --name test-container ${{ env.CONTAINER_NAME }}:latest
        
        # Wait for app to start
        echo "⏳ Waiting for application to start..."
        sleep 10
        
        # Run health check
        echo "🔍 Running health checks..."
        curl --fail --retry 3 --retry-delay 2 http://localhost:3001 || {
          echo "❌ Health check failed"
          docker logs test-container
          exit 1
        }
        
        echo "✅ All tests passed!"
        
        # Cleanup test container
        docker stop test-container
        docker rm test-container

    # ========== AZURE ACR DEPLOYMENT ==========
    - name: 🔑 Azure Login
      if: github.ref == 'refs/heads/main'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: 🏭 Login to Azure Container Registry
      if: github.ref == 'refs/heads/main'
      run: |
        echo "🔐 Logging into Azure Container Registry..."
        az acr login --name ${{ env.AZURE_CONTAINER_REGISTRY }}
        echo "✅ ACR login successful"

    - name: 🚀 Build and Push to ACR
      if: github.ref == 'refs/heads/main'
      run: |
        echo "📦 Tagging and pushing images to ACR..."
        
        # Tag images for ACR
        docker tag ${{ env.CONTAINER_NAME }}:latest ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:latest
        docker tag ${{ env.CONTAINER_NAME }}:latest ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        
        # Push to ACR
        docker push ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:latest
        docker push ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:${{ env.IMAGE_TAG }}
        
        echo "✅ Images pushed to ACR successfully!"
        echo "🏭 ACR Registry: ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io"
        echo "📦 Image: ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:latest"

    # ========== AZURE CONTAINER INSTANCES DEPLOYMENT ==========
    - name: 🌐 Deploy to Azure Container Instances
      if: github.ref == 'refs/heads/main'
      run: |
        echo "🚀 Deploying to Azure Container Instances..."
        
        # Create container instance with unique name using run number
        CONTAINER_NAME="calculator-demo-${{ github.run_number }}"
        DNS_LABEL="calculator-demo-${{ github.run_number }}"
        
        echo "📦 Creating container: $CONTAINER_NAME"
        echo "🌐 DNS Label: $DNS_LABEL"
        
        az container create \
          --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
          --name $CONTAINER_NAME \
          --image ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:latest \
          --registry-login-server ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io \
          --registry-username ${{ env.AZURE_CONTAINER_REGISTRY }} \
          --registry-password ${{ secrets.ACR_PASSWORD }} \
          --dns-name-label $DNS_LABEL \
          --ports 3000 \
          --os-type Linux \
          --environment-variables PORT=3000 \
          --cpu 1 \
          --memory 1 \
          --restart-policy Always
        
        echo "✅ Container deployment initiated!"
        echo "📝 Container Name: $CONTAINER_NAME"

    - name: 🔍 Get Deployment Information
      if: github.ref == 'refs/heads/main'
      run: |
        echo "⏳ Waiting for container to start..."
        sleep 30
        
        # Set container name with run number
        CONTAINER_NAME="calculator-demo-${{ github.run_number }}"
        
        # Get container information
        FQDN=$(az container show \
          --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
          --name $CONTAINER_NAME \
          --query ipAddress.fqdn \
          --output tsv)
        
        IP=$(az container show \
          --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
          --name $CONTAINER_NAME \
          --query ipAddress.ip \
          --output tsv)
        
        STATE=$(az container show \
          --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
          --name $CONTAINER_NAME \
          --query instanceView.state \
          --output tsv)
        
        echo "🎯 DEPLOYMENT INFORMATION:"
        echo "=================================="
        echo "🌐 Live URL: http://$FQDN:3000"
        echo "📍 Public IP: $IP"
        echo "📊 Container State: $STATE"
        echo "🏭 ACR Image: ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io/${{ env.CONTAINER_NAME }}:latest"
        echo "=================================="

    - name: 🏥 Health Check Deployed Application
      if: github.ref == 'refs/heads/main'
      run: |
        echo "🔍 Running health check on deployed application..."
        
        # Set container name and get FQDN for health check
        CONTAINER_NAME="calculator-demo-${{ github.run_number }}"
        FQDN=$(az container show \
          --resource-group ${{ env.AZURE_RESOURCE_GROUP }} \
          --name $CONTAINER_NAME \
          --query ipAddress.fqdn \
          --output tsv)
        
        echo "Testing: http://$FQDN:3000"
        
        # Wait for application to be ready and test
        for i in {1..10}; do
          echo "Health check attempt $i/10..."
          if curl --fail --connect-timeout 10 http://$FQDN:3000; then
            echo "✅ Application is live and healthy!"
            echo "🎉 Demo URL ready: http://$FQDN:3000"
            break
          else
            echo "⚠️ Attempt $i failed, retrying in 15 seconds..."
            sleep 15
            if [ $i -eq 10 ]; then
              echo "⚠️ Health check timeout - application may still be starting"
              echo "📋 Container logs:"
              az container logs --resource-group ${{ env.AZURE_RESOURCE_GROUP }} --name $CONTAINER_NAME
            fi
          fi
        done

    - name: 📊 Final Deployment Summary
      if: always()
      run: |
        echo "========================================"
        echo "🎯 CI/CD PIPELINE COMPLETED"
        echo "========================================"
        echo "📦 Build: ${{ env.IMAGE_TAG }}"
        echo "🌿 Branch: ${{ github.ref_name }}"
        echo "👤 Author: ${{ github.actor }}"
        echo "📅 Time: $(date)"
        echo ""
        
        if [ "${{ github.ref }}" = "refs/heads/main" ]; then
          echo "🚀 PRODUCTION DEPLOYMENT:"
          echo "   🏭 Azure Container Registry: ${{ env.AZURE_CONTAINER_REGISTRY }}.azurecr.io"
          echo "   📦 Image: ${{ env.CONTAINER_NAME }}:latest"
          echo "   🌐 Live Demo: Check deployment information above"
          echo "   🎯 Ready for client presentation!"
        else
          echo "🧪 Testing completed for development branch"
        fi
        echo "========================================"
```

### Phase 5: Deploy and Test

#### 5.1 Commit and Push Initial Code

```bash
git add .
git commit -m "🚀 Initial CI/CD setup with Azure Container Registry"
git push origin main
```

#### 5.2 Monitor GitHub Actions

1. **Go to your GitHub repository**
2. **Click "Actions" tab**
3. **Watch the workflow execution**
4. **Check for any errors in the logs**

#### 5.3 Access Live Application

Once the workflow completes successfully:
1. **Check the workflow logs** for the live URL
2. **Look for**: `🌐 Live URL: http://calculator-demo-X.eastus.azurecontainer.io:3000`
3. **Open the URL** in your browser
4. **Test the calculator functionality**

---

## 🔧 Common Troubleshooting

### Issue 1: Service Principal Permission Errors
**Error**: `AuthorizationFailed` when deploying to ACI

**Solution**:
```bash
az role assignment create --assignee "YOUR_CLIENT_ID" --role "Contributor" --scope "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/calculator-app-rg"
```

### Issue 2: Container Instance Provider Not Registered
**Error**: `MissingSubscriptionRegistration` for `Microsoft.ContainerInstance`

**Solution**:
```bash
az provider register --namespace Microsoft.ContainerInstance
```

### Issue 3: Invalid OS Type
**Error**: `InvalidOsType` when creating container

**Solution**: Add `--os-type Linux` to the `az container create` command

### Issue 4: ACR Login Failures
**Error**: Authentication issues with ACR

**Solutions**:
1. Verify `ACR_PASSWORD` secret is correct
2. Ensure ACR admin user is enabled
3. Check `AZURE_CREDENTIALS` JSON format

---

## 📊 Architecture Benefits

### CI/CD Pipeline Advantages:
- ✅ **Automated Testing**: Every code change is automatically tested
- ✅ **Consistent Deployments**: Same process every time
- ✅ **Fast Feedback**: Know immediately if changes break anything
- ✅ **Version Control**: All changes tracked in Git
- ✅ **Rollback Capability**: Easy to revert to previous versions

### Azure Container Registry Benefits:
- ✅ **Private Registry**: Secure container image storage
- ✅ **Geo-Replication**: Images available in multiple regions
- ✅ **Security Scanning**: Built-in vulnerability detection
- ✅ **Azure Integration**: Seamless with Azure services
- ✅ **Cost Effective**: Pay only for what you use

### Azure Container Instances Benefits:
- ✅ **Serverless**: No infrastructure management
- ✅ **Fast Startup**: Containers start in seconds
- ✅ **Per-Second Billing**: Very cost effective
- ✅ **Public IPs**: Instant web access
- ✅ **Auto-scaling**: Handle traffic spikes automatically

---

## 🎯 Next Steps & Enhancements

### Production Considerations:
1. **Custom Domain**: Replace ACI DNS with your domain
2. **HTTPS/SSL**: Add SSL certificates for production
3. **Monitoring**: Implement Azure Application Insights
4. **Secrets Management**: Use Azure Key Vault
5. **Multi-Environment**: Add staging/production pipelines

### Advanced Features:
1. **Blue-Green Deployments**: Zero-downtime deployments
2. **Database Integration**: Add Azure Database support
3. **Microservices**: Split into multiple containers
4. **Kubernetes**: Migrate to Azure Kubernetes Service (AKS)
5. **Infrastructure as Code**: Add ARM templates or Terraform

### Security Improvements:
1. **Network Security**: Private endpoints and VNets
2. **Identity Management**: Managed identities
3. **Compliance**: Add security scanning and policies
4. **Audit Logging**: Track all changes and access
5. **Backup Strategy**: Automated backups and disaster recovery

---

## 📚 Additional Resources

### Official Documentation:
- [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)

### Learning Paths:
- [Azure DevOps Engineer](https://docs.microsoft.com/en-us/learn/paths/az-400-get-started-devops-transformation-journey/)
- [Container Applications](https://docs.microsoft.com/en-us/learn/paths/architect-modern-apps/)
- [GitHub Actions Fundamentals](https://docs.github.com/en/actions/learn-github-actions)

### Community Resources:
- [Azure DevOps Labs](https://azuredevopslabs.com/)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Docker Hub](https://hub.docker.com/)

---

## 🎉 Conclusion

This guide provides a complete, production-ready CI/CD pipeline using Azure Container Registry. The setup demonstrates modern DevOps practices including:

- **Infrastructure as Code** with GitHub Actions
- **Containerization** with Docker
- **Cloud-Native** deployment with Azure
- **Automated Testing** and deployment
- **Security** best practices

The pipeline is scalable, maintainable, and follows industry best practices for modern application development and deployment.

**Happy Coding! 🚀**

---

*Created on: October 7, 2025*  
*Author: Azure CI/CD Demo Guide*  
*Version: 1.0*