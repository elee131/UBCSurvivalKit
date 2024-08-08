DROP TABLE Review;
DROP TABLE Serves;
DROP TABLE Drink;
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

CREATE TABLE Rating(
    overallRating FLOAT PRIMARY KEY,
    isRecommended VARCHAR(10)
);

CREATE TABLE Image(
    url VARCHAR(100) PRIMARY KEY,
    description VARCHAR(150)
);

CREATE TABLE Drink(name VARCHAR(20) PRIMARY KEY);


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

CREATE TABLE UserInfo(
    userID INTEGER PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    isAdmin VARCHAR(5)
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


CREATE TABLE Cafe(
    cafeID INTEGER PRIMARY KEY,
    name VARCHAR(50),
    operatingHours VARCHAR(100),
    buildingCode VARCHAR(10) NOT NULL,
    locationID INTEGER NOT NULL,
    FOREIGN KEY (locationID) REFERENCES Location,
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);


CREATE TABLE Serves(
    cafeID INTEGER,
    drinkName VARCHAR(20),
    PRIMARY KEY (cafeID, drinkName),
    FOREIGN KEY (cafeID) REFERENCES Cafe ON DELETE CASCADE,
    FOREIGN KEY (drinkName) REFERENCES Drink(name) ON DELETE CASCADE
);

CREATE TABLE Hours(
    buildingCode VARCHAR(10) PRIMARY KEY,
    operatingHour VARCHAR(150),
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);

CREATE TABLE Washroom(
    utilityID INTEGER PRIMARY KEY,
    gender VARCHAR(30),
    numStalls INTEGER,
    accessibilityFeature VARCHAR(250),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);

CREATE TABLE Microwave(
    utilityID INTEGER PRIMARY KEY,
    microwaveSize VARCHAR(50),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);

Create TABLE WaterFountain(
    utilityID INTEGER PRIMARY KEY,
    hasColdWater CHAR(5),
    hasHotWater CHAR(5),
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



INSERT INTO UserInfo (userID, username, email, password, isAdmin)
VALUES
(0, 'defaultUser', 'd@email.com', 'password', 'true');

INSERT INTO UserInfo (userID, username, email, password, isAdmin)
VALUES
(1, 'Kyle', 'k@email.com', 'password', 'true');

INSERT INTO UserInfo (userID, username, email, password, isAdmin)
VALUES
(2, 'Sarah', 's@email.com', 'password', 'false');

INSERT INTO UserInfo (userID, username, email, password, isAdmin)
VALUES
(3, 'Maddie', 'm@email.com', 'password', 'false');

INSERT INTO UserInfo (userID, username, email, password, isAdmin)
VALUES
(4, 'Joey', 'j@email.com', 'password', null);


INSERT INTO Image(url, description)
VALUES
('/images/iced-latte', 'iced latte');

INSERT INTO Image(url, description)
VALUES
('/images/london-fog', 'london fog');

INSERT INTO Image(url, description)
VALUES
('/images/cappuccino', 'cappuccino');

INSERT INTO Image(url, description)
VALUES
('/images/sauder-tim-hortons', 'Tim Hortons (Sauder location)');

INSERT INTO Image(url, description)
VALUES
('/images/ICICS', 'ICICS top floor');

INSERT INTO Image(url, description)
VALUES
('/images/BIOL', 'BIOL lower floor');

INSERT INTO Image(url, description)
VALUES
('/images/MATX', 'MATX lower floor');

INSERT INTO Image(url, description)
VALUES
('/images/NEST', 'NEST lower floor');

INSERT INTO Image(url, description)
VALUES
('/images/KAIS', 'KAIS lower floor');





INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
('BIOL', 'Mon to Fri: 7:30AM - 8:00PM, Sat/Sun/Holidays: Closed', 'Biological Sciences');

INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
('ICCS', 'Mon to Fri: 7:30AM - 5:00PM, Sat/Sun/Holidays: Closed', 'Institute for Computing');

INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
('NEST', 'Monday to Friday: 7AM - 11PM, Saturday to Sunday: 8AM - 11PM', 'AMS Student Nest');

INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
('MATX', 'Mon to Fri: 7:30AM - 5:00PM, Sat/Sun/Holidays: Closed', 'Mathematics Annex');

INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
('KAIS', 'Mon to Fri: 7:00AM - 6:00PM, Sat/Sun/Holidays: Closed', 'Fred Kaiser');



INSERT INTO Location (locationID, floor, locationDescription)
VALUES
(0, 69, 'default location');

INSERT INTO Location (locationID, floor, locationDescription)
VALUES
(1, 2, 'near the elevator');

INSERT INTO Location (locationID, floor, locationDescription)
VALUES
(2, 2, 'by the mens washroom');

INSERT INTO Location (locationID, floor, locationDescription)
VALUES
(3, 4, 'by rooftop garden');

INSERT INTO Location (locationID, floor, locationDescription)
VALUES
(4, 1, 'by Science One exclusive lounge');


INSERT INTO Rating (overallRating, isRecommended)
VALUES
(4.5, 'TRUE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(0.0, 'FALSE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(1.5, 'FALSE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(3.8, 'FALSE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(4.9, 'TRUE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(2.7, 'FALSE');

INSERT INTO Rating (overallRating, isRecommended)
VALUES
(5.0, 'TRUE');



INSERT INTO Cafe(cafeID, name, operatingHours, buildingCode, locationID)
VALUES
(6000, 'Tim Hortons', '9:00 - 21:00', 'ICCS', 0);

INSERT INTO Cafe(cafeID, name, operatingHours, buildingCode, locationID)
VALUES
(6001, 'Starbucks', '8:30 - 23:00', 'KAIS', 0);

INSERT INTO Cafe(cafeID, name, operatingHours, buildingCode, locationID)
VALUES
(6002, 'Blue Chip Cafe', '9:00 - 17:00', 'NEST', 0);

INSERT INTO Cafe(cafeID, name, operatingHours, buildingCode, locationID)
VALUES
(6003, 'Loafe Cafe', '8:00 - 17:00', 'NEST', 0);

INSERT INTO Cafe(cafeID, name, operatingHours, buildingCode, locationID)
VALUES
(6004, 'JJ Bean Coffee Roasters', '8:00 - 17:00', 'MATX', 0);






INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(10000000, 5.0, 'BIOL', '/images/BIOL', 0);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(10000001, 1.5, 'ICCS', '/images/ICICS', 2);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(10000002, 3.8, 'MATX', '/images/MATX', 1);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(10000003, 4.9, 'NEST', '/images/NEST', 3);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(10000004, 2.7, 'KAIS', '/images/KAIS', 4);



INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(20000000, 5.0, 'BIOL', '/images/BIOL', 0);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(20000001, 1.5, 'ICCS', '/images/ICICS', 1);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(20000002, 2.7, 'MATX', '/images/MATX', 2);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(20000003, 4.9, 'NEST', '/images/NEST', 3);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(20000004, 3.8, 'KAIS', '/images/KAIS', 4);



INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(30000000, 5.0, 'BIOL', '/images/BIOL', 0);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(30000001, 1.5, 'ICCS', '/images/ICICS', 1);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(30000002, 2.7, 'MATX', '/images/MATX', 2);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(30000003, 4.9, 'NEST', '/images/NEST', 3);

INSERT INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(30000004, 3.8, 'KAIS', '/images/KAIS', 4);



INSERT INTO Hours (buildingCode, operatingHour)
VALUES ('ICCS', 'Mon-Fri: 8am-10pm, Sat: 9am-8pm, Sun: 10am-6pm');

INSERT INTO Hours (buildingCode, operatingHour)
VALUES
('BIOL', 'Mon-Fri: 7am-11pm, Sat-Sun: 8am-9pm');

INSERT INTO Hours (buildingCode, operatingHour)
VALUES
('KAIS', 'Mon-Fri: 9am-9pm, Sat: 10am-6pm, Sun: Closed');


INSERT INTO Hours (buildingCode, operatingHour)
VALUES
('NEST', 'Mon-Sat: 8am-8pm, Sun: 9am-5pm');



INSERT INTO Hours (buildingCode, operatingHour)
VALUES
('MATX', 'Mon-Fri: 6am-12am, Sat-Sun: 7am-10pm');



INSERT INTO Drink(name)
VALUES
('Iced Latte');

INSERT INTO Drink(name)
VALUES
('London Fog');

INSERT INTO Drink(name)
VALUES
('Cappuccino');

INSERT INTO Drink(name)
VALUES
('Dark Roast');

INSERT INTO Drink(name)
VALUES
('Espresso');



INSERT INTO Serves(cafeID, drinkName)
VALUES
(6000, 'Iced Latte');
INSERT INTO Serves(cafeID, drinkName)
VALUES
(6000, 'Espresso');
INSERT INTO Serves(cafeID, drinkName)
VALUES
(6000, 'London Fog');
INSERT INTO Serves(cafeID, drinkName)
VALUES
(6000, 'Dark Roast');

INSERT INTO Serves(cafeID, drinkName)
VALUES
(6001, 'Espresso');
INSERT INTO Serves(cafeID, drinkName)
VALUES
(6001, 'London Fog');


INSERT INTO Serves(cafeID, drinkName)
VALUES
(6002, 'London Fog');

INSERT INTO Serves(cafeID, drinkName)
VALUES
(6003, 'Dark Roast');
INSERT INTO Serves(cafeID, drinkName)
VALUES
(6003, 'Iced Latte');

INSERT INTO Serves(cafeID, drinkName)
VALUES
(6004, 'Iced Latte');






INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
(10000000, 'FEMALE', 2, 'WHEELCHAIR STALL');

INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
(10000001, 'FEMALE', 5, 'EMERGENCY CORD');

INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
(10000002, 'NEUTRAL', 1, 'GRAB BAR');

INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
(10000003, 'MALE', 2, 'NONE');

INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
(10000004, 'MALE', 4, 'NONE');



INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
(30000000, 'TRUE', 'FALSE');

INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
(30000001, 'TRUE', 'TRUE');

INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
(30000002, 'TRUE', 'TRUE');

INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
(30000003, 'TRUE', 'FALSE');

INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
(30000004, 'TRUE', 'TRUE');


INSERT INTO Microwave (utilityID, microwaveSize)
VALUES
(20000000, 'SMALL');

INSERT INTO Microwave (utilityID, microwaveSize)
VALUES
(20000001, 'LARGE');

INSERT INTO Microwave (utilityID, microwaveSize)
VALUES
(20000002, 'MEDIUM');

INSERT INTO Microwave (utilityID, microwaveSize)
VALUES
(20000003, 'SMALL');

INSERT INTO Microwave (utilityID, microwaveSize)
VALUES
(20000004, 'MEDIUM');




INSERT INTO AverageRating
VALUES
(1, 1, 1, 1.0);

INSERT INTO AverageRating
VALUES
(2, 2, 2, 2.0);

INSERT INTO AverageRating
VALUES
(3, 3, 3, 3.0);

INSERT INTO AverageRating
VALUES
(4, 4, 4, 4.0);



INSERT INTO Review
VALUES
    (1, 10000000, 0, 1, 1, 1, 'REALLY BAD');
INSERT INTO Review
VALUES
    (1, 10000001, 0, 1, 1, 1, 'I did not enjoy my time here.');

INSERT INTO Review
VALUES
    (2, 10000001, 1, 1, 1, 1, 'AWFUL');

INSERT INTO Review
VALUES
    (3, 10000002, 2, 2, 2, 2, 'MEH');

INSERT INTO Review
VALUES
    (4, 10000004, 3, 3, 3, 3, 'AMAZING');

INSERT INTO Review
VALUES
    (5, 20000001, 4, 4, 4, 4, 'GREAT!');

INSERT INTO Review
VALUES
    (6, 20000001, 2, 2, 2, 2, 'I hated it!');


INSERT INTO Request (
    requestID, requestDate, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
(0, TO_DATE('2024-07-01', 'YYYY-MM-DD'), 'default', 'update', 'fountain', 'CS building', 0, NULL);

INSERT INTO Request (
    requestID, requestDate, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
(1, TO_DATE('2024-01-01', 'YYYY-MM-DD'), 'water fountain broke', 'update', 'fountain', 'Nest', 2, NULL);

INSERT INTO Request (
    requestID, requestDate, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
(2, TO_DATE('2024-02-01', 'YYYY-MM-DD'), 'new cafe', 'add', 'cafe', 'fred kaiser', 3, NULL);

INSERT INTO Request (
    requestID, requestDate, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
(3, TO_DATE('2024-04-01', 'YYYY-MM-DD'), 'new neutral washroom', 'add', 'washroom', 'math annex', 4, NULL);

INSERT INTO Request (
    requestID, requestDate, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
(4, TO_DATE('2024-05-01', 'YYYY-MM-DD'), 'microwave broke', 'update', 'microwave', 'biology', 1, NULL);


commit;





