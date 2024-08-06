// source code from https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project
const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.


router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/waterfountain', async (req, res) => {
    const tableContent = await appService.fetchWaterFountainFromDB();
    handleQueryResult(tableContent, res);
});

router.get("/util-with-numReviews", async (req, res) => {
    const {minReviewNum} = req.query;
    const result = await appService.utilsWithMinNumOfReviews(minReviewNum);
    handleQueryResult(result, res);
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
    handleQueryResult(result, res);

});




router.get("/utils-at-building", async (req, res) => {
    const {buildingCode, wrClicked, mClicked, wfClicked} = req.query;
    const results = await appService.findUtilsAtBuilding(buildingCode,wrClicked,mClicked,wfClicked);
    handleQueryResult(results, res);

});

router.post("/log-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === undefined || password === undefined || password === '') {
            return res.status(400).json({ success: false, message: 'Missing userID or password' });
        }
        const result = await appService.logIn(email, password);

        handleQueryResult(result, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get("/fetch-cafe-detail", async (req, res) => {
    const {cafeID} = req.query;

    const result = await appService.fetchCafeDetails(cafeID);
    handleQueryResult(result, res);
});

router.get("/all-cafes", async (req, res) => {
    const result = await appService.fetchCafesListView()
    handleQueryResult(result, res);
});

router.get("/best-rated-building", async (req, res) => {
    const result = await appService.findBestRatedBuilding();
    handleQueryResult(result, res);
})


router.get("/reviews-for-util", async (req, res) => {
    const {utilityID} = req.query;
    const reviews = await appService.fetchReviewsForUtil(utilityID);
    handleQueryResult(reviews, res)
});

router.get("/reviews-for-user", async (req, res) => {
    const {userID} = req.query;
    const reviews = await appService.fetchReviewsForUser(userID);
    handleQueryResult(reviews, res)
});

router.get("/requests-for-user", async (req, res) => {
    const {userID} = req.query;
    const result = await appService.fetchRequestsForUser(userID);
    handleQueryResult(result, res);
});
router.get("/all-requests", async (req, res) => {

    const reviews = await appService.fetchAllRequests();
    handleQueryResult(reviews, res)
});

router.get("/requested-utilities", async (req, res) => {
    const { wrClicked, mClicked, wfClicked } = req.query;
    const tableContent = await appService.fetchRequestedUtils(wrClicked, mClicked, wfClicked );
    handleQueryResult(tableContent, res);
});

router.get("/requested-utilities-simple", async (req, res) => {
    const { wrClicked, mClicked, wfClicked } = req.query;
    const tableContent = await appService.fetchRequestedUtilsSimple(wrClicked, mClicked, wfClicked );
    handleQueryResult(tableContent, res);
});

router.get("/detailed-util-info", async (req, res) => {
    const { utilityID } = req.query;
    const result = await appService.detailedUtilInfo(utilityID);
    handleQueryResult(result, res);
});


router.get("/average-rating", async (req, res) => {
    const result = await appService.findAverageRating();
    res.json({data: result} );
});


router.post("/insert-waterfountain", async (req, res) => {
    const newUtilID = await appService.findMaxUtilityID('WATERFOUNTAIN');

    if (newUtilID === undefined || newUtilID === null) {
        return res.status(400).json({ success: false, message: "Failed to find suitable utilID" });
    }

    const { overallRating, buildingCode, imageURL,locationID, hasColdWater, hasHotWater } = req.body;
    const insertResult = await appService.insertFountain
    (newUtilID + 1, overallRating, buildingCode, imageURL,locationID, hasColdWater, hasHotWater);

    handleInsertResult(insertResult, res);
});

router.post("/insert-location", async (req, res) => {
    const newLocationID = await appService.findMaxLocationID();

    if (newLocationID === undefined || newLocationID === null) {
        return res.status(400).json({ success: false, message: "Failed to find suitable locationID" });
    }

    const { floor, locationDescription } = req.body;
    const insertResult = await appService.insertLocation()
    (newLocationID + 1, floor, locationDescription);

    handleInsertResult(insertResult, res);
});

router.post("/new-user", async(req, res) =>{
    const { username, email, password, isAdmin} = req.body;
    const currMaxUserID = await appService.findMaxUserID();
    let newUID;

    if (currMaxUserID === null || currMaxUserID === undefined) {
        res.status(400).json({ status: false, message: "failed to find suitable UID" });
    } else {
        newUID = currMaxUserID + 1;
    }
    const insertResult = await appService.newUser(newUID, username, email, password, isAdmin);

    handleInsertResult(insertResult, res)

});

function handleInsertResult(insertResult, res) {
    if (insertResult.status === 'success') {
        res.status(200).json({success: true, message: insertResult.message});
    } else if (insertResult.status === 'failure') {
        res.status(400).json({success: false, message: insertResult.message});
    } else {
        res.status(500).json({success: false, message: insertResult.message});
    }
}

function handleQueryResult(queryResult, res) {
    if (queryResult.status === 'success') {
        res.status(200).json({success: true, data: queryResult.data, message: queryResult.message});
    } else if (queryResult.status === 'failure') {
        res.status(400).json({success: false, message: queryResult.message});
    } else {
        res.status(500).json({success: false, message: queryResult.message});
    }

}


router.post("/insert-cafe", async (req, res) => {

    const { name, operatingHours, buildingCode, locationID } = req.body;
    const currMaxCafeID = await appService.findMaxCafeID();

    if (currMaxCafeID === undefined || currMaxCafeID === null) {
        return res.status(400).json({ status: false, message: "Failed to find suitable UID" });
    }

    const insertResult = await appService.insertCafe(currMaxCafeID + 1, name, operatingHours, buildingCode, locationID);
    handleInsertResult(insertResult, res);

});
router.post("/insert-washroom", async (req, res) => {
    const newUtilID = await appService.findMaxUtilityID('WASHROOM');

    if (newUtilID === undefined || newUtilID === null) {
        return res.status(400).json({ success: false, message: "Failed to find suitable utilID" });
    }

    const { overallRating, buildingCode, imageURL,locationID, gender, numStalls, accessibilityFeatures } = req.body;
    const insertResult = await appService.insertWashroom
    (newUtilID + 1, overallRating, buildingCode, imageURL,locationID, gender, numStalls, accessibilityFeatures);

    handleInsertResult(insertResult, res);

});

router.get("/get-max-locationID", async (req, res) => {
   const result = await appService.findMaxLocationID();
   handleQueryResult(result, res);
});

router.get("/all-drinks", async (req, res) => {
   const result = await appService.fetchAllDrinkNames();
   handleQueryResult(result, res)
});

router.post("/insert-microwave", async (req, res) => {
    const newUtilID = await appService.findMaxUtilityID('MICROWAVE');

    if (newUtilID === undefined || newUtilID === null) {
        return res.status(400).json({ success: false, message: "Failed to find suitable utilID" });
    }

    const {  overallRating, buildingCode, imageURL,locationID, microwaveSize } = req.body;
    const insertResult = await appService.insertMicrowave
    (newUtilID + 1, overallRating, buildingCode, imageURL,locationID, microwaveSize);

    handleInsertResult(insertResult, res);

});

router.post("/insert-review", async (req, res) => {
    const {  utilityID, userID, cleanliness, functionality, accessibility, description } = req.body;

    const curr = await appService.findMaxReviewID(utilityID);
    const currMaxReviewID = curr.data;

    if (currMaxReviewID === undefined || currMaxReviewID === null) {
        return res.status(400).json({ success: false, message: "Failed to find suitable reviewID" });
    }

    console.log("currmaxreviewid:" + currMaxReviewID);

    const insertResult
        = await appService.insertReview(currMaxReviewID + 1, utilityID, userID, cleanliness, functionality, accessibility, description);

    handleInsertResult(insertResult, res);
});



router.post("/insert-request", async (req, res) => {
    const { requestDate, status, requestDescription, requestType, amenityType,
        buildingName, userID,imageURL } = req.body;
    const currMaxRequestID = await appService.findMaxRequestID();

    if (currMaxRequestID === undefined || currMaxRequestID === null) {
        return res.status(400).json({ status: false, message: "Failed to find suitable UID" });
    }

    const insertResult = await appService.insertRequest(currMaxRequestID + 1, requestDate, status, requestDescription, requestType, amenityType,
        buildingName, userID,imageURL);
    handleInsertResult(insertResult, res);
});



router.delete("/delete-review/:reviewID/:utilityID", async (req, res) => {
    const { reviewID, utilityID } = req.params;
    const deleteResult = await appService.deleteReviews(reviewID, utilityID);
    console.log(reviewID, utilityID);
    if (deleteResult.status === 'success') {
                res.status(200).json({ success: true, message: deleteResult.message });
            } else if (deleteResult.status === 'failure') {
                res.status(404).json({ success: false, message: deleteResult.message });
            } else {
                res.status(500).json({ success: false, message: deleteResult.message });
            }
        });



router.delete("/delete-account/:userID", async (req, res) => {
    const { userID } = req.params;
    const deleteResult = await appService.deleteAccount(userID);
        if (deleteResult.status === 'success') {
            res.status(200).json({ success: true, message: deleteResult.message });
        } else if (deleteResult.status === 'failure') {
            res.status(404).json({ success: false, message: deleteResult.message });
        } else {
            res.status(500).json({ success: false, message: deleteResult.message });
        }
    });


router.get("/cafe-at-building", async(req, res) => {
    const {buildingCode} = req.query;

    const result = await appService.findCafesAtBuilding(buildingCode);
    handleQueryResult(result, res);
});

router.delete("/delete-request/:requestID", async (req, res) => {
    const { requestID } = req.params;
    const deleteResult = await appService.deleteRequest(requestID);
     if (deleteResult.status === 'success') {
                res.status(200).json({ success: true, message: deleteResult.message });
            } else if (deleteResult.status === 'failure') {
                res.status(404).json({ success: false, message: deleteResult.message });
            } else {
                res.status(500).json({ success: false, message: deleteResult.message });
            }
});



router.post("/update-username", async (req, res) => {
    const { userID, newName } = req.body;
    const updateResult = await appService.updateUsername(userID, newName);

     if (updateResult.status === 'success') {
            res.status(200).json({ success: true, message: updateResult.message });
        } else if (updateResult.status === 'failure') {
            res.status(404).json({ success: false, message: updateResult.message });
        } else {
            res.status(400).json({ success: false, message: updateResult.message });
        }
    });


router.post('/update-email', async (req, res) => {
    const { userID, newEmail } = req.body;
    try {
        const updateResult = await appService.updateEmail(userID, newEmail);
        if (updateResult.status === 'success') {
            res.status(200).json({ success: true, message: updateResult.message });
        } else if (updateResult.status === 'failure') {
            res.status(404).json({ success: false, message: updateResult.message });
        } else {
            res.status(400).json({ success: false, message: updateResult.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.post("/update-password", async (req, res) => {
    const { userID, newPassword } = req.body;
    const updateResult = await appService.updatePassword(userID, newPassword);

     if (updateResult.status === 'success') {
                res.status(200).json({ success: true, message: updateResult.message });
            } else if (updateResult.status === 'failure') {
                res.status(404).json({ success: false, message: updateResult.message });
            } else {
                res.status(400).json({ success: false, message: updateResult.message });
            }
});





module.exports = router;