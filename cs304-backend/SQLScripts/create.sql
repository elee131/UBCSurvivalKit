DROP TABLE Request;
DROP TABLE Review;
DROP TABLE AverageRating;
DROP TABLE Microwave;
DROP TABLE WaterFountain;
DROP TABLE Washroom;
DROP TABLE Serves;
DROP TABLE Drink;
DROP TABLE Hours;
DROP TABLE Utility;
DROP TABLE Cafe;
DROP TABLE Rating;
DROP TABLE Location;
DROP TABLE Building;
DROP TABLE Image;
DROP TABLE UserInfo;

CREATE TABLE UserInfo(
    userID INTEGER PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE Image(
    url VARCHAR(100) PRIMARY KEY,
    description VARCHAR(150)
);

CREATE TABLE Building(
    buildingCode VARCHAR(10) PRIMARY KEY,
    operatingHours VARCHAR(100),
    name VARCHAR(50) UNIQUE
);

CREATE TABLE Location (
    locationID INTEGER PRIMARY KEY,
    floor INTEGER NOT NULL,
    locationDescription VARCHAR(250) NOT NULL
);


CREATE TABLE Rating(
    overallRating FLOAT PRIMARY KEY,
    isRecommended VARCHAR(10)
);


CREATE TABLE Cafe(
    cafeID INTEGER PRIMARY KEY,
    name CHAR(50),
    operatingHours CHAR(100),
    buildingCode VARCHAR(10) NOT NULL,
    locationID INTEGER NOT NULL,
    FOREIGN KEY (locationID) REFERENCES Location,
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);

CREATE TABLE Utility (
    utilityID INTEGER PRIMARY KEY,
    overallRating FLOAT,
    buildingCode VARCHAR(10) NOT NULL,
    imageURL VARCHAR(50),
    locationID INTEGER NOT NULL,
    FOREIGN KEY (imageURL) REFERENCES Image(url),
    FOREIGN KEY (locationID) REFERENCES Location,
    FOREIGN KEY (overallRating) REFERENCES Rating,
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);

CREATE TABLE Hours(
    buildingCode VARCHAR(10) PRIMARY KEY,
    operatingHour VARCHAR(150),
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);

CREATE TABLE Drink(name VARCHAR(20) PRIMARY KEY);

CREATE TABLE Serves(
    cafeID INTEGER,
    drinkName VARCHAR(20),
    PRIMARY KEY (cafeID, drinkName),
    FOREIGN KEY (cafeID) REFERENCES Cafe ON DELETE CASCADE,
    FOREIGN KEY (drinkName) REFERENCES Drink(name) ON DELETE CASCADE
);

CREATE TABLE Washroom(
    utilityID INTEGER PRIMARY KEY,
    gender VARCHAR(30),
    numStalls INTEGER,
    accessibilityFeature VARCHAR(250),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);

Create TABLE WaterFountain(
    utilityID INTEGER PRIMARY KEY,
    hasColdWater CHAR(5),
    hasHotWater CHAR(5),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);


CREATE TABLE Microwave(
    utilityID INTEGER PRIMARY KEY,
    microwaveSize VARCHAR(50),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);

CREATE TABLE AverageRating(
    cleanliness INTEGER,
    functionality INTEGER,
    accessibility INTEGER,
    averageRating FLOAT,
    PRIMARY KEY (cleanliness, functionality, accessibility)
);

CREATE TABLE Review(
    reviewID INTEGER,
    utilityID INTEGER,
    userID INTEGER NOT NULL,
    cleanliness INTEGER NOT NULL,
    functionality INTEGER NOT NULL,
    accessibility INTEGER NOT NULL,
    description VARCHAR(250),
    PRIMARY KEY (reviewID, utilityID),
    FOREIGN KEY (cleanliness, functionality, accessibility) REFERENCES AverageRating,
    FOREIGN KEY (utilityID) REFERENCES Utility,
    FOREIGN KEY (userID) REFERENCES UserInfo ON DELETE CASCADE
);

CREATE TABLE Request(
    requestID INTEGER PRIMARY KEY,
    requestDate DATE, -- changed date to requestDate
    status VARCHAR(20) DEFAULT 'PENDING',
    requestDescription VARCHAR(250),
    requestType VARCHAR(20),
    amenityType VARCHAR(20) NOT NULL,
    buildingName VARCHAR(20) NOT NULL,
    userID INTEGER NOT NULL,
    imageURL VARCHAR(50),
    FOREIGN KEY (imageURL) REFERENCES Image(url),
    FOREIGN KEY (userID) REFERENCES UserInfo(userID) ON DELETE CASCADE
);

INSERT INTO Review(reviewID, utilityID, userID, cleanliness, funcitonality, accessibility, description)
VALUES
