const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Register a user
  const res = await request(app).post("/api/auth/register").send({
    name: "Group Creator",
    email: "group@example.com",
    password: "password123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Group API", () => {
  it("should create a group and assign user as admin", async () => {
    const res = await request(app)
      .post("/api/group")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Group",
        description: "This is a test group",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.group.name).toBe("Test Group");

    // Verify user is now admin and has groupId
    const user = await User.findOne({ where: { email: "group@example.com" } });
    expect(user.getDataValue("role")).toBe("admin");
    expect(user.getDataValue("groupId")).toBe(res.body.group.id);
  });

  it("should not allow creating a second group", async () => {
    const res = await request(app)
      .post("/api/group")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Another Group",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already belongs to a group/i);
  });
});
