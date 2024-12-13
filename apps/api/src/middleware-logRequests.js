const logRequests = (req, res, next) => {
    const { method, originalUrl, body, query } = req;
  
    console.log(`[API Request] ${method} ${originalUrl}`);
    if (Object.keys(query).length > 0) {
      console.log(`[Query Parameters]:`, JSON.stringify(query, null, 2));
    }
    if (Object.keys(body).length > 0) {
      console.log(`[Request Body]:`, JSON.stringify(body, null, 2));
    }
  
    next(); 
  };
  
  module.exports = logRequests;
  