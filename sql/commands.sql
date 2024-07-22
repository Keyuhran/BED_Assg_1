-- Drop existing tables
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Cart;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Riders;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Snacks;

-- Create Users table
CREATE TABLE Users (
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255),    
    name VARCHAR(255),
    address VARCHAR(255),
    unitNo VARCHAR(255),
    postalCode VARCHAR(255),
    country VARCHAR(255),
    phoneNo VARCHAR(255),
    userBday DATE,
    imagePath VARCHAR(MAX),
    role VARCHAR(255) -- Changed column name to 'role' for consistency
);

-- Create Riders table
CREATE TABLE Riders (
    riderId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    joinDate DATE,
    FOREIGN KEY (email) REFERENCES Users(email)
);

-- Create Admins table
CREATE TABLE Admins (
    adminId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    department VARCHAR(255),
    branch VARCHAR(255),
    position VARCHAR(255),
    joinDate DATE,
    FOREIGN KEY (email) REFERENCES Users(email)
);

-- Create Snacks table
CREATE TABLE Snacks (
  snackId VARCHAR(255) PRIMARY KEY,
  snackName VARCHAR(255) NOT NULL,
  snackDescription VARCHAR(255),
  snackPrice DECIMAL(10,2) NOT NULL,
  ingredients VARCHAR(MAX),
  imagePath VARCHAR(MAX),
  country VARCHAR(255) NOT NULL
);

-- Create Cart table
CREATE TABLE Cart (
    email VARCHAR(255),
    snackIds VARCHAR(255),
    quantity VARCHAR(255),
    TotalCost DECIMAL(10, 2),
    FOREIGN KEY (email) REFERENCES Users(email),
    PRIMARY KEY (email, snackIds)
);

CREATE TABLE Orders (
    orderId VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255),
    snackIds VARCHAR(255),
    quantity VARCHAR(255),
    dateAdded DATETIME,
    dateCompleted DATETIME,
    status VARCHAR(255),
    FOREIGN KEY (email) REFERENCES Users(email)
);

