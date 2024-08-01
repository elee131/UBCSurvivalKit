DROP TABLE Review;
DROP TABLE Serves;
DROP TABLE Cafe;
DROP TABLE WaterFountain;
DROP TABLE Microwave;
DROP TABLE Washroom;
DROP TABLE Utility;
DROP TABLE Rating;
DROP TABLE Request;
DROP TABLE UserInfo;
DROP TABLE Location;
DROP TABLE AverageRating;
DROP TABLE Hours;
DROP TABLE Building;
DROP TABLE Image;


CREATE TABLE Location (
    locationID INTEGER PRIMARY KEY,
    floor INTEGER NOT NULL,
    locationDescription VARCHAR(250) NOT NULL
);

CREATE TABLE Building(
    buildingCode VARCHAR(10) PRIMARY KEY,
    operatingHours VARCHAR(100),
    name VARCHAR(50) UNIQUE
);
