// Cloud resource types supported by builder
export type ResourceType = 'EC2' | 'S3' | 'Lambda' | 'DynamoDB' | 'RDS' | 'ALB' | 'CloudFront' | 'VPC';

export interface CloudResource {
  id: string;
  name: string;
  type: ResourceType;
  region: string;
  cost: number;
  config: Record<string, string | number | boolean>;
  position: { x: number; y: number };
}

export interface Recommendation {
  id: string;
  title: string;
  service: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  description: string;
  suggestedFix: string;
  estimatedSavings: number;
}

export interface SecurityFinding {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  status: 'failed' | 'passed';
  recommendation: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  resources: CloudResource[];
  createdAt: string;
  healthScore: {
    overall: number;
    security: number;
    cost: number;
    reliability: number;
    scalability: number;
  };
  recommendations: Recommendation[];
  securityFindings: SecurityFinding[];
  logs: string[];
}
