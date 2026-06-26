import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { projectId, userId, name, description, resources, healthScore, recommendations, securityFindings } = body;

    if (!projectId || !userId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'projectId and userId are required' })
      };
    }

    await docClient.send(new PutCommand({
      TableName: 'CloudWiseAI_Projects',
      Item: {
        projectId,
        userId,
        name: name || 'Untitled Project',
        description: description || '',
        resources: JSON.stringify(resources || []),
        healthScore: JSON.stringify(healthScore || {}),
        recommendations: JSON.stringify(recommendations || []),
        securityFindings: JSON.stringify(securityFindings || []),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, projectId, savedAt: new Date().toISOString() })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
