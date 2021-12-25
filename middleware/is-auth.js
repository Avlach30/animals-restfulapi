const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization'); // Mendapatkan nilai dari header 'Authorization
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  //Meisahkan nilai dari header Authorization untuk mengambil session token
  const token = authHeader.split(' ')[1]; 

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'myultimatesecret'); //Memverifikasikan token jwt
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  //if decoded token undefined (token not found)
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  //console.log(req.userId);
  next();
};
