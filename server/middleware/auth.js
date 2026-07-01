const jwt = require('jsonwebtoken');

// I am going to use MLB (Major Leauge Baseball) analogy to help better understand what the following code does
// The Ticket Scanner at the gate
const authenticateToken = (req, res, next) => {
  // Checks that the Authorization header is present
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is missing',
    }); // This block of code means that if a fan does not have a ticket to the game they are rejected away from the game
  }

  // Extacting the token fro "Bearer TOKEN" format
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Authorization header must use the format: Bearer  <token>',
    });
  } // Fan presents entirely wrong ticket to the ticket scanner person and that person sends that fan back outside and rips the fake ticket

  const token = parts[1]; // The ticket scanner keeps the barcode side of the ticket, to prove that its real.

  // Verify the token with the secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // This line of code is when the scanner holds your ticket up to the machine, which uses the stadium secret master code which in this case is jwt_secret to check if the ticket is valid through MLB.

    if (err) {
      //Distinguuishing between expired and otherwise-invalid token
      const message =
        err.name === 'TokenExppiredError'
          ? 'Token has expired'
          : 'Token is invalid';
      return res.status(401).json({
        error: 'Unauthorized',
        message,
      });
    } // Pretty much straight forward the token is expired move on

    // Attach decoded user data to the request for downstream handlers
    req.user = decoded; // The scanner can now see everything printed on the ticket, the fans name, their seat number and if they are VIP(role)

    // Pass control to the next middleware/ route handler
    next(); // fan walks into the stadium and of to their seat
  });
};

// Middleware for requireAdmin, Its like the second body guard outsside the players clubhouse.

const requireAdmin = (req, res, next) => {
  // Checking the role on the already verified user!
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin privilages are require to access this resource', // If a user is already signed in but he does not have the role as admin then they get a 403
    });
  }
};