-- Insert Snacks
INSERT INTO Snacks (snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) VALUES
('MY001', 'Kuih Seri Muka', 'A traditional two-layered dessert with a base of glutinous rice and a top layer of pandan custard. The glutinous rice is sticky and slightly salty, while the custard is sweet and flavored with pandan leaves.', 0.50, 'Glutinous rice, coconut milk, pandan leaves, sugar, salt', NULL, 'Malaysia'),
('MY002', 'Apam Balik', 'A thick pancake turnover that is crispy on the outside and soft on the inside. It is stuffed with a mixture of ground peanuts, sweet corn, and sugar. It is a popular street food snack.', 0.75, 'Flour, eggs, sugar, peanuts, sweet corn, butter', NULL, 'Malaysia'),
('MY003', 'Keropok Lekor', 'A traditional Malay snack made from fish and sago flour. These fish crackers are deep-fried until crispy and are usually served with a sweet and spicy chili sauce.', 1.00, 'Fish, sago flour, salt, sugar, chili, oil', NULL, 'Malaysia'),
('SG001', 'Kaya Toast', 'Toasted bread spread with kaya, a rich and creamy coconut jam, and a thick slice of butter. This snack is often enjoyed with a cup of coffee or tea.', 1.20, 'Bread, kaya (coconut jam), butter', 'https://i.ytimg.com/vi/11kTX7LpFlA/maxresdefault.jpg', 'Singapore'),
('SG002', 'Popiah', 'Fresh spring rolls filled with a mix of cooked turnip, carrots, beans, and shrimp. These rolls are often served with a sweet and spicy sauce.', 1.50, 'Turnip, carrots, beans, shrimp, spring roll wrappers, sweet sauce, spicy sauce', 'https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2022/05/popiah-malaysian-spring-rolls-1.jpg', 'Singapore'),
('SG003', 'Satay', 'Grilled skewered meat served with a savory peanut sauce. The meat, usually chicken or beef, is marinated in a mixture of spices and then grilled over an open flame.', 2.00, 'Chicken or beef, spices, peanuts, coconut milk, sugar, soy sauce', 'https://thebigmansworld.com/wp-content/uploads/2023/10/chicken-satay-recipe.jpg', 'Singapore'),
('BN001', 'Kelupis', 'A traditional snack made from glutinous rice that is wrapped in palm leaves and steamed. It is usually enjoyed with a side of curry or sambal.', 1.00, 'Glutinous rice, palm leaves, salt, coconut milk', NULL, 'Brunei'),
('BN002', 'Penyaram', 'A sweet, deep-fried cake made from rice flour and palm sugar. The cake is crispy on the outside and soft on the inside, with a caramel-like flavor.', 0.75, 'Rice flour, palm sugar, water, oil', NULL, 'Brunei'),
('BN003', 'Kuih Cincin', 'Fried dough rings made from rice flour and palm sugar. These rings are crunchy and have a sweet and slightly smoky flavor.', 0.50, 'Rice flour, palm sugar, water, oil', NULL, 'Brunei'),
('ID001', 'Klepon', 'Glutinous rice balls filled with palm sugar and coated in grated coconut. When bitten into, the liquid palm sugar oozes out, creating a delightful contrast with the chewy rice and coconut.', 0.50, 'Glutinous rice flour, palm sugar, grated coconut, salt', NULL, 'Indonesia'),
('ID002', 'Tempeh Chips', 'Thin slices of tempeh, a fermented soybean cake, that are deep-fried until crispy. These chips are a popular snack that is both savory and crunchy.', 1.00, 'Tempeh, oil, salt', NULL, 'Indonesia'),
('ID003', 'Pisang Goreng', 'Fried banana fritters that are crispy on the outside and soft on the inside. The bananas are battered and then deep-fried to perfection.', 0.75, 'Bananas, flour, sugar, salt, oil', NULL, 'Indonesia'),
('TH001', 'Khanom Buang', 'Thai crispy pancakes that are filled with a sweet meringue and topped with a variety of ingredients such as shredded coconut, golden egg yolk threads, or savory shrimp.', 0.50, 'Flour, eggs, sugar, coconut, egg yolk threads, shrimp', NULL, 'Thailand'),
('TH002', 'Tod Mun Pla', 'Thai fish cakes that are made from minced fish mixed with curry paste and long beans. They are deep-fried and served with a cucumber relish.', 1.50, 'Fish, curry paste, long beans, egg, breadcrumbs, oil', NULL, 'Thailand'),
('TH003', 'Sai Oua', 'A Northern Thai spicy sausage made from minced pork mixed with herbs and spices. It is grilled over an open flame and is often served with sticky rice.', 2.00, 'Pork, lemongrass, kaffir lime leaves, garlic, chili, salt', NULL, 'Thailand'),
('TL001', 'Bibinka', 'A traditional coconut cake that is rich and moist, made with coconut milk, sugar, and flour. It is baked until golden brown and often enjoyed during special occasions.', 1.00, 'Coconut milk, sugar, flour, eggs, butter', NULL, 'Timor-Leste'),
('TL002', 'Tapai', 'A fermented snack made from rice or cassava that has a slightly sweet and alcoholic flavor. It is often wrapped in banana leaves.', 0.75, 'Rice or cassava, yeast, sugar, banana leaves', NULL, 'Timor-Leste'),
('TL003', 'Mane', 'Corn fritters that are crispy on the outside and soft on the inside. They are made with fresh corn kernels mixed with flour and fried until golden brown.', 0.50, 'Corn, flour, eggs, salt, oil', NULL, 'Timor-Leste'),
('CB001', 'Num Banh Chok', 'Traditional Khmer noodles served with a fish-based green curry gravy made from lemongrass, turmeric root, garlic, shallots, and kaffir lime.', 2.75, 'Rice Noodles, Fish Curry Gravy, Lemongrass, Turmeric, Garlic, Shallots, Kaffir Lime', NULL, 'Cambodia'),
('CB002', 'Bai Sach Chrouk', 'Grilled pork served over broken rice, accompanied by fresh pickled vegetables and a side of chicken broth.', 3.00, 'Pork, Rice, Pickled Vegetables, Chicken Broth', NULL, 'Cambodia'),
('CB003', 'Kralan', 'Glutinous rice mixed with black beans, grated coconut, and a bit of sugar, roasted in bamboo tubes over a fire until it turns crispy and fragrant.', 1.75, 'Glutinous Rice, Black Beans, Coconut, Sugar', NULL, 'Cambodia'),
('MM001', 'Mohinga', 'A traditional Myanmar breakfast dish consisting of rice noodles in fish soup with lemongrass and a variety of toppings such as fried fish cakes, boiled eggs, and crispy fritters.', 3.25, 'Rice Noodles, Fish Soup, Lemongrass, Fried Fish Cakes, Boiled Eggs, Crispy Fritters', NULL, 'Myanmar'),
('MM002', 'Laphet Thoke', 'A popular Burmese salad made with fermented tea leaves, mixed with crunchy beans, nuts, sesame seeds, garlic, chili, and lime juice.', 2.50, 'Fermented Tea Leaves, Beans, Nuts, Sesame Seeds, Garlic, Chili, Lime Juice', NULL, 'Myanmar'),
('MM003', 'Shan Noodles', 'Rice noodles in a savory broth with pork, garlic, peanuts, and scallions, served with pickled mustard greens and a side of chili sauce.', 2.75, 'Rice Noodles, Pork, Garlic, Peanuts, Scallions, Mustard Greens, Chili Sauce', NULL, 'Myanmar'),
('LA001', 'Laap', 'A traditional Lao minced meat salad typically made with chicken, pork, or beef, mixed with fish sauce, lime juice, chili, and fresh herbs.', 3.00, 'Minced Meat (Chicken/Pork/Beef), Fish Sauce, Lime Juice, Chili, Fresh Herbs', NULL, 'Laos'),
('LA002', 'Tam Mak Hoong', 'Spicy Lao green papaya salad made with shredded green papaya, tomatoes, chili peppers, garlic, lime juice, fish sauce, and peanuts.', 2.50, 'Green Papaya, Tomatoes, Chili Peppers, Garlic, Lime Juice, Fish Sauce, Peanuts', NULL, 'Laos'),
('LA003', 'Khao Piak Sen', 'A comforting Lao noodle soup made with homemade rice noodles, pork broth, minced pork, and various herbs.', 2.75, 'Rice Noodles, Pork Broth, Minced Pork, Herbs', NULL, 'Laos'),
('VN001', 'Banh Mi', 'A Vietnamese sandwich consisting of a baguette filled with various savory ingredients such as grilled pork, pork belly, chicken, beef, Vietnamese sausage, or tofu.', 2.50, 'Baguette, Grilled Pork, Pork Belly, Chicken, Beef, Vietnamese Sausage, Tofu', NULL, 'Vietnam'),
('VN002', 'Pho', 'A Vietnamese noodle soup consisting of broth, rice noodles, herbs, and meat (usually beef or chicken), often served with lime, chili, and bean sprouts.', 3.50, 'Broth, Rice Noodles, Herbs, Beef/Chicken, Lime, Chili, Bean Sprouts', NULL, 'Vietnam'),
('VN003', 'Goi Cuon', 'Fresh Vietnamese spring rolls filled with shrimp, pork, herbs, rice vermicelli, and lettuce, served with a peanut dipping sauce.', 2.00, 'Shrimp, Pork, Herbs, Rice Vermicelli, Lettuce, Peanut Sauce', NULL, 'Vietnam'),
('PH001', 'Adobo', 'A popular Filipino dish of meat (chicken, pork, or both) marinated in vinegar, soy sauce, garlic, bay leaves, and black peppercorns, then stewed until tender.', 4.00, 'Chicken/Pork, Vinegar, Soy Sauce, Garlic, Bay Leaves, Black Peppercorns', NULL, 'Philippines'),
('PH002', 'Halo-Halo', 'A Filipino dessert made with mixed fruits, beans, jelly, and shaved ice, topped with evaporated milk, ice cream, and sometimes leche flan (caramel custard).', 3.50, 'Mixed Fruits, Beans, Jelly, Shaved Ice, Evaporated Milk, Ice Cream, Leche Flan', NULL, 'Philippines'),
('PH003', 'Lechon', 'A whole roasted pig cooked over charcoal, resulting in crispy skin and tender meat, often served during festive occasions.', 5.00, 'Pork, Garlic, Vinegar, Soy Sauce, Bay Leaves', NULL, 'Philippines');

