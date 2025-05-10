const router = require("express").Router();
const masterController = require("../../controllers/admin/master.controller");
const validate = require("../../middlewares/validate");
const { addValueSchema } = require("../../validations/setting.validation");

/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Master data operations
 */

/**
 * @swagger
 * /masters/get-modules:
 *   get:
 *     summary: Get all available modules
 *     tags: [Masters]
 *     responses:
 *       "200":
 *         description: A list of available modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the module
 *                     example: 1
 *                   module_name:
 *                     type: string
 *                     description: The name of the module
 *                     example: "User Management"
 *                   module_description:
 *                     type: string
 *                     description: A brief description of the module
 *                     example: "Module responsible for handling user registrations, logins, and profiles."
 *                   status:
 *                     type: string
 *                     description: The status of the module (active/inactive)
 *                     example: "active"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/masters/get-modules", masterController.fetchModules);

/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Master data operations
 */

/**
 * @swagger
 * /masters/get-module-items-by-slug:
 *   get:
 *     summary: Get module items by the slug of the module
 *     tags: [Masters]
 *     parameters:
 *       - in: query
 *         name: slug
 *         required: true
 *         description: The slug of the module whose items need to be fetched
 *         schema:
 *           type: string
 *           example: "tech-module"
 *     responses:
 *       "200":
 *         description: A list of items for the specified module
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the item
 *                     example: 1
 *                   item_name:
 *                     type: string
 *                     description: The name of the module item
 *                     example: "Item 1"
 *                   item_description:
 *                     type: string
 *                     description: A description of the module item
 *                     example: "This is a description for item 1"
 *                   status:
 *                     type: string
 *                     description: The status of the item (active/inactive)
 *                     example: "active"
 *       "400":
 *         description: Bad request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid slug provided"
 *       "404":
 *         description: Module not found by slug
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Module not found"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
  "/masters/get-module-items-by-slug",
  masterController.getModuleItemsByModuleSlug
);


/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Master data operations
 */

/**
 * @swagger
 * /masters/create-module:
 *   post:
 *     summary: Create a new module
 *     tags: [Masters]
 *     requestBody:
 *       description: The details of the module to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_name
 *               - slug
 *               - description
 *             properties:
 *               module_name:
 *                 type: string
 *                 description: The name of the module
 *                 example: "Tech Module"
 *               slug:
 *                 type: string
 *                 description: The unique slug for the module
 *                 example: "tech-module"
 *               description:
 *                 type: string
 *                 description: A brief description of the module
 *                 example: "This module provides tech-related content."
 *               status:
 *                 type: string
 *                 description: The status of the module (active or inactive)
 *                 example: "active"
 *               created_by:
 *                 type: integer
 *                 description: The ID of the user who created the module
 *                 example: 1
 *     responses:
 *       "201":
 *         description: Module successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created module
 *                   example: 1
 *                 module_name:
 *                   type: string
 *                   description: The name of the module
 *                   example: "Tech Module"
 *                 slug:
 *                   type: string
 *                   description: The unique slug for the module
 *                   example: "tech-module"
 *                 description:
 *                   type: string
 *                   description: The description of the module
 *                   example: "This module provides tech-related content."
 *                 status:
 *                   type: string
 *                   description: The status of the module (active or inactive)
 *                   example: "active"
 *                 created_by:
 *                   type: integer
 *                   description: The ID of the user who created the module
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the module was created
 *                   example: "2024-12-17T15:30:00Z"
 *       "400":
 *         description: Bad request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Module name and slug are required"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/masters/create-module", masterController.createModule);



/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Master data operations
 */

/**
 * @swagger
 * /masters/add-values:
 *   post:
 *     summary: Add new values to the master data
 *     tags: [Masters]
 *     requestBody:
 *       description: The values to be added to the master data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the value being added
 *                 example: "Color"
 *               value:
 *                 type: string
 *                 description: The value to be added to the master data
 *                 example: "Red"
 *               type:
 *                 type: string
 *                 description: The type/category of the value (e.g., category, attribute, etc.)
 *                 example: "Attribute"
 *               description:
 *                 type: string
 *                 description: An optional description for the value being added
 *                 example: "Represents the color Red."
 *               status:
 *                 type: string
 *                 description: The status of the value (active or inactive)
 *                 example: "active"
 *     responses:
 *       "201":
 *         description: Value successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly added value
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The name of the value added
 *                   example: "Color"
 *                 value:
 *                   type: string
 *                   description: The value added
 *                   example: "Red"
 *                 type:
 *                   type: string
 *                   description: The type/category of the value
 *                   example: "Attribute"
 *                 description:
 *                   type: string
 *                   description: The description of the value
 *                   example: "Represents the color Red."
 *                 status:
 *                   type: string
 *                   description: The status of the value
 *                   example: "active"
 *       "400":
 *         description: Bad request - Missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All required fields must be provided"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/masters/add-values", validate(addValueSchema), masterController.addValues);

// router.patch("/masters/update-values", validate(addValueSchema), masterController.updateValues);

// router.patch(
//   "/masters/update-master-name",
//   masterController.updateMasterName
// );

// router.delete("/masters/delete", masterController.deleteMaster);


/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Master data operations
 */

/**
 * @swagger
 * /masters/delete-master-value:
 *   delete:
 *     summary: Delete a master module value
 *     tags: [Masters]
 *     parameters:
 *       - in: query
 *         name: value_id
 *         required: true
 *         description: The unique ID of the master module value to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       "200":
 *         description: Master module value successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Master module value deleted successfully"
 *       "400":
 *         description: Bad request - Missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "value_id is required"
 *       "404":
 *         description: Master module value not found by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Master module value not found"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.delete(
  "/masters/delete-master-value",
  masterController.deleteMasterModuleValue
);

router.patch(
  "/masters/update-values",
  masterController.updateValues
);

router.patch(
  "/masters",
  masterController.updateModuleName
);

router.delete(
  "/masters",
  masterController.deleteModule
);

module.exports = router;
