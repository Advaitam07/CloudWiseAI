import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId || 'default-user';

    const result = await docClient.send(new ScanCommand({
      TableName: 'CloudWiseAI_Projects',
      FilterExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId }
    }));

    const projects = (result.Items || []).map(item => ({
      ...item,
      resources: JSON.parse(item.resources || '[]'),
      healthScore: JSON.parse(item.healthScore || '{}'),
      recommendations: JSON.parse(item.recommendations || '[]'),
      securityFindings: JSON.parse(item.securityFindings || '[]')
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ projects, count: projects.length })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
