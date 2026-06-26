import { Project, CloudResource, Recommendation, SecurityFinding } from './types';

// Mock initial project data for preview out-of-the-box
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Production E-Commerce Platform',
    description: 'High-availability retail app stack with caching and database redundancy.',
    createdAt: '2026-06-20T10:00:00Z',
    resources: [
      {
        id: 'res-vpc',
        name: 'MainVPC',
        type: 'VPC',
        region: 'us-east-1',
        cost: 0,
        config: { cidr: '10.0.0.0/16', subnets: 4 },
        position: { x: 50, y: 150 }
      },
      {
        id: 'res-cf',
        name: 'WebDistribution',
        type: 'CloudFront',
        region: 'us-east-1',
        cost: 35.50,
        config: { edgeLocations: 'global', sslEnabled: true },
        position: { x: 100, y: 50 }
      },
      {
        id: 'res-alb',
        name: 'AppALB',
        type: 'ALB',
        region: 'us-east-1',
        cost: 22.26,
        config: { scheme: 'internet-facing', targetGroups: 2 },
        position: { x: 300, y: 80 }
      },
      {
        id: 'res-ec2-1',
        name: 'WebServer-A',
        type: 'EC2',
        region: 'us-east-1',
        cost: 48.18,
        config: { instanceType: 't3.medium', os: 'Linux', count: 2, scaleTarget: 80 },
        position: { x: 500, y: 50 }
      },
      {
        id: 'res-rds',
        name: 'ProdDB-Postgres',
        type: 'RDS',
        region: 'us-east-1',
        cost: 138.50,
        config: { instanceClass: 'db.m6g.xlarge', multiAz: true, storageGb: 200 },
        position: { x: 750, y: 120 }
      },
      {
        id: 'res-s3',
        name: 'MediaAssetsBucket',
        type: 'S3',
        region: 'us-east-1',
        cost: 12.80,
        config: { storageClass: 'Standard', sizeGb: 500, versioning: true },
        position: { x: 500, y: 250 }
      },
      {
        id: 'res-lambda',
        name: 'OrderProcessor',
        type: 'Lambda',
        region: 'us-east-1',
        cost: 4.20,
        config: { memoryMb: 1024, timeoutSec: 15, executionsPerMonth: 5000000 },
        position: { x: 750, y: 280 }
      },
      {
        id: 'res-ddb',
        name: 'SessionCache',
        type: 'DynamoDB',
        region: 'us-east-1',
        cost: 15.60,
        config: { billingMode: 'PAY_PER_REQUEST', readCapacity: 0, writeCapacity: 0 },
        position: { x: 500, y: 380 }
      }
    ],
    healthScore: {
      overall: 84,
      security: 78,
      cost: 82,
      reliability: 90,
      scalability: 92
    },
    recommendations: [
      {
        id: 'rec-1',
        title: 'Right-size RDS instance',
        service: 'RDS',
        severity: 'medium',
        impact: 'High Cost Optimization',
        description: 'Your RDS postgres database is using less than 15% average CPU. Downgrade from db.m6g.xlarge to db.m6g.large.',
        suggestedFix: 'Open RDS database settings and modify instance class to db.m6g.large.',
        estimatedSavings: 69.25
      },
      {
        id: 'rec-2',
        title: 'Enable S3 Lifecycle Rule',
        service: 'S3',
        severity: 'low',
        impact: 'Cost Optimization',
        description: 'MediaAssetsBucket has 500GB standard data. Transitioning objects older than 90 days to Glacier Deep Archive reduces storage cost.',
        suggestedFix: 'Apply lifecycle policy transition to Glacier Deep Archive after 90 days.',
        estimatedSavings: 8.50
      },
      {
        id: 'rec-3',
        title: 'VPC Flow Logs Disabled',
        service: 'VPC',
        severity: 'medium',
        impact: 'Security Improvement',
        description: 'Your VPC does not log network packets, limiting attack analysis capabilities.',
        suggestedFix: 'Enable VPC flow logs outputting directly to CloudWatch log groups.',
        estimatedSavings: 0
      },
      {
        id: 'rec-4',
        title: 'Enable Multi-AZ redundancy',
        service: 'EC2',
        severity: 'high',
        impact: 'Reliability Boost',
        description: 'WebServer instances are in a single availability zone. A regional hazard will cause downtime.',
        suggestedFix: 'Deploy auto-scaling group spans across 3 AZs with ALB routing.',
        estimatedSavings: 0
      }
    ],
    securityFindings: [
      {
        id: 'sec-1',
        title: 'VPC Flow Logs Disabled',
        severity: 'medium',
        description: 'VPC flow logs are not configured on MainVPC.',
        status: 'failed',
        recommendation: 'Enable Flow Logs in VPC options.'
      },
      {
        id: 'sec-2',
        title: 'S3 Public Bucket Access Configuration',
        severity: 'high',
        description: 'S3 MediaAssetsBucket lacks explicit Public Access Block policy.',
        status: 'failed',
        recommendation: 'Apply AWS standard Block Public Access parameters.'
      },
      {
        id: 'sec-3',
        title: 'Database Encryption at Rest',
        severity: 'high',
        description: 'ProdDB-Postgres database is encrypted using KMS managed key.',
        status: 'passed',
        recommendation: 'None.'
      },
      {
        id: 'sec-4',
        title: 'CloudFront SSL Security Policies',
        severity: 'low',
        description: 'WebDistribution utilizes latest TLS 1.2 minimum validation.',
        status: 'passed',
        recommendation: 'None.'
      }
    ],
    logs: [
      'Project created.',
      'Resource WebServer-A initialized.',
      'RDS database connected.',
      'VPC subnets configuration computed.',
      'AI Analysis compiled successfully.'
    ]
  },
  {
    id: 'proj-2',
    name: 'Serverless Realtime Analytics App',
    description: 'Fully serverless configuration utilizing API Gateway, Lambda, and DynamoDB.',
    createdAt: '2026-06-22T14:30:00Z',
    resources: [
      {
        id: 'res-sl-lambda',
        name: 'TelemetryIngestion',
        type: 'Lambda',
        region: 'us-west-2',
        cost: 8.50,
        config: { memoryMb: 512, timeoutSec: 5, executionsPerMonth: 12000000 },
        position: { x: 100, y: 150 }
      },
      {
        id: 'res-sl-ddb',
        name: 'DeviceTelemetry',
        type: 'DynamoDB',
        region: 'us-west-2',
        cost: 45.20,
        config: { billingMode: 'PROVISIONED', readCapacity: 100, writeCapacity: 100 },
        position: { x: 300, y: 150 }
      }
    ],
    healthScore: {
      overall: 95,
      security: 98,
      cost: 91,
      reliability: 94,
      scalability: 98
    },
    recommendations: [
      {
        id: 'rec-sl-1',
        title: 'DynamoDB Auto-scaling or On-demand',
        service: 'DynamoDB',
        severity: 'high',
        impact: 'High Cost Optimization',
        description: 'DeviceTelemetry uses provisioned capacity with low average utilization. Switch to PAY_PER_REQUEST billing.',
        suggestedFix: 'Modify billing mode from Provisioned capacity to Pay-per-request.',
        estimatedSavings: 32.10
      }
    ],
    securityFindings: [
      {
        id: 'sec-sl-1',
        title: 'Lambda IAM Least Privilege',
        severity: 'low',
        description: 'TelemetryIngestion execution role uses restricted policy scopes.',
        status: 'passed',
        recommendation: 'None.'
      }
    ],
    logs: [
      'Serverless stack setup initialized.',
      'DynamoDB telemetry table created.',
      'IAM execution roles assigned.'
    ]
  }
];

