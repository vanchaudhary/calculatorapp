# 🎯 Complete Database CI/CD Implementation Guide

> **⚠️ SECURITY NOTICE**: All sensitive values (subscription IDs, client secrets, passwords) in this guide have been sanitized with placeholder values (xxxxxxxx). Replace these with your actual values when implementing.

> **📅 Implementation Date**: October 9, 2025  
> **👤 Author**: Calculator Database Demo Project  
> **🎯 Objective**: Transform simple calculator into enterprise-grade app with Azure SQL Database and CI/CD

---

## 🚀 Project Overview

This document details the complete transformation of a simple calculator application into an enterprise-ready solution with:
- **Azure SQL Database** integration
- **Database CI/CD** pipeline
- **Enhanced features** (user sessions, calculation history, statistics)
- **Full Azure deployment** with Container Registry and Container Instances

---

## 📊 Evolution Journey

### **Phase 1: Simple Calculator (main branch)**
- Basic HTML/JavaScript calculator
- No persistence, no database
- Stateless operations

### **Phase 2: Database Integration (database-demo branch)**
- Node.js/Express backend
- Azure SQL Database connection
- User session management
- Calculation history and statistics

### **Phase 3: CI/CD Automation**
- GitHub Actions workflows
- Database schema deployment
- Container deployment to Azure

---

## 🗄️ Part 1: Azure SQL Database Setup

### **Step 1: Create Azure SQL Server**

#### **Azure Portal Steps:**
1. **Navigate to Azure Portal**: https://portal.azure.com
2. **Search for "SQL servers"** and click "Create"
3. **Configure SQL Server**:
   ```
   Subscription: [Your Subscription]
   Resource Group: calculator-db-rg (Create new)
   Server Name: calculator-sql-server-vc
   Location: Central India
   Authentication: SQL authentication
   Admin Login: sqladmin
   Password: [Your Secure Password]
   ```
4. **Click "Create"** and wait for deployment

#### **Azure CLI Alternative:**
```bash
# Create resource group
az group create --name calculator-db-rg --location centralindia

# Create SQL server
az sql server create \
  --name calculator-sql-server-vc \
  --resource-group calculator-db-rg \
  --location centralindia \
  --admin-user sqladmin \
  --admin-password [YourSecurePassword]
```

### **Step 2: Configure Network Access**

#### **Firewall Configuration:**
1. **Go to SQL Server** → **Networking**
2. **Enable "Allow Azure services and resources to access this server"**
3. **Add client IP addresses** as needed

#### **Azure CLI Commands:**
```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group calculator-db-rg \
  --server calculator-sql-server-vc \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Add client IP (replace with your IP)
az sql server firewall-rule create \
  --resource-group calculator-db-rg \
  --server calculator-sql-server-vc \
  --name ClientIP \
  --start-ip-address [YOUR_IP] \
  --end-ip-address [YOUR_IP]
```

### **Step 3: Create Calculator Database**

#### **Database Creation:**
1. **From SQL Server resource**, click **"Create database"**
2. **Database Configuration**:
   ```
   Database Name: calculator
   Compute Tier: Basic (2 GB storage)
   Backup Storage: Locally-redundant
   Estimated Cost: ~$5.60 USD/month
   ```

#### **Azure CLI Command:**
```bash
az sql db create \
  --resource-group calculator-db-rg \
  --server calculator-sql-server-vc \
  --name calculator \
  --service-objective Basic
```

### **Step 4: Create Database Tables**

#### **Using Query Editor:**
1. **Navigate to Database** → **Query editor (preview)**
2. **Login with your SQL credentials**
3. **Execute these SQL commands**:

```sql
-- Create Users table
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    session_id NVARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Create Calculations table
CREATE TABLE Calculations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES Users(id),
    expression NVARCHAR(500) NOT NULL,
    result NVARCHAR(100) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Verify tables created
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
```

### **Step 5: Connection String**

**Connection String Format:**
```
Server=tcp:[YOUR-SERVER].database.windows.net,1433;Initial Catalog=calculator;Persist Security Info=False;User ID=[USERNAME];Password=[PASSWORD];MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

---

## 🏗️ Part 2: Application Enhancement

### **Step 1: Project Structure Creation**

#### **Created Branch:**
```bash
git checkout -b database-demo
```

#### **New Project Structure:**
```
calculatorapp/
├── app.js                    # Enhanced with database connectivity
├── package.json             # Added database dependencies
├── views/
│   └── calculator.ejs       # EJS template with history panel
├── database/
│   ├── Calculator.sqlproj   # SQL project for CI/CD
│   └── Tables/
│       ├── Users.sql        # User table schema
│       └── Calculations.sql # Calculations table schema
└── .github/workflows/
    ├── deploy-database.yml  # Database CI/CD workflow
    └── fullstack-demo-deploy.yml # Full application deployment
