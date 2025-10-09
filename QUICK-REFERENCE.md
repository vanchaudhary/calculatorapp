# 🚀 Quick Reference: Azure CI/CD Pipeline

> ⚠️ **SECURITY NOTICE**: All sensitive values have been sanitized. Replace placeholder values (xxxxxxxx) with your actual Azure credentials.

## 📋 Essential Commands & Configurations

### Azure CLI Commands
```bash
# Login to Azure
az login

# Get subscription ID
az account show --query id --output tsv

# Create service principal
az ad sp create-for-rbac --name "calculatorapp-github" --role contributor --scopes /subscriptions/SUBSCRIPTION_ID/resourceGroups/calculator-app-rg --json-auth

# Register Container Instance provider
az provider register --namespace Microsoft.ContainerInstance

# Add contributor permissions (if needed)
az role assignment create --assignee "YOUR_CLIENT_ID" --role "Contributor" --scope "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/calculator-app-rg"
```

### GitHub Secrets Required
```
AZURE_CREDENTIALS = {
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxx~xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}

ACR_PASSWORD = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Azure Resources Created
- **Resource Group**: `calculator-app-rg`
- **Container Registry**: `calculatorappacr.azurecr.io`
- **Container Instances**: `calculator-demo-X` (unique per deployment)

### Key Workflow Features
- ✅ Automated Docker build and test
- ✅ Push to Azure Container Registry
- ✅ Deploy to Azure Container Instances
- ✅ Health checks and monitoring
- ✅ Unique container naming per deployment

### Demo URLs Format
```
http://calculator-demo-X.eastus.azurecontainer.io:3000
```
Where `X` is the GitHub Actions run number.

---

## 🔧 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Permission errors | Add Contributor role to service principal |
| Container provider not registered | Run `az provider register --namespace Microsoft.ContainerInstance` |
| Invalid OS type | Add `--os-type Linux` to container create command |
| ACR login failed | Check ACR admin user enabled and password correct |

---

## 📊 Pipeline Flow
1. **Code Push** → 2. **GitHub Actions** → 3. **Docker Build** → 4. **Push to ACR** → 5. **Deploy to ACI** → 6. **Live URL**

**Total Setup Time**: ~30 minutes  
**Cost**: ~$5-10/month for demo usage

---

*For complete details, see AZURE-CICD-GUIDE.md*