const router = require("express").Router();
const masterAttributeController = require("../../controllers/api/master.controller");



/**
 * @swagger
 * tags:
 *   name: Master Attribute
 *   description: Master Attribute
 */

/**
 * @swagger
 *  /master/master-attribute-list:
 *    get:
 *      summary: Master attribute list
 *      tags: [Master Attribute]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.get("/master-attribute-list", masterAttributeController.masterAttributeList);


module.exports = router;