const verifyToken = async (req, res, next) => {
    // Get the access token from the request cookies.
    const accessToken = req.cookies['access_token'];
  
    // If there is no access token, return an error response.
    if (!accessToken) {
      return res.status(401).send({
        message: 'Unauthorized access.',
      });
    }
  
    // Verify the access token.
    try {
      const decodedToken = jwt.verify(accessToken, 'shhhhh'); //process.env.JWT_SECRET
      req.user = decodedToken;
    } catch (error) {
      return res.status(401).send({
        message: 'Invalid access token.',
      });
    }
  
    // Next middleware.
    next();
  };
  