```

### **Step 2: Package.json Updates**

**Added Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mssql": "^9.1.1",
    "express-session": "^1.17.3",
    "ejs": "^3.1.9",
    "uuid": "^9.0.0"
  }
}
```

### **Step 3: Database Connection Configuration**

**Database Configuration in app.js:**
```javascript
const dbConfig = process.env.AZURE_SQL_CONNECTION_STRING ? {
    server: '[YOUR-SERVER].database.windows.net',
    database: 'calculator',
    user: '[USERNAME]',
    password: '[PASSWORD]',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
} : {
    // Fallback configuration for local development
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE || 'calculator-db',
    user: process.env.SQL_USER || 'sa',
    password: process.env.SQL_PASSWORD || 'YourPassword123!',
    options: {
        encrypt: true,
        trustServerCertificate: process.env.NODE_ENV === 'development'
    }
};
```

### **Step 4: Enhanced Features Implementation**

#### **User Session Management:**
```javascript
app.use(session({
    secret: process.env.SESSION_SECRET || 'calculator-demo-secret',
    resave: false,
    saveUninitialized: true,
    genid: () => uuidv4()
}));
```

#### **Database Operations:**
```javascript
// Save calculation to database
async function saveCalculation(sessionId, expression, result) {
    const pool = await sql.connect(dbConfig);
    
    // Get or create user
    let user = await pool.request()
        .input('sessionId', sql.NVarChar, sessionId)
        .query('SELECT id FROM Users WHERE session_id = @sessionId');
    
    if (user.recordset.length === 0) {
        user = await pool.request()
            .input('sessionId', sql.NVarChar, sessionId)
            .query('INSERT INTO Users (session_id) OUTPUT INSERTED.id VALUES (@sessionId)');
    }
    
    const userId = user.recordset[0].id;
    
    // Save calculation
    await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .input('expression', sql.NVarChar, expression)
        .input('result', sql.NVarChar, result)
        .query('INSERT INTO Calculations (user_id, expression, result) VALUES (@userId, @expression, @result)');
}
```

---

## 🔄 Part 3: CI/CD Pipeline Setup

### **Step 1: Azure Container Registry Creation**

#### **ACR Creation Command:**
```bash
az acr create \
  --resource-group calculator-db-rg \
  --name [YOUR-ACR-NAME] \
  --sku Basic \
  --location centralindia
```

#### **Enable Admin User:**
```bash
az acr update --name [YOUR-ACR-NAME] --admin-enabled true
```

#### **Get ACR Credentials:**
```bash
az acr credential show --name [YOUR-ACR-NAME]
```

**Sample Output:**
```json
{
  "passwords": [
    {
      "name": "password",  
      "value": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  ],
  "username": "[YOUR-ACR-NAME]"
}
```

### **Step 2: Service Principal Creation**

#### **Create Service Principal:**
```bash
az ad sp create-for-rbac \
  --name "calculator-github-actions" \
  --role contributor \
  --scopes "/subscriptions/[SUBSCRIPTION-ID]" \
  --sdk-auth
```

**Sample Output:**
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

### **Step 3: GitHub Secrets Configuration**

#### **Required Secrets:**
| Secret Name | Purpose |
|-------------|---------|
| `AZURE_CREDENTIALS` | Azure authentication |
| `ACR_PASSWORD` | Container registry access |
| `AZURE_CONTAINER_REGISTRY` | Registry name |
| `AZURE_RESOURCE_GROUP` | Resource group |
| `AZURE_SQL_CONNECTION_STRING` | Database access |
| `AZURE_SQL_PASSWORD` | SQL password |
| `SESSION_SECRET` | Session security |

### **Step 4: Database CI/CD Workflow**