-- Insert Users
INSERT INTO Users (email, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role) VALUES
('user1@example.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'user one', 'Street 1', '10', '101', 'Singapore', '+65 12121212', '2006/08/16', null, 'user'),
('user2@example.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'user two', 'Street 2', '20', '202', 'Singapore', '+65 12121212', '2006/08/16', null, 'user'),
('user3@example.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'user three', 'Street 3', '30', '303', 'Singapore', '+65 12121212', '2006/08/16', null, 'user'),
('user4@example.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'user four', 'Street 4', '40', '404', 'Singapore', '+65 12121212', '2006/08/16', null, 'user'),
('user5@example.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'user five', 'Street 5', '50', '505', 'Singapore', '+65 12121212', '2006/08/16', null, 'user'),
('krish@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Krish Kamal', 'Street 1', '10', '101', 'Singapore', '+65 12121212', '2022/08/16', null, 'rider'),
('jeffrey@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Jeffrey Dahmer', 'Street 2', '20', '202', 'Singapore', '+65 12121212', '2023/08/16', null, 'rider'),
('ben@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Ben Kheng', 'Street 3', '30', '303', 'Singapore', '+65 12121212', '2020/08/16', null, 'rider'),
('robert@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Robert Downey Jr.', 'Street 4', '40', '404', 'Singapore', '+65 12121212', '2006/08/16', null, 'rider'),
('spider@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Spider-Man', 'Street 5', '50', '505', 'Singapore', '+65 12121212', '1999/08/16', null, 'rider'),
('kamal@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Krish Kamal', 'Street 1', '10', '101', 'Singapore', '+65 12121212', '2022/07/16', null, 'admin'),
('dahmer@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Jeffrey Dahmer', 'Street 2', '20', '202', 'Singapore', '+65 12121212', '2023/09/15', null, 'admin'),
('kheng@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Ben Kheng', 'Street 3', '30', '303', 'Singapore', '+65 12121212', '2020/03/20', null, 'admin'),
('downey@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Robert Downey Jr.', 'Street 4', '40', '404', 'Singapore', '+65 12121212', '2006/02/09', null, 'admin'),
('man@email.com', '$2a$10$B4i8bICJNjaR4bcBaMdnseKIG8IkkSU2rF2VlmlrZsdrZBnEOUljC', 'Spider-Man', 'Street 5', '50', '505', 'Singapore', '+65 12121212', '2001/08/10', null, 'admin');

-- Insert Riders
INSERT INTO Riders (riderId, email, joinDate) VALUES
('12341234', 'krish@email.com', '2022/08/16'),
('12341235', 'jeffrey@email.com', '2023/08/16'),
('12341236', 'ben@email.com', '2020/08/16'),
('12341237', 'robert@email.com', '2006/08/16'),
('12341238', 'spider@email.com', '1999/08/16');

-- Insert Admins
INSERT INTO Admins (adminId, email, department, branch, position, joinDate) VALUES
('12341239', 'kamal@email.com', 'Snack', '1', 'intern', '2022/07/16'),
('12341240', 'dahmer@email.com', 'Snack', '1', 'lead developer', '2023/09/15'),
('12341241', 'kheng@email.com', 'Rider', '2', 'developer', '2020/03/20'),
('12341242', 'downey@email.com', 'User', '2', 'manager', '2006/02/09'),
('12341243', 'man@email.com', 'Admin', '3', 'manager', '2001/08/10');
