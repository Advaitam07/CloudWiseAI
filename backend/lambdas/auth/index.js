/**
 * AWS Lambda Event Handler implementing Cognito User Token verification middleware.
 */
exports.handler = async (event) => {
  const authHeader = event.headers?.Authorization || event.headers?.authorization;

  if (!authHeader) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Unauthorized. Missing authorization token in request headers.' })
    };
  }

  // Expect Bearer token structure
  const token = authHeader.replace(/^Bearer\s+/i, '');

  try {
    // Under actual environment, decrypt with JSON Web Keys from Cognito UserPool endpoint url
    // Mock decrypt / parsing payload for validation demonstration
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        authenticated: true,
        user: {
          username: payload['cognito:username'] || payload.email,
          email: payload.email,
          verified: payload.email_verified
        }
      })
    };
  } catch (err) {
    return {
      statusCode: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Unauthorized token signature invalidation.' })
    };
  }
};
