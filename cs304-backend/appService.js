// source code from: https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project
const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};
//

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchWaterFountainFromDB() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM WATERFOUNTAIN');
        return result.rows;
    }).catch(() => {
        return [];
    });

}

async function fetchRequestedUtils(wrClicked, mClicked, wfClicked) {
    return await withOracleDB(async (connection) => {
        let results = [];

        if (wrClicked) {
            const result = await connection.execute(
                `SELECT utilityID, overallRating, buildingCode, imageURL, operatingHour
                 FROM WASHROOM NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        if (mClicked) {
            const result = await connection.execute(
                `SELECT utilityID, overallRating, buildingCode, imageURL, operatingHour
                FROM MICROWAVE NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        if (wfClicked) {
            const result = await connection.execute(
                `SELECT utilityID, overallRating, buildingCode, imageURL, operatingHour
               FROM WATERFOUNTAIN NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        return results;

    }).catch((error) => {
        console.error("Database query failed: ", error);
        return [];
    });
}

async function fetchRequestedUtilsSimple(wrClicked, mClicked, wfClicked) {
    return await withOracleDB(async (connection) => {
        let results = [];

        if (wrClicked) {
            const result = await connection.execute(
                `SELECT utilityID, buildingCode, operatingHour
                 FROM WASHROOM NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        if (mClicked) {
            const result = await connection.execute(
                `SELECT utilityID, buildingCode, operatingHour
                FROM WASHROOM NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        if (wfClicked) {
            const result = await connection.execute(
                `SELECT utilityID, buildingCode, operatingHour
               FROM WASHROOM NATURAL JOIN UTILITY NATURAL JOIN HOURS`
            );
            results = results.concat(result.rows);
        }

        return results;

    }).catch((error) => {
        console.error("Database query failed: ", error);
        return [];
    });
}

async function detailedUtilInfo(utilityID) {
    return await withOracleDB(async (connection) => {
        let query;
        let table;

        if (10000000 <= utilityID && utilityID < 20000000) {
            table = `WASHROOM`
        } else if (20000000 <= utilityID  && utilityID < 30000000) {
            table = `MICROWAVE`
        } else if (30000000 <= utilityID ) {
            table = `WATERFOUNTAIN`
        } else {
            throw new Error("Invalid utilityID");
        }

        query = `SELECT *
            FROM UTILITY NATURAL JOIN ` + table +
            ` NATURAL JOIN HOURS NATURAL JOIN RATING
            WHERE utilityID = :utilityID `;

        const result = await connection.execute(query, [utilityID]);
        return result.rows;
    });
}

async function fetchReviewsForUtil(utilityID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM REVIEW r
            WHERE r.utilityID = :utilityID`,
            [utilityID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCafesListView() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT name, operatingHours, buildingCode
            FROM CAFE c`
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchCafeDetails(cafeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT *
            FROM CAFE c
            WHERE cafeID = :cafeID`,
            [cafeID]
        );
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertUtility(utilityID, overallRating, buildingCode, imageURL, locationID) {
    return await withOracleDB(async (connection) => {
        const utilResult = await connection.execute(
            `INSERT INTO UTILITY (utilityID, overallRating, buildingCode, imageURL, locationID)
             VALUES (:utilityID, :overallRating, :buildingCode, :imageURL, :locationID)`,
            [utilityID, overallRating, buildingCode, imageURL, locationID],
            { autoCommit: true }
        );

        return utilResult.rowsAffected && utilResult.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertFountain(utilityID, overallRating, buildingCode, imageURL, locationID, hasColdWater, hasHotWater) {
    return await withOracleDB(async (connection) => {
        const utilResult = await insertUtility(utilityID, overallRating, buildingCode, imageURL, locationID);

        if (!utilResult) {
            throw new Error('Failed to insert into UTILITY table');
        }

        const waterResult = await connection.execute(
            `INSERT INTO WATERFOUNTAIN (utilityID, hasColdWater, hasHotWater)
             VALUES (:utilityID, :hasColdWater, :hasHotWater)`,
            [utilityID, hasColdWater, hasHotWater],
            { autoCommit: true }
        );

        if (waterResult.rowsAffected === 0) {
            throw new Error('Failed to insert into WATERFOUNTAIN table');
        }

        return true;

    }).catch(() => {
        return false;
    });
}

async function findUtilsAtBuilding(buildingCode, wrClicked, mClicked, wfClicked) {
    return await withOracleDB(async (connection) => {
        let query = `SELECT UTILITY.utilityID, overallRating, UTILITY.buildingCode, imageURL, HOURS.operatingHour
                     FROM UTILITY
                              LEFT JOIN HOURS ON UTILITY.buildingCode = HOURS.buildingCode`;

        if (wrClicked) {
            query += ` LEFT JOIN WASHROOM ON UTILITY.utilityID = WASHROOM.utilityID`;
        }

        if (mClicked) {
            query += ` LEFT JOIN MICROWAVE ON UTILITY.utilityID = MICROWAVE.utilityID`;
        }

        if (wfClicked) {
            query += ` LEFT JOIN WATERFOUNTAIN ON UTILITY.utilityID = WATERFOUNTAIN.utilityID`;
        }

        query += ` WHERE UTILITY.buildingCode = :buildingCode`;

        try {
            const result = await connection.execute(query, [buildingCode]);
            return result.rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    }).catch( () => {
        return false;
    })
}

async function findCafesAtBuilding(buildingCode) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT name, operatingHours, buildingCode
            FROM CAFE c
            WHERE buildingCode = :buildingCode`,
            [buildingCode]
        );

        console.log(result);

        return result.rows;
    }).catch(() => {
        return false;
    })
}

async function utilsWithMinNumOfReviews(minReviewNum) {
    console.log("Minimum review number:", minReviewNum);

    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT r.utilityID, COUNT(*) AS Reviews
                 FROM Review r
                 GROUP BY r.utilityID
                 HAVING COUNT(*) >= :minReviewNum`,
                [minReviewNum]
            );

            console.log("Query result:", result);
            return result.rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    });
}

async function newUser(userID, username, email, password, isAdmin) {
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `INSERT INTO USERINFO (userID, username, email, password, isAdmin)
            VALUES (:userID, :username, :email, :password, :isAdmin)`,
            [userID, username, email, password, isAdmin],

            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return {status: 'failure', message:'Failed to create user with given information.'};
        }
        return {status: 'success', message: 'New user account created successfully.'};

    }).catch(() => {
        return {status: 'false', message: 'Had error while inserting user:', error };
    });
}

async function logIn(userID, password) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT * 
            FROM USERINFO
            WHERE userID = :userID AND password = :password`,
            [userID, password]
        );

        console.log(result);

        if (result.rows.length === 0) {
            console.log("userID or password is wrong")
            return false;
        }

        return true;

    });
}




async function insertMicrowave(utilityID, overallRating, buildingCode, imageURL, locationID, microwaveSize) {
    return await withOracleDB(async (connection) => {

        const utilResult = await insertUtility(utilityID, overallRating, buildingCode, imageURL, locationID);

        if (!utilResult) {
            throw new Error('Failed to insert into UTILITY table');
        }

        const microwaveResult = await connection.execute(
            `INSERT INTO MICROWAVE (utilityID, microwaveSize)
            VALUES (:utilityID, :microwaveSize)`,
            [utilityID, microwaveSize],

            { autoCommit: true }
        );

        if (microwaveResult.rowsAffected === 0) {
            throw new Error('Failed to insert into MICROWAVE table');
        }

        return true;

    }).catch(() => {
        return false;
    });
}

async function findMaxUtilityID(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(utilityID) as maxID
            FROM ${tableName}`
        );
        return result.rows[0][0];
    }).catch((error) => {
        console.error(error);
        throw new Error("Failed to find max utilityID");
    });
}

async function findMaxCafeID() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(cafeID) as maxID
            FROM CAFE`
        );
        return result.rows[0][0];
    }).catch((error) => {
        console.error(error);
        throw new Error("Failed to find max cafeID");
    });
}

async function findMaxUserID() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT MAX(userID) as maxID
            FROM USERINFO`
        );
        console.log(result);
        const maxID = result.rows[0][0];
        return maxID;
    }).catch((error) => {
        console.error(error);
        throw new Error("Failed to find max cafeID");
    });
}

