module.exports = {
  apps: [
    {
      name: "plan-ministerial-backend",
      script: "npm start",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      autorestart: true,
      max_memory_restart: "500M"
    }
  ]
};
