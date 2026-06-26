import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const s3Client = new S3Client({ region: "ap-south-1" });
const ddbClient = new DynamoDBClient({ region: "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// ⚠️ Replace this with your actual private reports bucket name
const REPORTS_BUCKET = process.env.REPORTS_BUCKET_NAME || 'cloudwise-ai-reports-2026';

export const handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { project } = body;

    if (!project) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'project data is required' })
      };
    }

    const reportId = `report-${project.id || 'unknown'}-${Date.now()}`;
    const totalCost = (project.resources || []).reduce((sum, r) => sum + (r.cost || 0), 0);
    const totalSavings = (project.recommendations || []).reduce((sum, r) => sum + (r.estimatedSavings || 0), 0);

    // Build structured report content
    const reportContent = JSON.stringify({
      reportId,
      generatedAt: new Date().toISOString(),
      platform: 'CloudWise AI',
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        resourceCount: (project.resources || []).length,
        healthScore: project.healthScore,
        monthlyCost: totalCost.toFixed(2),
        yearlyCost: (totalCost * 12).toFixed(2),
        potentialMonthlySavings: totalSavings.toFixed(2)
      },
      resources: project.resources || [],
      recommendations: project.recommendations || [],
      securityFindings: project.securityFindings || []
    }, null, 2);

    // Upload report JSON to private S3 bucket
    await s3Client.send(new PutObjectCommand({
      Bucket: REPORTS_BUCKET,
      Key: `reports/${reportId}.json`,
      Body: reportContent,
      ContentType: 'application/json'
    }));

    // Save report metadata to DynamoDB
    await docClient.send(new PutCommand({
      TableName: 'CloudWiseAI_Reports',
      Item: {
        reportId,
        projectId: project.id || 'unknown',
        projectName: project.name,
        generatedAt: new Date().toISOString(),
        s3Key: `reports/${reportId}.json`,
        totalCost: String(totalCost.toFixed(2)),
        totalSavings: String(totalSavings.toFixed(2))
      }
    }));

    // Generate a 1-hour pre-signed download URL
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: REPORTS_BUCKET,
        Key: `reports/${reportId}.json`
      }),
      { expiresIn: 3600 }
    );

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        reportId,
        downloadUrl: signedUrl,
        expiresIn: '1 hour'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
