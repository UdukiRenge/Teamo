import express from 'express';
import {
  createInquirie,
} from '../services/inquirieService.js';

const inquirieRoutes = express.Router();

// **問い合わせ登録**
inquirieRoutes.post('/', async (request, response, next) => {
  try {
    await createInquirie(request.body);
    response.status(201).json({success: true});
  } catch (error) {
    next(error);
  }
});

export default inquirieRoutes;