-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2024 at 12:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clicktheplanet-v2`
--

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gold` varchar(50) NOT NULL,
  `diamonds` varchar(50) NOT NULL,
  `currentlevel` varchar(50) NOT NULL,
  `maxlevel` varchar(50) NOT NULL,
  `currentstage` int(2) NOT NULL,
  `maxstage` int(2) NOT NULL,
  `currenthp` varchar(50) NOT NULL,
  `maxhp` varchar(50) NOT NULL,
  `currentdamage` varchar(50) NOT NULL,
  `totaldamage` varchar(50) NOT NULL,
  `critchance` varchar(10) NOT NULL,
  `guild_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`id`, `user_id`, `gold`, `diamonds`, `currentlevel`, `maxlevel`, `currentstage`, `maxstage`, `currenthp`, `maxhp`, `currentdamage`, `totaldamage`, `critchance`, `guild_id`) VALUES
(10, 10, '123132', '1', '3', '1232', 0, 0, '27', '27', '23', '0', '0.03', NULL),
(41, 38, '59741692407', '131', '123', '123', 0, 0, '45387', '45387', '4033', '22574424', '0.01', NULL),
(42, 39, '5019329', '110', '38', '38', 10, 10, '4332', '4332', '3335', '1196143', '0.01', NULL),
(43, 40, '1854402', '107', '34', '34', 8, 8, '3468', '3468', '1206', '725343.8300000002', '0.01', NULL),
(44, 41, '5673', '102', '3', '3', 9, 9, '27', '27', '9', '554', '0.01', NULL),
(45, 42, '68410', '113', '19', '19', 10, 10, '1083', '1083', '340', '95582', '0.01', NULL),
(46, 43, '100', '100', '1', '1', 0, 0, '10', '10', '1', '0', '0.01', NULL),
(47, 44, '100', '100', '1', '1', 0, 0, '10', '10', '1', '0', '0.01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guilds`
--

CREATE TABLE `guilds` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `owner` int(11) NOT NULL,
  `guild_members_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guild_members`
--