async function insertCafe(cafeID, name, operatingHours, buildingCode, locationID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
          `INSERT INTO CAFE
           VALUES (:cafeID, :name, :operatingHours, :buildingCode, :locationID)`,
           [cafeID, name, operatingHours, buildingCode, locationID] ,

            {autoCommit: true}
        );

        if (result.rowsAffected === 0) {
            return {success: "failure", message: "Failed to insert new cafe."};
        }
        return {status: "success", message: "Successfully inserted the cafe."};


    }).catch((error) => {
        return {status: "failure", message: "There was an error while inserting into the Cafe:", error};

    })
}

async function insertWashroom(utilityID, overallRating, buildingCode, imageURL, locationID, gender, numStalls, accessibilityFeature) {
    return await withOracleDB(async (connection) => {

        const utilResult = await insertUtility(utilityID, overallRating, buildingCode, imageURL, locationID);

        if (!utilResult) {
            throw new Error('Failed to insert into UTILITY table');
        }

        const washroomResult = await connection.execute(
            `INSERT INTO WASHROOM (utilityID, gender, numStalls, accessibilityFeature)
            VALUES (:utilityID, :gender, :numStalls, :accessibilityFeature)`,
            [utilityID, gender, numStalls, accessibilityFeature],

            { autoCommit: true }
        );

        if (washroomResult.rowsAffected === 0) {
            return {status: "failure", message: "Failed to insert new washroom."};
        }
        return {status: "success", message: "Successfully inserted the washroom table."};


    }).catch((error) => {
        return {status: "error", message: "There was an error while inserting into washroom:", error};
    });
}

