/**
 * Middleware function to check if the request body contains specific properties.
 * @param {...string} properties - List of properties to check in the request body
 * @returns {function} - Middleware function for Express.js
 */

function hasProperties(...properties) {
  return function(req, res, next) {
    const { data = {} } = req.body;

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      // If all properties are present in the request body, proceed to the next middleware
      next();
    } catch (error) {
      // If any property is missing, pass the error to the error-handling middleware
      next(error);
    }
  };
}

module.exports = hasProperties;