CREATE TABLE `guild_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `guild_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `guild_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`) VALUES
(1, 'Blue Laser Gun'),
(2, 'Green Laser Gun'),
(3, 'Red Laser Gun');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(50) NOT NULL,
  `user` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `date_sent` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `guild_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `user`, `message`, `date_sent`, `guild_id`) VALUES
(1, '11', 'Hello world', '2024-01-11 08:23:45', 3),
(2, '11', 'Lorem Ipsum Lorem Ipsum', '2024-01-11 08:23:49', 3),
(3, '11', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu suscipit nisl. Nam hendrerit dapibus fermentum. Nunc bibendum vehicula felis ac euismod.', '2024-01-11 08:23:53', 3),
(4, '11', 'Mauris nec tortor laoreet, posuere leo non, rutrum odio. Integer eget elit lacinia, tristique enim sed, tristique nunc. Quisque molestie sit amet mauris et mollis.', '2024-01-11 08:23:57', 3),
(5, '11', 'Nam faucibus ex metus, at sagittis augue maximus non. Ut vitae erat vitae elit cursus consequat. In aliquam iaculis ligula, eget posuere ligula lacinia sed. Ut scelerisque in velit ac feugiat. Nunc sed risus rhoncus neque mollis congue eu at nunc. Donec quis consequat purus, ac facilisis purus.', '2024-01-11 08:24:02', 3),
(6, '10', 'Hello I\'m from a different guild!', '2024-01-11 08:24:06', 4),
(7, '11', 'I\'m from this guild! Galaxy conquerors', '2024-01-11 08:24:10', 3),
(8, '12', 'I\'m Most Strongest Potato hello!', '2024-01-11 08:46:50', 3),
(9, '12', 'Sending messages test!!!', '2024-01-11 20:53:08', 3),
(104, '11', 'Hello world, no socket rooms yet! :[', '2024-01-12 18:48:51', 3),
(119, '11', 'Welcome to the guild!', '2024-01-14 10:02:22', 3),
(120, '11', 'Hello!!!', '2024-01-14 10:21:34', 3),
(121, '11', 'fdsfdsfsfs', '2024-01-14 10:21:37', 3),
(122, '11', 'dsadasda', '2024-01-14 10:37:34', 3),
(123, '12', 'dadada', '2024-01-14 10:45:11', 3),
(124, '11', 'Hello', '2024-01-14 10:56:19', 3),
(125, '11', 'Hello', '2024-01-14 10:56:49', 3),
(126, '12', 'Hello', '2024-01-14 10:57:20', 3),
(127, '12', 'dasda', '2024-01-14 10:59:07', 3),
(128, '11', 'didada', '2024-01-14 11:02:35', 3),
(129, '11', 'fsdfs', '2024-01-14 11:03:33', 3),
(130, '11', 'dfsdf', '2024-01-14 11:03:56', 3),
(131, '11', 'dsfdsf', '2024-01-14 11:04:37', 3),
(132, '11', 'hello', '2024-01-14 11:05:18', 3),
(133, '11', 'hello', '2024-01-14 11:07:15', 3),
(134, '11', 'hello', '2024-01-14 11:07:54', 3),
(135, '11', 'hello', '2024-01-14 11:08:30', 3),
(136, '11', 'hello', '2024-01-14 11:08:43', 3),
(137, '11', 'h89h78h', '2024-01-14 11:10:01', 3),
(138, '11', 'asdasda', '2024-01-14 11:16:15', 3),
(139, '11', 'sadasdada', '2024-01-14 11:16:52', 3),
(140, '11', 'asda', '2024-01-14 11:19:54', 3),
(141, '11', 'asdadsdadads', '2024-01-14 11:20:32', 3),
(142, '11', 'insert', '2024-01-14 11:22:16', 3),
(143, '11', 'insert2', '2024-01-14 11:22:45', 3),
(144, '11', 'insert3', '2024-01-14 11:23:26', 3),
(145, '11', 'insert44', '2024-01-14 11:23:58', 3),
(146, '11', 'inset555', '2024-01-14 11:27:20', 3),
(147, '11', 'awsdawdawda', '2024-01-14 11:28:14', 3),
(148, '11', 'zxczxc', '2024-01-14 11:32:50', 3),
(149, '11', 'asdasda', '2024-01-14 11:48:05', 3),
(150, '11', 'asdadsad', '2024-01-14 11:48:32', 3),
(151, '11', 'awdawd', '2024-01-14 11:50:52', 3),
(152, '11', 'uid test', '2024-01-14 11:54:16', 3),
(153, '11', 'uid test2', '2024-01-14 11:55:58', 3),
(154, '11', 'uid test3', '2024-01-14 11:57:49', 3),
(155, '11', 'uid test4', '2024-01-14 11:58:23', 3),
(156, '11', 'uid test 5', '2024-01-14 11:59:55', 3),
(157, '11', 'uid test6', '2024-01-14 12:00:15', 3),
(158, '11', 'uid test7', '2024-01-14 12:00:37', 3),
(159, '12', 'hello after tests', '2024-01-14 12:00:50', 3),
(160, '12', 'hello', '2024-01-14 12:01:00', 3),
(161, '12', 'adadad', '2024-01-14 12:03:43', 3),
(162, '11', 'adadad', '2024-01-14 12:03:54', 3),
(163, '11', 'asdad', '2024-01-14 12:06:04', 3),
(164, '11', 'asdadadadadada', '2024-01-14 12:06:19', 3),
(165, '12', 'asdasdsad', '2024-01-14 12:06:27', 3),
(166, '11', 'asdsada', '2024-01-14 12:14:44', 3),
(167, '12', 'asdasd', '2024-01-14 12:14:55', 3),
(168, '12', 'Hello world', '2024-01-14 12:16:57', 3),
(169, '11', 'fgfgdf', '2024-01-14 12:22:37', 3),
(170, '11', 'asdasdasda', '2024-01-14 12:23:19', 3),
(171, '11', 'asdasdadasdadwdaqwqe', '2024-01-14 12:24:11', 3),
(172, '11', 'asdas', '2024-01-14 12:24:33', 3),
(173, '11', 'asdasdadasda', '2024-01-14 12:24:46', 3),
(174, '11', 'Hello', '2024-01-14 12:25:24', 3),
(175, '11', 'Hello hello', '2024-01-14 12:26:46', 3),
(176, '11', 'sdadsaa', '2024-01-14 12:42:40', 3),
(177, '11', 'asdasd', '2024-01-14 12:43:10', 3),
(178, '12', 'asdasda', '2024-01-14 12:43:18', 3),
(179, '12', 'asdasdasdaddada', '2024-01-14 12:43:33', 3),
(180, '12', 'sdadsad', '2024-01-14 12:44:05', 3),
(181, '12', 'asdadasas', '2024-01-14 12:44:07', 3),
(182, '11', 'dsdfdsfsf', '2024-01-14 12:46:12', 3),
(183, '11', 'asdadsd', '2024-01-14 12:47:53', 3),
(184, '11', 'asdasda', '2024-01-14 12:47:56', 3),
(185, '12', 'asdasdada', '2024-01-14 12:48:06', 3),
(186, '11', 'ddfdasfsdfs', '2024-01-14 12:51:22', 3),
(187, '11', 'Dawdadwaaw', '2024-01-14 12:53:13', 3),
(188, '11', 'dfsefsd', '2024-01-14 17:43:14', 3);

-- --------------------------------------------------------

--
-- Table structure for table `ship`
--

CREATE TABLE `ship` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ship`
--

