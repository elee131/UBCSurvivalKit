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

router.get("/util-with-numReviews", async (req, res) => {
   const {minReviewNum} = req.query;
   const result = await appService.utilsWithMinNumOfReviews(minReviewNum);
   res.json({data: result});
});

router.get("/find-cafes-with-drink", async (req,res) => {
    let selectedDrinks = req.query.selectedDrinks;

    if (!selectedDrinks) {
        res.status(400).json({message: "must choose drinks"});
    }
    if (typeof selectedDrinks === 'string') {
        selectedDrinks = selectedDrinks.split(',');
    }

    const result = await appService.findCafesWithDrinks(selectedDrinks);
    res.json({data: result});

});

router.get("/utils-at-building", async (req, res) => {
   const {buildingCode, wrClicked, mClicked, wfClicked} = req.query;
   const results = await appService.findUtilsAtBuilding(buildingCode,wrClicked,mClicked,wfClicked);
   res.json({data: results});

});

router.post("/logIn", async (req, res) => {
    try {
        const { userID, password } = req.body;

        if (userID === undefined || password === undefined || password === '') {
            return res.status(400).json({ success: false, message: 'Missing userID or password' });
        }
        const result = await appService.logIn(userID, password);

        if (result) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.get("/reviews", async (req, res) => {
   const {utilityID} = req.query;
   const reviews = await appService.fetchReviewsForUtil(utilityID);
   res.json({data: reviews});
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

router.get("/detailed-util-info", async (req, res) => {
    const { utilityID } = req.query;
    const result = await appService.detailedUtilInfo(utilityID);
    res.json({data: result} );
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

router.post("/newUser", async(req, res) =>{
   const {userID, username, email, password} = req.body;
   const insertResult = await appService.newUser(userID, username, email, password);
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

router.post("/insert-review", async (req, res) => {
    const { reviewID, utilityID, userID, cleanliness, functionality, accessibility, description } = req.body;
    const insertResult
        = await appService.insertReview(reviewID, utilityID, userID, cleanliness, functionality, accessibility, description);

    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-request", async (req, res) => {
    const { requestID, requestDate, status, requestDescription, requestType, amenityType,
        buildingName, userID,imageURL } = req.body;
// handle date
    const insertResult = await appService.insertRequest(requestID, requestDate, status, requestDescription, requestType, amenityType,
        buildingName, userID,imageURL);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})



router.delete("/delete-review/:reviewID/:utilityID", async (req, res) => {
    const { reviewID, utilityID } = req.params;
    const deleteResult = await appService.deleteReviews(reviewID, utilityID);
    if (deleteResult) {
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