// Helper to calculate total costs and statistics
export function recalculateProjectScores(resources: CloudResource[]): Project['healthScore'] {
  let security = 88;
  let cost = 85;
  let reliability = 88;
  let scalability = 90;

  // Rule-based heuristic simulation
  const hasVpc = resources.some(r => r.type === 'VPC');
  const dbMultiAz = resources.some(r => r.type === 'RDS' && r.config.multiAz === true);
  const totalCount = resources.length;

  if (totalCount === 0) {
    return { overall: 100, security: 100, cost: 100, reliability: 100, scalability: 100 };
  }

  // Security score
  if (!hasVpc && totalCount > 3) security -= 20; // Resources exposed
  if (resources.some(r => r.type === 'S3' && r.config.versioning !== true)) security -= 10;
  
  // Cost score
  const rdsCount = resources.filter(r => r.type === 'RDS').length;
  if (rdsCount > 2) cost -= 15;
  const standardS3 = resources.filter(r => r.type === 'S3' && r.config.storageClass === 'Standard');
  if (standardS3.length > 1) cost -= 8;

  // Reliability score
  if (rdsCount > 0 && !dbMultiAz) reliability -= 25;
  if (!resources.some(r => r.type === 'ALB') && resources.filter(r => r.type === 'EC2').length > 1) reliability -= 15;

  // Scalability score
  if (resources.some(r => r.type === 'CloudFront')) scalability += 5;
  if (resources.some(r => r.type === 'DynamoDB' && r.config.billingMode === 'PAY_PER_REQUEST')) scalability += 5;

  // Clamp values
  security = Math.max(10, Math.min(100, security));
  cost = Math.max(10, Math.min(100, cost));
  reliability = Math.max(10, Math.min(100, reliability));
  scalability = Math.max(10, Math.min(100, scalability));
  const overall = Math.round((security + cost + reliability + scalability) / 4);

  return { overall, security, cost, reliability, scalability };
}

