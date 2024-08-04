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

        if (10000000 <= utilityID && utilityID < 20000000) {
            query = `SELECT *
                    FROM UTILITY NATURAL JOIN WASHROOM NATURAL JOIN HOURS 
                        NATURAL JOIN RATING 
                    WHERE utilityID = :utilityID`;
        } else if (20000000 <= utilityID  && utilityID < 30000000) {
            query = `SELECT *
                     FROM UTILITY NATURAL JOIN MICROWAVE NATURAL JOIN HOURS
                                  NATURAL JOIN RATING
                     WHERE utilityID = :utilityID`;
        } else if (30000000 <= utilityID ) {
            query = `SELECT *
                     FROM UTILITY NATURAL JOIN WATERFOUNTAIN NATURAL JOIN HOURS
                                  NATURAL JOIN RATING
                     WHERE utilityID = :utilityID`;
        } else {
            throw new Error("Invalid utilityID format");
        }

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


async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
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

// async function utilsWithMinNumOfReviews(minReviewNum) {
//     console.log("Minimum review number:", minReviewNum);
//
//     return await withOracleDB(async (connection) => {
//         try {
//             const result = await connection.execute(
//                 `SELECT r.utilityID, COUNT(*) AS Reviews
//                  FROM Review r
//                  GROUP BY r.utilityID
//                  HAVING COUNT(*) >= :minReviewNum`,
//                 [minReviewNum]
//             );
//
//             console.log("Query result:", result);
//             return result.rows;
//         } catch (error) {
//             console.error("Error executing query:", error);
//             throw error;
//         }
//     });
// }

async function newUser(userID, username, email, password) {
    return await withOracleDB(async (connection) => {

        const result = await connection.execute(
            `INSERT INTO USERINFO (userID, username, email, password)
            VALUES (:userID, :username, :email, :password)`,
            [userID, username, email, password],

            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            throw new Error('Failed to insert into USERINFO table');
        }
        return true;

    }).catch(() => {
        return false;
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
            throw new Error('Failed to insert into MICROWAVE table');
        }

        return true;

    }).catch(() => {
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
        return result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Failed to delete a review:', error);
        return false;
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




module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
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
    //utilsWithMinNumOfReviews,
    deleteReviews,

    logIn,
    newUser

};