INSERT INTO `ship` (`id`, `name`) VALUES
(1, 'Boost damage per second'),
(2, 'Upgrade damage dealt'),
(3, 'Upgrade critical hit chance'),
(4, 'Upgrade gold gained');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `redeemed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `login`, `password`, `admin`, `redeemed`) VALUES
(10, 'hello@mail.com', 'Hello', '$2a$10$0WrhDWNoA2IQL6J7aGOA2O3uYkz9Tc/eEjXjjumMtvhcGb.KIrBRW', 1, 0),
(38, 'qwe@mail.com', 'Qwe', '$2a$10$o2UDHmxjHvOUYii11OC1PewyNPO4BQPM5pz2B3xbFSfsrU/a.4gp.', 0, 0),
(39, 'zxc@mail.com', 'Zxc', '$2a$10$TiGg28nDMZ1CNnbOtfBULO35vYS7nD7y2cIPMYs795MzI5v0pCk9q', 0, 0),
(40, 'asd@mail.com', 'Asd', '$2a$10$AGbG521Shjbrnucrzy7hoO.1VG9iJJTLCcEqYN84ZbJcC8JLw.7LG', 0, 0),
(41, 'email@email.com', 'Email', '$2a$10$AM2slCmbSznH4b6CKjc8lOy/0CEtRH0ZilhSoFcex5AJYVTZWvANi', 0, 0),
(42, 'mail@mail.com', 'Mail', '$2a$10$aRRr77WrA0xAPovhpDSH4O04qVwskTP1tRAcfT76v9LcPOY3S8phW', 0, 0),
(43, 'gmail@gmail.com', 'Gmail', '$2a$10$Ic78L9BuplP0oapRcjYo0uRbA/bc72RcHRa332YaXtefBqBppaD9e', 0, 0),
(44, 'jan.kowalski@example.com', 'JanKowalski', '$2a$10$vs69WIZga7HX5PeFVs1mS.lXSTuywH0daEh94LcO4TiwRPrLx0fbO', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users_items`
--

CREATE TABLE `users_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `level` varchar(50) NOT NULL,
  `cost` varchar(50) NOT NULL,
  `damage` varchar(50) NOT NULL,
  `locked` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_items`
--

