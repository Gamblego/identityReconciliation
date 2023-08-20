import { Router } from "express";
import { Paths } from '../helper/path'
import { getTable, identifyContact } from "../service/identify-service";

const router = Router();

/**
 * @swagger
 * /api/test:
 *  get:
 *    tags:
 *      - Get all contacts
 *    description: Get all contacts from database
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: successfully created the given account and the account id is returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ContactType'
 *      400:
 *        description: one or more fields were missing or invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.get(Paths.Test.Base, async function (req, res, next) {
  try {
    const result = await getTable();
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /api/identify:
 *  post:
 *    description: Get all contacts from database
 *    parameters:
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: "#/components/schemas/APIRequest"
 *    responses:
 *      200:
 *        description: successfully created the given account and the account id is returned
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/APIResponse'
 *      400:
 *        description: one or more fields were missing or invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */
router.post(Paths.Identify.Base, async function (req, res, next) {
  try {
    const result = await identifyContact(req.body);
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get(Paths.Docs.Base, async function (req, res, next) {
  try {
    res.status(200).json({});
  } catch (err) {
    next(err)
  }
})

export const IndexRouter = router; 