async function findCafesWithDrinks(selectedDrinks) {
    let drinksList = selectedDrinks.map(drink => `'${drink}'`).join(', ');

    const query = `
        SELECT c.*
        FROM Cafe c
        WHERE NOT EXISTS (
            (SELECT name FROM Drink WHERE name IN (${drinksList}))
            MINUS
            (SELECT s.drinkName 
             FROM Serves s
             WHERE s.cafeID = c.cafeID)
        )
    `;

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query);
        return {status: 'success', data: result.rows, message: "successfully got cafe with drinks!"};
    }).catch(() => {
        console.error("There was an error while trying to find Cafes.");
        return {status: 'failure', data: [], message: "something went wrong when finding cafe."};

    })
}


async function insertReview(reviewID, utilityID, userID, cleanliness, functionality, accessibility, description) {
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `INSERT INTO Review
            (reviewID, utilityID, userID, cleanliness, functionality, accessibility, description)
            VALUES 
            (:reviewID, :utilityID, :userID, :cleanliness, :functionality, :accessibility, :description)`,
            [reviewID, utilityID, userID, cleanliness, functionality, accessibility, description],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return {status: "failure", message: "Failed to insert new review."};
        }
        return {status: "success", message: "Successfully inserted the review table."};


    }).catch(() => {
        return {status: "error", message: "There was an error while inserting into review."};
    });
}

async function insertRequest(requestID, requestDate, status, requestDescription, requestType, amenityType,
                             buildingName, userID,imageURL ) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Request
                (requestID, requestDate, status, requestDescription, 
                 requestType, amenityType, buildingName, userID, imageURL)
                VALUES 
                    (:requestID, :requestDate, :status, 
                     :requestDescription, :requestType, :amenityType, :buildingName, :userID, :imageURL)`,
            [requestID, requestDate, status, requestDescription, requestType,
                amenityType, buildingName, userID, imageURL],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Failed to insert into REQUEST table');
        }

        return true;
    }).catch((error) => {
        console.error('Insert REQUEST error:', error);
        return false;
    });
}


async function deleteReviews(reviewID, utilityID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Review WHERE reviewID = :reviewID AND utilityID = :utilityID`,
            [reviewID, utilityID],
            { autoCommit: true }
        );
        if (result.rowsAffected && result.rowsAffected > 0) {
                               return { status: 'success', message: 'Review was deleted successfully.' };
                           } else {
                               return { status: 'failure', message: 'No Reviews found with the provided utilityID and reviewID.' };
                           }
    }).catch((error) => {
        console.error('Failed to delete a review:', error);
         return { status: 'error', message: 'There was an error while deleting the review.' };
    });
}


