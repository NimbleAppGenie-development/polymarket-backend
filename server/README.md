# Project Setup Guide

## Prerequisites
Ensure you have the following installed:
- **Git**: [Download Git](https://git-scm.com/downloads)
- **Node.js & npm**: [Download Node.js](https://nodejs.org/en/download)
  - Check installation with:
    ```sh
    node -v
    npm -v
    ```

## Installation Steps

### 1. Clone the Repository
```sh
git clone <repository-url>
```

### 2. Navigate to the Project Directory
```sh
cd <repository-name>
```

### 3. Install Dependencies
```sh
npm install
```

## Running the Project

### 1. Start the Services
```sh
npm run start:user
npm run start:trans
```

### 2. Handling AWS Credentials (If Required)
If you encounter an error related to missing AWS credentials, set them manually.

#### **On Windows (PowerShell):**
```powershell
$env:AWS_ACCESS_KEY_ID="<your-access-key>"
$env:AWS_SECRET_ACCESS_KEY="<your-secret-key>"
$env:SECRET_NAME="<your-secret-name>"
```

#### **On macOS/Linux (Terminal):**
```sh
export AWS_ACCESS_KEY_ID="<your-access-key>"
export AWS_SECRET_ACCESS_KEY="<your-secret-key>"
export SECRET_NAME="<your-secret-name>"
```
3. **Install migrate and seeder data (When new database connected)**
	npx sequelize-cli db:migrate --config=./libs/shared/config/config.json
	npx sequelize-cli db:seed:all  --config=./libs/shared/config/config.json

### 3. Restart the Services
```sh
npm run start:user
npm run start:trans
```

OR

pm2 start .\ecosystem.config.js

Additional Notes :
Ensure your environment variables are correctly set up.
If you face permission issues, try running commands with sudo (Linux/macOS).
Check logs for debugging: npm run logs (if applicable).
We are going to setup code with existing setup of RDS server, if require to create separate secret manager for local then need to create seperate
Secret manager have existing RDS server details and another contacts like:

```json
{
    "username":"",
    "password":"",
    "engine":"",
    "host":"",
    "port":5432,
    "dbInstanceIdentifier":"",
    "SMTP_HOST":"",
    "SMTP_PORT":587,
    "SMTP_USERNAME":"",
    "SMTP_PASSWORD":"",
    "SMTP_FROM":"",
    "JWT_SECRET_KEY":"",
    "JWT_REFRESH_SECRET_KEY":""
}

```


