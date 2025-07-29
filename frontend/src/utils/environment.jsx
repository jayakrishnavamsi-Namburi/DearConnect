// src/utils/environment.js

let IS_PROD = true;

const server = IS_PROD
  ? "https://dearconnectbackend.onrender.com"  // ✅ deployed backend
  : "http://localhost:10000";                   // dev backend

export default server;
