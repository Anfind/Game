import express from 'express';
import { joinGame, getGameState, submitOffer, submitResponse } from '../controllers/gameController.js';
import { exportGameData } from '../controllers/exportController.js';

const router = express.Router();

router.post('/join', joinGame);
router.get('/state/:pairId', getGameState);
router.post('/offer', submitOffer);
router.post('/response', submitResponse);
router.get('/export/:pairId', exportGameData);

export default router;