async function deleteAccount(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM UserInfo WHERE userID = :userID`,
            [userID],
            { autoCommit: true }
        );
       if (result.rowsAffected && result.rowsAffected > 0) {
                       return { status: 'success', message: 'Account was deleted successfully.' };
                   } else {
                       return { status: 'failure', message: 'No account found with the provided userID.' };
                   }

    }).catch((error) => {
        console.error('Failed to delete an Account:', error);
        return { status: 'error', message: 'There was an error while deleting the account.' };
    });
}

async function deleteRequest(requestID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Request WHERE requestID = :requestID`,
            [requestID],
            { autoCommit: true }
        );
         if (result.rowsAffected && result.rowsAffected > 0) {
                               return { status: 'success', message: 'Request was deleted successfully.' };
                           } else {
                               return { status: 'failure', message: 'No request was found with the provided requestID.' };
                           }


    }).catch((error) => {
        console.error('Failed to delete a Request:', error);
        return { status: 'error', message: 'There was an error while deleting the account.' };
    });
}

async function updateUsername(userID, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UserInfo SET username=:newName where userID=:userID`,
            [newName, userID],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected > 0) {
                       return { status: 'success', message: 'Username has been updated successfully.' };
                   } else {
                       return { status: 'failure', message: 'No account found with the provided userID.' };
                   }

    }).catch(() => {
        console.error('Failed to update the username:', error);
       return { status: 'error', message: 'There was an error while updating the username.' };
    });
}


async function updateEmail(userID, newEmail) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UserInfo SET email = :newEmail WHERE userID = :userID`,
            [newEmail, userID],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected > 0) {
            return { status: 'success', message: 'Email has been updated successfully.' };
        } else {
            return { status: 'failure', message: 'No account found with the provided userID.' };
        }
    }).catch((error) => {
        console.error('Failed to update email:', error);
        if (error.errorNum === 1) {
            return { status: 'error', message: 'This email is already in use.' };
        } else {
            return { status: 'error', message: 'There was an error while updating the email.' };
        }
    });
}


async function updatePassword(userID, newPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UserInfo SET password=:newPassword where userID=:userID`,
            [newPassword, userID],
            { autoCommit: true }
        );

         if (result.rowsAffected && result.rowsAffected > 0) {
                              return { status: 'success', message: 'Password has been updated successfully.' };
                          } else {
                              return { status: 'failure', message: 'No account found with the provided userID.' };
                          }
           }).catch(() => {
               console.error('Failed to update the password:', error);
              return { status: 'error', message: 'There was an error while updating the password.' };
           });
       }




async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function findBestRatedBuilding() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.buildingCode, t.average
             FROM (
                  SELECT buildingCode, AVG(overallRating) as average
                  FROM Building NATURAL JOIN Utility 
                  GROUP BY buildingCode) t
             WHERE t.average in (SELECT MAX(s.average) 
                                    FROM (
                                           SELECT buildingCode, AVG(overallRating) as average
                                           FROM Building NATURAL JOIN Utility
                                           GROUP BY buildingCode)s)`

        );

        return {status: 'success', data: result.rows, message: "successfully found best building."};


    }).catch( () => {
        console.log("something went wrong while finding best rated building.");
        return {status: 'error', data: [], message: "Something went wrong when finding best building." };
    })
}


async function findAverageRating(){
return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT b.buildingCode, AVG(u.overallRating)
             FROM Utility u, Building b
             WHERE u.buildingCode=b.buildingCode
             GROUP BY b.buildingCode`
        );

        return result.rows;

    }).catch( () => {
        console.log("failed the query");
    })
}







module.exports = {
    findAverageRating,
    updateEmail,
    updatePassword,
    updateUsername,
    deleteAccount,
    testOracleConnection,
    fetchDemotableFromDb,
    updateNameDemotable,
    countDemotable,
    fetchWaterFountainFromDB,
    insertFountain,
    insertMicrowave,
    insertWashroom,
    fetchRequestedUtils,
    fetchRequestedUtilsSimple,
    detailedUtilInfo,
    fetchReviewsForUtil,
    findUtilsAtBuilding,
    deleteReviews,
    deleteRequest,
    utilsWithMinNumOfReviews,
    logIn,
    newUser,
    insertReview,
    insertRequest,
    findCafesWithDrinks,
    fetchCafesListView,
    fetchCafeDetails,
    findBestRatedBuilding,
    findCafesAtBuilding,
    findMaxCafeID,
    findMaxUtilityID,
    findMaxUserID,
    insertCafe
};