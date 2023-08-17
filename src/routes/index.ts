import { Router } from "express";
import { Paths } from '../helper/path'
import { identifyContact } from "../service/identify-service";

const router = Router();

/* GET home page. */
router.get(Paths.Test.Base, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post(Paths.Identify.Base, async function (req, res, next) {
  try {
    const result = await identifyContact(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export const IndexRouter = router; 