INSERT INTO `users_items` (`id`, `user_id`, `item_id`, `level`, `cost`, `damage`, `locked`) VALUES
(17, 10, 1, '6', '134', '6', 0),
(18, 10, 2, '0', '1000', '10', 1),
(19, 10, 3, '0', '2500', '100', 1),
(35, 38, 1, '75', '3883', '174', 0),
(36, 38, 2, '28', '3920', '599', 1),
(37, 38, 3, '15', '51973', '2258', 1),
(38, 39, 1, '45', '898', '109', 0),
(39, 39, 2, '6', '1340', '69', 1),
(40, 39, 3, '11', '42758', '1487', 1),
(41, 40, 1, '14', '197', '15', 0),
(42, 40, 2, '6', '1340', '69', 1),
(43, 40, 3, '6', '33502', '712', 1),
(44, 41, 1, '7', '140', '8', 0),
(45, 41, 2, '0', '1000', '0', 1),
(46, 41, 3, '0', '2500', '0', 1),
(47, 42, 1, '60', '1867', '339', 0),
(48, 42, 2, '0', '1000', '0', 1),
(49, 42, 3, '0', '2500', '0', 1),
(50, 43, 1, '0', '100', '0', 0),
(51, 43, 2, '0', '1000', '0', 1),
(52, 43, 3, '0', '2500', '0', 1),
(53, 44, 1, '0', '100', '0', 0),
(54, 44, 2, '0', '1000', '0', 1),
(55, 44, 3, '0', '2500', '0', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users_ship`
--

CREATE TABLE `users_ship` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ship_id` int(11) NOT NULL,
  `level` varchar(50) NOT NULL,
  `cost` varchar(50) NOT NULL,
  `multiplier` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_ship`
--

INSERT INTO `users_ship` (`id`, `user_id`, `ship_id`, `level`, `cost`, `multiplier`) VALUES
(2, 10, 2, '0', '10000', '1.00'),
(4, 10, 1, '0', '1000', '0.01'),
(5, 10, 3, '0', '50000', '1.00'),
(6, 10, 4, '0', '50000', '1.00'),
(23, 38, 1, '175', '5106547', '1.76'),
(24, 38, 2, '33', '50031', '1.33'),
(25, 38, 3, '19', '252695', '2.9'),
(26, 38, 4, '11', '85516', '1.11'),
(27, 39, 1, '57', '16135', '1.15'),
(28, 39, 2, '114', '2603634', '2.14'),
(29, 39, 3, '99', '6261964', '1.99'),
(30, 39, 4, '1', '52500', '1.01'),
(31, 40, 1, '29', '4116', '0.59'),
(32, 40, 2, '27', '37334', '1.54'),
(33, 40, 3, '63', '2162349', '7.3'),
(34, 40, 4, '124', '42410469', '3.48'),
(35, 41, 1, '0', '1000', '0.01'),
(36, 41, 2, '0', '10000', '1.00'),
(37, 41, 3, '0', '50000', '1.00'),
(38, 41, 4, '0', '50000', '1.00'),
(39, 42, 1, '39', '6704', '0.79'),
(40, 42, 2, '0', '10000', '1.00'),
(41, 42, 3, '0', '50000', '1.00'),
(42, 42, 4, '0', '50000', '1.00'),
(43, 43, 1, '0', '1000', '0.01'),
(44, 43, 2, '0', '10000', '1.00'),
(45, 43, 3, '0', '50000', '1.00'),
(46, 43, 4, '0', '50000', '1.00'),
(47, 44, 1, '0', '1000', '0.01'),
(48, 44, 2, '0', '10000', '1.00'),
(49, 44, 3, '0', '50000', '1.00'),
(50, 44, 4, '0', '50000', '1.00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `guilds`
--
ALTER TABLE `guilds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guild_members`
--
ALTER TABLE `guild_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guild_id` (`guild_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ship`
--
ALTER TABLE `ship`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_items`
--
ALTER TABLE `users_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users_ship`
--
ALTER TABLE `users_ship`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ship_id` (`ship_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `guilds`
--
ALTER TABLE `guilds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `guild_members`
--
ALTER TABLE `guild_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT for table `ship`
--
ALTER TABLE `ship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `users_items`
--
ALTER TABLE `users_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users_ship`
--
ALTER TABLE `users_ship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `game_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `guild_members`
--
ALTER TABLE `guild_members`
  ADD CONSTRAINT `guild_members_ibfk_1` FOREIGN KEY (`id`) REFERENCES `guilds` (`guild_members_id`);

--
-- Constraints for table `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`),
  ADD CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users_items`
--
ALTER TABLE `users_items`
  ADD CONSTRAINT `users_items_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  ADD CONSTRAINT `users_items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users_ship`
--
ALTER TABLE `users_ship`
  ADD CONSTRAINT `users_ship_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `users_ship_ibfk_2` FOREIGN KEY (`ship_id`) REFERENCES `ship` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
