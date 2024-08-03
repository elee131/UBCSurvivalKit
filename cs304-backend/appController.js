const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

//router.get('/', function (req, res) {
//  console.log("in get slash")
//  res.send("HII");
//});

router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/waterfountain', async (req, res) => {
    const tableContent = await appService.fetchWaterFountainFromDB();
    res.json({data: tableContent});
});


router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get("/requested-utilities", async (req, res) => {
    const { wrClicked, mClicked, wfClicked } = req.query;
    const tableContent = await appService.fetchRequestedUtils(wrClicked, mClicked, wfClicked );
    res.json({data: tableContent});
});

router.get("/requested-utilities-simple", async (req, res) => {
    const { wrClicked, mClicked, wfClicked } = req.query;
    const tableContent = await appService.fetchRequestedUtilsSimple(wrClicked, mClicked, wfClicked );
    res.json({data: tableContent});
});

router.post("/insert-waterfountain", async (req, res) => {
    const { utilityID, overallRating, buildingCode, imageURL,locationID, hasColdWater, hasHotWater } = req.body;
    const insertResult = await appService.insertFountain
        (utilityID, overallRating, buildingCode, imageURL,locationID, hasColdWater, hasHotWater);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-washroom", async (req, res) => {
    const { utilityID, overallRating, buildingCode, imageURL,locationID, gender, numStalls, accessibilityFeatures } = req.body;
    const insertResult = await appService.insertWashroom
        (utilityID, overallRating, buildingCode, imageURL,locationID, gender, numStalls, accessibilityFeatures);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/insert-microwave", async (req, res) => {
    const { utilityID, overallRating, buildingCode, imageURL,locationID, microwaveSize } = req.body;
    const insertResult = await appService.insertMicrowave
        (utilityID, overallRating, buildingCode, imageURL,locationID, microwaveSize);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;