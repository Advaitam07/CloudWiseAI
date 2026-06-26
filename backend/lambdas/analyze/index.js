const path = require('path');
const fs = require('fs');

/**
 * AWS Lambda event handler verifying architecture estimates and security policies.
 * 
 * Invoked by API Gateway for analytics reports compiling.
 */
exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { resources = [] } = body;

    // Static Rule Engine
    const recommendations = [];
    const securityFindings = [];

    // VPC audit checks
    const hasVpc = resources.some(r => r.type === 'VPC');
    if (!hasVpc && resources.length > 2) {
      securityFindings.push({
        id: 'sec-lambda-vpc-missing',
        title: 'VPC network segregation audit',
        severity: 'high',
        description: 'No VPC boundary detected while compute servers are active. Nodes may be exposed publicly.',
        status: 'failed',
        recommendation: 'Encapsulate EC2 and RDS instances inside private VPC subnets.'
      });
    }

    // RDS storage audit checks
    resources.forEach(res => {
      if (res.type === 'RDS') {
        const isMultiAz = res.config?.multiAz === true;
        if (!isMultiAz) {
          recommendations.push({
            id: `rec-lambda-rds-ha-${res.id}`,
            title: `Enable multi-AZ reliability for ${res.name}`,
            service: 'RDS',
            severity: 'high',
            impact: 'Availability Boost',
            description: `Relational database ${res.name} running on single AZ. High risk of hardware failover downtime.`,
            suggestedFix: 'Modify RDS instance configuration to enable multi-AZ mode.',
            estimatedSavings: 0
          });
        }
      }
    });

    // Score computation heuristics
    let baseScore = 95;
    if (securityFindings.length > 0) baseScore -= 15;
    if (recommendations.length > 0) baseScore -= 10;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // API gateway CORS
      },
      body: JSON.stringify({
        score: Math.max(10, baseScore),
        recommendations,
        securityFindings,
        timestamp: new Date().toISOString()
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
