# CloudWise AI - AWS Deployment Guide

Since you do not have the **AWS CLI** or **AWS SAM CLI** installed locally on this machine, you can deploy the CloudWise AI platform using the **AWS Web Console** (fully compatible with the AWS Free Tier).

Follow these step-by-step instructions:

---

## Part 1: Deploy the Backend Lambda Functions

1. **Sign In to AWS**: Go to the [AWS Management Console](https://aws.amazon.com/console/) and sign in.
2. **Open AWS Lambda Console**: Search for **Lambda** in the top search bar.
3. **Create the Analysis Function**:
   - Click **Create function**.
   - Choose **Author from scratch**.
   - Function name: `CloudWiseAI_AnalyzeEngine`
   - Runtime: `Node.js 18.x` or `Node.js 20.x`.
   - Click **Create function**.
4. **Upload Code**:
   - In the **Code** tab, replace the default code in `index.mjs` with the contents of the [analyze lambda handler](file:///c:/Users/hp/OneDrive/Desktop/CloudWise%20AI/backend/lambdas/analyze/index.js).
   - Click **Deploy**.

---

## Part 2: Create API Gateway Endpoint

1. **Open API Gateway Console**: Search for **API Gateway** in the AWS search bar.
2. **Create REST API**:
   - Scroll down to **REST API** (not HTTP API) and click **Build**.
   - Select **New API**.
   - API name: `CloudWiseAI_API`
   - Endpoint Type: `Regional`
   - Click **Create API**.
3. **Create CORS and Resources**:
   - Click **Actions** -> **Create Resource**. Name it `analyze`.
   - Select `/analyze` resource, click **Actions** -> **Create Method** -> Select **POST**.
   - Choose Integration type: **Lambda Function**.
   - Check **Use Lambda Proxy integration** (critical!).
   - Select the Lambda function `CloudWiseAI_AnalyzeEngine`.
   - Click **Save**.
   - Select `/analyze` resource, click **Actions** -> **Enable CORS** and click through to enable it.
4. **Deploy the API**:
   - Click **Actions** -> **Deploy API**.
   - Deployment stage: `[New Stage]` -> Stage name: `prod`.
   - Click **Deploy**.
   - **Copy the Invoke URL** (e.g., `https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod/analyze`).

---

## Part 3: Deploy Frontend on AWS S3 Static Hosting

1. **Build the Frontend Assets**:
   Inside the project, run:
   ```powershell
   npm run build --prefix frontend
   ```
   This compiles your production-ready static assets into the [frontend/dist](file:///c:/Users/hp/OneDrive/Desktop/CloudWise%20AI/frontend/dist) directory.

2. **Open S3 Console**: Search for **S3** in the AWS console.
3. **Create S3 Bucket**:
   - Click **Create bucket**.
   - Bucket name: `cloudwise-ai-frontend-xxxx` (must be unique).
   - **Uncheck** "Block *all* public access" (to allow public static website hosting).
   - Acknowledge the warning and click **Create bucket**.
4. **Enable Static Website Hosting**:
   - Open your new bucket -> Go to the **Properties** tab.
   - Scroll to **Static website hosting** -> Click **Edit**.
   - Choose **Enable**.
   - Index document: `index.html`
   - Error document: `index.html`
   - Click **Save changes**.
5. **Set Bucket Policy for Public Access**:
   - Go to the **Permissions** tab -> **Bucket policy** -> Click **Edit**.
   - Paste the following Policy (replace `your-bucket-name` with your actual bucket name):
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::your-bucket-name/*"
         }
       ]
     }
     ```
   - Click **Save changes**.
6. **Upload Frontend Files**:
   - Go to the **Objects** tab.
   - Upload **all contents** inside the local folder `c:/Users/hp/OneDrive/Desktop/CloudWise AI/frontend/dist/` (including `index.html` and the `assets` folder).
   - **Done!** S3 will give you a static web hosting endpoint URL (e.g. `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`) to access your live production platform!

---

## Part 4: Additional AWS Resources and Integration

### Step 1: Create DynamoDB Tables

1. Open the **DynamoDB Console**.
2. Click **Create table**.
3. Create the first table:
   - Table name: `CloudWiseAI_Projects`
   - Partition key: `projectId` (String)
   - Leave all other defaults, then click **Create table**.
4. Create the second table:
   - Table name: `CloudWiseAI_Reports`
   - Partition key: `reportId` (String)
   - Leave all other defaults, then click **Create table**.

### Step 2: Create S3 Reports Bucket

1. Open the **S3 Console**.
2. Click **Create bucket**.
3. Bucket name: `cloudwise-ai-reports-xxxx` (replace `xxxx` with a unique suffix).
4. Region: choose the same region as your other resources.
5. Under **Block public access settings for this bucket**, keep all public access blocked.
6. Click **Create bucket**.

> The reports bucket is private. Do not enable public access.

### Step 3: Create New Lambda Functions

For each function, use **Author from scratch**, runtime `Node.js 18.x` or `Node.js 20.x`, and appropriate code from the backend folder.

1. `CloudWiseAI_SaveProject`
   - Purpose: save projects to the `CloudWiseAI_Projects` DynamoDB table.
2. `CloudWiseAI_GetProjects`
   - Purpose: fetch projects from `CloudWiseAI_Projects` for the authenticated user.
3. `CloudWiseAI_SaveReport`
   - Purpose: generate reports and store PDF output in the `cloudwise-ai-reports-xxxx` S3 bucket.

### Step 4: Update the Analyze Lambda

1. Open the `CloudWiseAI_AnalyzeEngine` Lambda function.
2. In the function code, add a DynamoDB save call after analysis completes.
3. The save should persist the analysis result or project metadata into `CloudWiseAI_Projects` as needed.

### Step 5: Add API Gateway Routes

1. Open API Gateway, then select the `CloudWiseAI_API` REST API.
2. Create or reuse the `/projects` resource.
   - Add **POST /projects** and integrate it with `CloudWiseAI_SaveProject`.
   - Add **GET /projects** and integrate it with `CloudWiseAI_GetProjects`.
3. Create or reuse the `/reports` resource.
   - Add **POST /reports** and integrate it with `CloudWiseAI_SaveReport`.
4. For each route, use **Lambda Proxy integration**.
5. Re-deploy the API to the `prod` stage.

### Step 6: Setup Cognito User Pool

1. Open the **Amazon Cognito Console**.
2. Create a new **User Pool** for CloudWise AI.
3. Create an **App client** in that pool.
4. Copy the **User Pool ID** and **App client ID**.

> You will use these values in the frontend configuration.

### Step 7: Frontend Updates

1. Configure `frontend/aws-config.ts` with the real Cognito User Pool ID, Client ID, and API endpoint URL.
2. Update `frontend/Auth.tsx` to use Cognito authentication APIs instead of mock auth.
3. Wire the project save and load flows to the `/projects` API routes.
4. Wire the report generation/download flow to `/reports` and use signed S3 URLs to download PDF reports securely.

### After Part 3

Complete all of the above steps after you finish deploying your frontend bucket and static site. These steps connect the AWS backend services, authentication, and reporting storage so the app works with real data and secure access.

