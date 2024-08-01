DROP TABLE Rating;
DROP TABLE Microwave;
DROP TABLE Washroom;
DROP TABLE WaterFountain;
DROP TABLE AverageRating;
DROP TABLE Utility;
DROP TABLE Serves;
DROP TABLE Drink;
DROP TABLE Cafe;
DROP TABLE Request;
Drop Table Review;
DROP TABLE Hours;
DROP TABLE User;
DROP TABLE Building;
DROP TABLE Location;
DROP TABLE Image;

CREATE TABLE Location (
    locationID INTEGER PRIMARY KEY,
    floor INTEGER NOT NULL,
    locationDescription VARCHAR(250) NOT NULL
);

CREATE TABLE User(
    userID INTEGER PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE Request(
    requestID INTEGER PRIMARY KEY,
    date DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    requestDescription VARCHAR(250),
    requestType VARCHAR(20),
    amenityType VARCHAR(20) NOT NULL,
    buildingName VARCHAR(20) NOT NULL,
    userID INTEGER NOT NULL DEFAULT 0,
    imageURL VARCHAR(50),
    FOREIGN KEY (imageURL) REFERENCES Image(url),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE SET DEFAULT
);

CREATE TABLE Building(
    buildingCode VARCHAR(10) PRIMARY KEY,
    operatingHours VARCHAR(20),
    name VARCHAR(20) UNIQUE
);

CREATE TABLE Image(
    url VARCHAR(20) PRIMARY KEY,
    description VARCHAR(150)
);

CREATE TABLE Utility (
    utilityID INTEGER PRIMARY KEY,
    overallRating FLOAT,
    buildingCode VARCHAR(10) NOT NULL,
    imageURL VARCHAR(50),
    locationID INTEGER NOT NULL,
    FOREIGN KEY (imageURL) REFERENCES Image(url),
    FOREIGN KEY (locationID) REFERENCES Location,
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

CREATE TABLE Rating(
    overallRating FLOAT PRIMARY KEY,
    isRecommended BOOLEAN
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
    size VARCHAR(50),
    FOREIGN KEY (utilityID) REFERENCES Utility ON DELETE CASCADE
);

Create TABLE WaterFountain(
    utilityID INTEGER PRIMARY KEY,
    hasColdWater BOOLEAN,
    hasHotWater BOOLEAN,
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
    userID INTEGER NOT NULL DEFAULT 0,
    cleanliness INTEGER NOT NULL,
    functionality INTEGER NOT NULL,
    accessibility INTEGER NOT NULL,
    description VARCHAR(250),
    PRIMARY KEY (reviewID, utilityID),
    FOREIGN KEY (utilityID) REFERENCES Utility,
    FOREIGN KEY (userID) REFERENCES User ON DELETE SET DEFAULT
);

CREATE TABLE Cafe(
    cafeID INTEGER PRIMARY KEY,
    name CHAR(50),
    operatingHours CHAR(50),
    buildingCode CHAR(10) NOT NULL,
    locationID INTEGER NOT NULL,
    FOREIGN KEY (locationID) REFERENCES Location,
    FOREIGN KEY (buildingCode) REFERENCES Building ON DELETE CASCADE
);

INSERT
INTO Image(url, description)
VALUES
("/images/iced-latte", "iced latte"),
("/images/london-fog", "london fog"),
("/images/cappuccino", "cappuccino"),
("/images/sauder-tim-hortons", "Tim Hortons (Sauder location)"),
("/images/ICICS-top-floor-male-washroom", "Male Washroom (ICICS top floor)")

INSERT
INTO Cafe(cafeID, name, operatingHours)
VALUES
(1732, "Tim Hortons", "9:00 - 21:00"),
(3812, "Starbucks", "8:30 - 23:00"),
(8128, "Blue Chip Cafe", "9:00 - 17:00"),
(5921, "Loafe Cafe", "8:00 - 17:00"),
(7391, "JJ Bean Coffee Roasters", "8:00 - 17:00")

INSERT
INTO Drink(name)
VALUES
("Iced Latte"),
("London Fog"),
("Cappuccino"),
("Dark Roast"),
("Espresso")

INSERT
INTO Serves(cafeID, drinkName)
VALUES
("Tim Hortons", "Iced Latte"),
("Tim Hortons", "Espresso"),
("Starbucks", "London Fog"),
("Starbucks", "Dark Roast"),
("Starbucks", "Iced Latte")


INSERT
INTO Utility(utilityID, overallRating, buildingCode, imageURl, locationID)
VALUES
(0, 2.4, “BIOL”, "/images/BIOL", 0),
(1, 5.0, “ICCS”, "/images/ICICS-top-floor-male-washroom", 2),
(2, 3.2, “ICCS”, "/images/ICCS-elevator", 1),
(3, 1.9, “NEST”, "/images/NEST-garden", 3),
(4, 4.6, “NEST”, "/images/NEST-washroom", 5)

INSERT INTO Location (locationID, floor, locationDescription)
VALUES
    (0, 69, 'default location'),
    (1, 2, 'near the elevator'),
    (2, 2, 'by the men''s washroom'),
    (3, 4, 'by rooftop garden'),
    (4, 1, 'by Science One exclusive lounge');

INSERT INTO User (userID, username, email, password)
VALUES
    (0, 'defaultUser', 'd@email.com', 'password'),
    (1, 'Kyle', 'k@email.com', 'password'),
    (2, 'Sarah', 's@email.com', 'password'),
    (3, 'Maddie', 'm@email.com', 'password'),
    (4, 'Joey', 'j@email.com', 'password');

INSERT INTO Request (
    requestID, date, requestDescription, requestType, amenityType, buildingName, userID, imageURL)
VALUES
    (0, '2024-07-01', 'default', 'update', 'fountain', 'CS building', 0, NULL),
    (1, '2023-07-01', 'water fountain broke', 'update', 'fountain', 'Nest', 2, NULL),
    (2, '2024-05-01', 'new cafe', 'add', 'cafe', 'fred kaiser', 3, NULL),
    (3, '2024-03-01', 'new neutral washroom', 'add', 'washroom', 'math annex', 4, NULL),
    (4, '2024-04-20', 'microwave broke', 'update', 'microwave', 'biology', 1, NULL);

INSERT INTO Building (buildingCode, operatingHours, name)
VALUES
    ('BIOL', 'Mon to Fri: 7:30AM - 8:00PM, Sat/Sun/Holidays: Closed', 'Biological Sciences'),
    ('ICCS', 'Mon to Fri: 7:30AM - 5:00PM, Sat/Sun/Holidays: Closed', 'Institute for Computing'),
    ('NEST', 'Monday to Friday: 7AM - 11PM, Saturday to Sunday: 8AM - 11PM', 'AMS Student Nest'),
    ('MATX', 'Mon to Fri: 7:30AM - 5:00PM, Sat/Sun/Holidays: Closed', 'Mathematics Annex'),
    ('KAIS', 'Mon to Fri: 7:00AM - 6:00PM, Sat/Sun/Holidays: Closed', 'Fred Kaiser');

INSERT INTO Washroom (utilityID, gender, numStalls, accessibilityFeature)
VALUES
    (10000000, 'FEMALE', 2, 'WHEELCHAIR STALL'),
    (10000001, 'FEMALE', 5, 'WHEELCHAIR STALL'),
    (10000002, 'NEUTRAL', 1, 'GRAB BAR'),
    (10000003, 'MALE', 2, 'NONE'),
    (10000004, 'MALE', 4, 'NONE');

INSERT INTO Microwave (utilityID, size)
VALUES
    (20000000, 'SMALL'),
    (20000001, 'LARGE'),
    (20000002, 'MEDIUM'),
    (20000003, 'SMALL'),
    (20000004, 'MEDIUM');

INSERT INTO WaterFountain (utilityID, hasColdWater, hasHotWater)
VALUES
    (30000000, TRUE, FALSE),
    (30000001, TRUE, FALSE),
    (30000002, TRUE, TRUE),
    (30000003, TRUE, FALSE),
    (30000004, TRUE, TRUE);



INSERT INTO AverageRating
VALUES
    (1, 1, 1, 1.0),
    (2, 2, 2, 2.0),
    (3, 3, 3, 3.0),
    (4, 4, 4, 4.0),
    (5, 5, 5, 5.0);

INSERT INTO Review
VALUES
    (1, 1, 1, 1, 1, 1, 'REALLY BAD'),
    (2, 1, 1, 2, 1, 3, 'AWFUL'),
    (3, 3, 2, 2, 3, 4, 'MEH'),
    (4, 4, 3, 5, 5, 5, 'AMAZING'),
    (5, 2, 4, 5, 3, 4, 'GREAT!');

INSERT INTO Rating (overallRating, isRecommended)
VALUES (4.5, TRUE),
(3.8, FALSE),
(4.9, TRUE),
(2.7, FALSE),
(5.0, TRUE);

INSERT INTO Hours (buildingCode, operatingHour)
VALUES ('ICCS', 'Mon-Fri: 8am-10pm, Sat: 9am-8pm, Sun: 10am-6pm'),
('BIOL', 'Mon-Fri: 7am-11pm, Sat-Sun: 8am-9pm'),
('KAIS', 'Mon-Fri: 9am-9pm, Sat: 10am-6pm, Sun: Closed'),
('NEST', 'Mon-Sat: 8am-8pm, Sun: 9am-5pm'),
('MATX', 'Mon-Fri: 6am-12am, Sat-Sun: 7am-10pm');

