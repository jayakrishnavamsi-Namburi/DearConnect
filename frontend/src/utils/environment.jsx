let IS_PROD = false;

const server = IS_PROD
  ? "https://apnacollegebackend.onrender.com"  // your deployed backend
  : "http://localhost:5000";                   // dev backend

export default server;
