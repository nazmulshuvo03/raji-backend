const app = require("./app");
const sequelize = require("./db");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected!!");
  })
  .catch((error) => {
    console.error("Sequelize synchronization error: ", error);
  });
