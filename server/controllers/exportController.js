import ExcelJS from 'exceljs';
import Game from '../models/Game.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportGameData = async (req, res) => {
  try {
    const { pairId } = req.params;
    
    const game = await Game.findOne({ pairId });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Negotiation Data');

    // Add headers
    worksheet.columns = [
      { header: 'Pair ID', key: 'pairId', width: 15 },
      { header: 'Group', key: 'group', width: 10 },
      { header: 'Round', key: 'round', width: 10 },
      { header: 'Proposer', key: 'proposer', width: 12 },
      { header: 'Offer A (€)', key: 'offerA', width: 15 },
      { header: 'Offer B (€)', key: 'offerB', width: 15 },
      { header: 'Response', key: 'response', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0EA5E9' }
    };

    // Add data rows
    game.rounds.forEach((round) => {
      worksheet.addRow({
        pairId: game.pairId,
        group: game.groupNumber,
        round: round.roundNumber,
        proposer: `Person ${round.proposer}`,
        offerA: round.offerA,
        offerB: round.offerB,
        response: formatResponse(round.response),
        timestamp: round.timestamp.toLocaleString()
      });
    });

    // Add summary section
    worksheet.addRow([]);
    worksheet.addRow(['GAME SUMMARY']);
    worksheet.addRow(['Status:', game.status]);
    worksheet.addRow(['Player A ID:', game.playerA.playerId]);
    worksheet.addRow(['Player B ID:', game.playerB.playerId]);
    worksheet.addRow(['Player A BATNA:', `€${game.playerA.batna}`]);
    worksheet.addRow(['Player B BATNA:', `€${game.playerB.batna}`]);
    
    if (game.result) {
      worksheet.addRow(['Result:', game.result.type]);
      worksheet.addRow(['Final Payout A:', game.result.payoutA ? `€${game.result.payoutA}` : 'N/A']);
      worksheet.addRow(['Final Payout B:', game.result.payoutB ? `€${game.result.payoutB}` : 'N/A']);
      worksheet.addRow(['Reason:', game.result.reason]);
    }

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    // Save file
    const fileName = `negotiation_${pairId}_${Date.now()}.xlsx`;
    const filePath = path.join(exportsDir, fileName);
    
    await workbook.xlsx.writeFile(filePath);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: error.message });
  }
};

function formatResponse(response) {
  const responseMap = {
    'too_low': 'Too low - counteroffer',
    'accept': 'Accept - offer accepted',
    'better_offer': 'Better offer outside',
    'not_accept': 'Not accept - terminated'
  };
  return responseMap[response] || response;
}
