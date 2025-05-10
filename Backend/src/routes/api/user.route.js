const router = require("express").Router();
const userController = require("../../controllers/api/user.controller");



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations
 */

/**
 * @swagger
 *  /user/sign-up:
 *    post:
 *      summary: User registration
 *      tags: [User]
 *      requestBody:
 *        description: User registration details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *                - last_name
 *                - email
 *                - phone
 *                - password
 *              properties:
 *                first_name:
 *                  type: string
 *                  description: The first name of the user
 *                  example: John
 *                last_name:
 *                  type: string
 *                  description: The last name of the user
 *                  example: Doe
 *                email:
 *                  type: string
 *                  description: The email address of the user
 *                  example: john.doe@example.com
 *                phone:
 *                  type: string
 *                  description: The phone number of the user
 *                  example: "+1234567890"
 *                image:
 *                  type: string
 *                  description: The image URL of the user (optional)
 *                  example: "https://example.com/user-image.jpg"
 *                profession:
 *                  type: string
 *                  description: The user's profession (optional)
 *                  example: "Software Engineer"
 *                password:
 *                  type: string
 *                  description: The password for the user
 *                  example: "SecurePassword123"
 *      responses:
 *        "200":
 *          description: User successfully registered
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  newUser:
 *                    type: object
 *                    description: The newly created user object.
 *                    properties:
 *                      first_name:
 *                        type: string
 *                        example: John
 *                      last_name:
 *                        type: string
 *                        example: Doe
 *                      email:
 *                        type: string
 *                        example: john.doe@example.com
 *                      phone:
 *                        type: string
 *                        example: "+1234567890"
 *                      image:
 *                        type: string
 *                        example: "https://example.com/user-image.jpg"
 *                      profession:
 *                        type: string
 *                        example: "Software Engineer"
 *                  message:
 *                    type: string
 *                    example: "User registered successfully"
 */
router.post("/sign-up", userController.register);


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations
 */

/**
 * @swagger
 *  /user/sign-in:
 *    post:
 *      summary: User login
 *      tags: [User]
 *      requestBody:
 *        description: User login details (email and password)
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  description: The email address of the user
 *                  example: john.doe@example.com
 *                password:
 *                  type: string
 *                  description: The password of the user
 *                  example: "SecurePassword123"
 *      responses:
 *        "200":
 *          description: User successfully logged in
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Login successful"
 *                  token:
 *                    type: string
 *                    description: The JWT token for the authenticated user
 *                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImV4cCI6MTY0ODI5NDE4OX0.SD9Bl2AflbYh9zjRTcmg4AxMsiK0dZ0a8EwbDZxtFvE"
 *                  user:
 *                    type: object
 *                    description: The user details
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      email:
 *                        type: string
 *                        example: john.doe@example.com
 *                      first_name:
 *                        type: string
 *                        example: John
 *                      last_name:
 *                        type: string
 *                        example: Doe
 *                      phone:
 *                        type: string
 *                        example: "+1234567890"
 *        "400":
 *          description: Bad request - Missing email or password
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Email and Password is required"
 *        "404":
 *          description: User not found - The provided email does not exist
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "User not found"
 *        "401":
 *          description: Unauthorized - Invalid password
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Invalid User"
 *        "500":
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.post("/sign-in", userController.login);
router.post("/forgot-password", userController.forgetPassword);
router.post("/verify-otp", userController.verifyOtp);
router.post("/reset-password", userController.resetPassword);
router.post("/google", userController.authenticateGoogleUser);

module.exports = router;