#### **Created: `.github/workflows/deploy-database.yml`**
```yaml
name: Deploy Database Schema

on:
  push:
    branches: [ database-demo ]
    paths: [ 'database/**' ]

jobs:
  deploy-database:
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🔧 Install sqlcmd
      run: |
        curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
        curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
        sudo apt-get update
        sudo ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev
        
    - name: 🗄️ Deploy Database Schema
      run: |
        /opt/mssql-tools/bin/sqlcmd \
          -S [YOUR-SERVER].database.windows.net \
          -d calculator \
          -U [USERNAME] \
          -P '${{ secrets.AZURE_SQL_PASSWORD }}' \
          -Q "
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
          CREATE TABLE Users (
              id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
              session_id NVARCHAR(255) UNIQUE NOT NULL,
              created_at DATETIME2 DEFAULT GETDATE()
          );
          
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Calculations' AND xtype='U')
          CREATE TABLE Calculations (
              id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
              user_id UNIQUEIDENTIFIER REFERENCES Users(id),
              expression NVARCHAR(500) NOT NULL,
              result NVARCHAR(100) NOT NULL,
              created_at DATETIME2 DEFAULT GETDATE()
          );
          "
```

---

## 🔧 Troubleshooting & Common Issues

### **Issue 1: sqlpackage ENOENT Error**

#### **Problem:**
```
Error: spawn sqlpackage ENOENT
```

#### **Solution:**
Use direct sqlcmd approach instead of Azure SQL Action:
```yaml
- name: 🔧 Install sqlcmd
  run: |
    curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
    sudo apt-get update
    sudo ACCEPT_EULA=Y apt-get install -y mssql-tools unixodbc-dev
```

### **Issue 2: Container Image Access Error**

#### **Problem:**
```
InaccessibleImage: The image is not accessible
```

#### **Solution:**
1. Verify ACR credentials in GitHub secrets
2. Check container registry permissions
3. Ensure service principal has ACR access

### **Issue 3: Database Connection Issues**

#### **Problem:**
Application showing "Demo Mode" despite database setup

#### **Solution:**
1. Verify `AZURE_SQL_CONNECTION_STRING` environment variable
2. Check firewall rules for container IP ranges
3. Validate connection string format

---

## 🎯 Final Results & Achievements

### **Technical Achievements:**
1. ✅ **Database Integration**: Node.js app connected to Azure SQL Database
2. ✅ **CI/CD Pipeline**: Automated database schema deployment
3. ✅ **Container Deployment**: Full application deployment to Azure Container Instances
4. ✅ **Enterprise Features**: User sessions, calculation history, statistics
5. ✅ **Cloud Architecture**: Multi-service Azure deployment

### **Architecture Achieved:**
```
GitHub Repository (database-demo branch)
    ↓
GitHub Actions CI/CD
    ↓
Azure SQL Database + Azure Container Registry
    ↓
Azure Container Instances
    ↓
Live Application with Database Features
```

---

## 📊 Key Commands Reference

### **Azure CLI Commands:**
```bash
# Resource group
az group create --name calculator-db-rg --location centralindia

# SQL Server
az sql server create --name [SERVER-NAME] --resource-group calculator-db-rg --location centralindia --admin-user [USERNAME] --admin-password [PASSWORD]

# Database
az sql db create --resource-group calculator-db-rg --server [SERVER-NAME] --name calculator --service-objective Basic

# Container Registry
az acr create --resource-group calculator-db-rg --name [ACR-NAME] --sku Basic --location centralindia
az acr update --name [ACR-NAME] --admin-enabled true

# Service Principal
az ad sp create-for-rbac --name "calculator-github-actions" --role contributor --scopes "/subscriptions/[SUBSCRIPTION-ID]" --sdk-auth
```

### **Git Commands:**
```bash
git checkout -b database-demo
git add .
git commit -m "feat: Add database integration and CI/CD pipeline"
git push origin database-demo
```

---

## 🎉 Project Outcomes

### **Business Value:**
1. **Scalability**: From simple calculator to enterprise-ready application
2. **Automation**: Zero-downtime deployments with CI/CD
3. **Data Persistence**: User data preserved across sessions
4. **Professional UI**: Enhanced user experience with modern features
5. **Cloud-Native**: Ready for production scaling and monitoring

### **Skills Demonstrated:**
- Azure SQL Database management
- GitHub Actions CI/CD pipeline development
- Container orchestration with Azure services
- Database schema management and deployment
- Full-stack application development with persistence
- DevOps best practices and troubleshooting

---

**📅 Project Completed**: October 9, 2025  
**🎯 Demo Status**: Fully Successful with Live Application  
**🌐 Architecture**: Complete cloud-native solution with database integration  

---

*This documentation serves as a complete reference for replicating the database CI/CD implementation and demonstrates the evolution from a simple application to an enterprise-grade solution.*