export function generateMockRecommendations(resources: CloudResource[]): Recommendation[] {
  const recs: Recommendation[] = [];

  resources.forEach(res => {
    if (res.type === 'RDS' && res.config.multiAz !== true) {
      recs.push({
        id: `rec-rds-multi-az-${res.id}`,
        title: `Enable Multi-AZ configuration for ${res.name}`,
        service: 'RDS',
        severity: 'high',
        impact: 'High Availability',
        description: 'Single AZ deployments are vulnerable to database failure if the underlying availability zone goes down.',
        suggestedFix: 'Modify RDS instance configuration and toggle the Multi-AZ Deployment checkmark.',
        estimatedSavings: 0
      });
    }

    if (res.type === 'S3' && res.config.versioning !== true) {
      recs.push({
        id: `rec-s3-ver-${res.id}`,
        title: `Enable S3 bucket versioning for ${res.name}`,
        service: 'S3',
        severity: 'medium',
        impact: 'Data Protection',
        description: 'Bucket versioning protects your files from accidental overrides or delete commands.',
        suggestedFix: 'Enable S3 Versioning in bucket properties.',
        estimatedSavings: 0
      });
    }

    if (res.type === 'RDS' && String(res.config.instanceClass).includes('xlarge')) {
      recs.push({
        id: `rec-rds-size-${res.id}`,
        title: `Right-size RDS database ${res.name}`,
        service: 'RDS',
        severity: 'medium',
        impact: 'Cost Reduction',
        description: `Your ${res.name} database utilizes low baseline performance. Downsize memory/compute.`,
        suggestedFix: 'Downgrade storage instance to db.m6g.large.',
        estimatedSavings: 58.00
      });
    }

    if (res.type === 'EC2' && Number(res.config.scaleTarget || 0) < 50) {
      recs.push({
        id: `rec-ec2-scale-${res.id}`,
        title: `Optimize scale-out target for ${res.name}`,
        service: 'EC2',
        severity: 'low',
        impact: 'Scalability Boost',
        description: 'Scale-out trigger is set too low (under 50% CPU). Increase target CPU metric to prevent early instance provisioning.',
        suggestedFix: 'Adjust ASG scaling policy threshold to 70% CPU utilization.',
        estimatedSavings: 15.00
      });
    }
  });

  return recs;
}

export function generateMockSecurityFindings(resources: CloudResource[]): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  resources.forEach(res => {
    if (res.type === 'VPC') {
      findings.push({
        id: `sec-vpc-flow-${res.id}`,
        title: 'VPC Flow Logs monitoring',
        severity: 'medium',
        description: `VPC flow logs are not monitored on ${res.name}.`,
        status: 'failed',
        recommendation: 'Enable VPC flow logging in dashboard settings.'
      });
    }

    if (res.type === 'S3') {
      findings.push({
        id: `sec-s3-public-${res.id}`,
        title: 'S3 Public Access Blocks check',
        severity: 'high',
        description: `${res.name} does not explicitly verify strict Public IP restriction limits.`,
        status: 'failed',
        recommendation: 'Block Public Access options.'
      });
    }
  });

  return findings;
}
