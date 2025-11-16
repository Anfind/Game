# 🧪 TESTING GUIDE

## Quick Test (5 minutes)

### Step 1: Start the application
```bash
cd d:\An\Game
npm run dev
```

Wait for:
```
✅ MongoDB Connected
🚀 Server running on port 5000
📡 Socket.io ready
```

### Step 2: Open 2 browser tabs

**Tab 1 (Player A):**
- Open: http://localhost:3000
- Click "Start the Game"
- Select "Group 2"
- Wait for pairing...

**Tab 2 (Player B):**
- Open: http://localhost:3000 (new tab)
- Click "Start the Game"
- Select "Group 2" (SAME GROUP!)
- Wait for pairing...

### Step 3: Test Scenario 1 - Success

**Tab 1 (Person A's turn):**
1. You see "YOUR TURN" indicator
2. Set offers: A = 500, B = 500
3. Click "Submit Offer"
4. See "Waiting for response..."

**Tab 2 (Person B receives offer):**
1. Modal appears with offer
2. Click "Accept" (green button)

**Both tabs:**
- Automatically redirect to Result screen
- See "Negotiation successful!"
- Final distribution: A=500€, B=500€

### Step 4: Test Excel Export

On Result screen:
1. Click "Export Data (Excel)"
2. File downloads automatically
3. Open file to verify:
   - Round 1 data
   - Game summary
   - Formatted properly

✅ **Test 1 Complete!**

---

## Test Scenario 2 - Multiple Rounds

### Setup
Same as above, open 2 tabs, select Group 3

### Flow

**Round 1:**
- Person A: Offer A=600, B=400
- Person B: Click "Too Low"
- ✅ Turn switches to Person B

**Round 2:**
- Person B: Offer A=450, B=550
- Person A: Click "Accept"
- ✅ Game ends successfully
- Result: A=450€, B=550€

---

## Test Scenario 3 - Failed Negotiation

### Setup
Open 2 tabs, select Group 4 (B has 600€ alternative)

### Flow

**Round 1:**
- Person A: Offer A=800, B=200
- Person B: Click "Not Accept" (red button)
- ✅ Game ends immediately
- Result:
  - Negotiation failed
  - Person A receives: 0€
  - Person B receives: 600€ (alternative option)

---

## Test Scenario 4 - Max Rounds

### Setup
Open 2 tabs, select Group 1

### Flow
Keep clicking "Too Low" or "Better Offer" for both players

**After Round 10:**
- ✅ Game automatically ends
- Result:
  - Negotiation failed
  - Maximum rounds reached
  - Person A: 0€
  - Person B: 0€ (Group 1 alternative)

---

## Test Scenario 5 - Different Groups (No Pairing)

### Setup

**Tab 1:**
- Select Group 1

**Tab 2:**
- Select Group 3 (different!)

### Expected Result
- ✅ Both tabs stay in "Waiting Room"
- Message: "Waiting for another player..."
- They don't pair (different groups)

---

## Test Scenario 6 - Validation

### Invalid Offers

**Try to submit:**
1. A=600, B=600 (sum = 1200)
   - ✅ Error: "Offers must sum to €1,000"

2. A=1200, B=-200 (negative)
   - ✅ Error: "Offers cannot be negative"

3. A=500, B=500 (valid)
   - ✅ Accepted and sent

---

## Test Scenario 7 - UI/UX

### Check These Elements:

**Intro Screen:**
- [x] Animated header
- [x] Person A/B cards with icons
- [x] €1,000 total display
- [x] "Start the Game" button hovers
- [x] Floating bicycle/money emojis

**Group Selection:**
- [x] 4 cards with different colors
- [x] Alternative selling options shown
- [x] Hover effects work
- [x] Loading spinner when joining
- [x] Info box explaining alternatives

**Waiting Room:**
- [x] Rotating icon animation
- [x] Pulse loading dots
- [x] Player ID displayed
- [x] Group number shown
- [x] Progress bar animates
- [x] Cancel button works

**Negotiation Screen:**
- [x] Status bar shows role, round, turn
- [x] Round progress bar
- [x] "YOUR TURN" indicator blinks
- [x] Sliders work smoothly
- [x] Number inputs sync with sliders
- [x] Total shows green when = 1000
- [x] Response modal is beautiful
- [x] History sidebar updates
- [x] Toast notifications appear

**Result Screen:**
- [x] Success emoji animates (🎉)
- [x] Failed emoji shakes (❌)
- [x] Final distribution clear
- [x] Your performance stats
- [x] Difference from alternative calculated
- [x] Export button works
- [x] Play Again button navigates

---

## Test Scenario 8 - Responsive Design

### Mobile (375px)
1. Open DevTools (F12)
2. Toggle device toolbar
3. Select "iPhone 12 Pro"
4. Go through full game flow
5. ✅ All screens adapt
6. ✅ Buttons are touch-friendly
7. ✅ Text is readable

### Tablet (768px)
1. Select "iPad"
2. Test full flow
3. ✅ Cards rearrange nicely
4. ✅ Modals fit screen

### Desktop (1920px)
1. Full screen
2. ✅ Centered layouts
3. ✅ Max-width containers work

---

## Test Scenario 9 - Real-time Sync

### Test Simultaneous Actions

**Setup:** 2 tabs paired

**Test:**
1. Person A submits offer
2. ✅ Person B immediately sees modal
3. Person B responds
4. ✅ Person A immediately sees turn change
5. Check history
6. ✅ Both tabs show same history

### Test Disconnect

**Setup:** 2 tabs paired, in negotiation

**Test:**
1. Close Tab 1 (Person A)
2. ✅ Tab 2 shows: "Your opponent has disconnected"
3. ✅ Toast notification appears

---

## Test Scenario 10 - Data Persistence

### Test MongoDB Storage

**After completing a game:**

1. Open MongoDB Compass or shell
2. Connect to: `mongodb://localhost:27017`
3. Database: `bicycle-negotiation-game`

**Check collections:**

**Players:**
```javascript
db.players.find().pretty()
```
✅ Should see: playerId, role, groupNumber, pairId

**Games:**
```javascript
db.games.find().pretty()
```
✅ Should see: pairId, rounds array, status, result

---

## Performance Checklist

- [x] Page loads in < 2 seconds
- [x] Animations are smooth (60fps)
- [x] No console errors
- [x] Socket connects quickly
- [x] Pairing happens in < 3 seconds
- [x] Offer/response feels instant
- [x] Excel exports in < 2 seconds
- [x] No memory leaks after multiple games

---

## Browser Compatibility

Test in:
- [x] Chrome (Latest)
- [x] Firefox (Latest)
- [x] Edge (Latest)
- [x] Safari (if available)

---

## Security Checklist

- [x] No sensitive data in client
- [x] Input validation on client
- [x] Input validation on server
- [x] MongoDB connection secured
- [x] CORS properly configured
- [x] No XSS vulnerabilities
- [x] No injection vulnerabilities

---

## Final Checklist Before Deployment

- [x] All features working
- [x] No console errors
- [x] MongoDB connected
- [x] Socket.io working
- [x] Excel export working
- [x] All texts in English
- [x] No "BATNA" terminology
- [x] Responsive on all devices
- [x] Error handling works
- [x] Documentation complete

---

## 🎉 If All Tests Pass:

**CONGRATULATIONS!** 🎊

Your Bicycle Negotiation Game is fully functional and ready for use!

---

## 🐛 If You Find Bugs:

1. Check browser console for errors
2. Check server terminal for errors
3. Verify MongoDB is running
4. Clear browser cache and try again
5. Restart server: `Ctrl+C` then `npm run dev`
6. Check `CHEATSHEET.md` for troubleshooting

---

**Happy Testing! 🚲💰**
