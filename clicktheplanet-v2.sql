-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2024 at 04:57 PM
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
(10, 10, '123123341', '110', '1', '1', 0, 0, '10', '10', '1', '0', '0.3', NULL),
(11, 11, '361124016076', '210', '116', '116', 4, 4, '40368', '40368', '34151', '1', '0.1', 3),
(12, 12, '100', '100', '21', '21', 6, 6, '1323', '1323', '100', '100', '0.01', 3),
(33, 26, '100', '101', '1', '1', 0, 0, '10', '10', '1', '0', '0.01', NULL),
(34, 31, '106', '103', '4', '4', 7, 7, '48', '48', '5', '0', '0.01', NULL),
(35, 32, '100', '101', '1', '1', 0, 0, '10', '10', '1', '0', '0.01', NULL),
(36, 33, '100', '101', '1', '1', 0, 0, '10', '10', '1', '0', '0.01', NULL);

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

--
-- Dumping data for table `guilds`
--

INSERT INTO `guilds` (`id`, `name`, `owner`, `guild_members_id`) VALUES
(3, 'Galaxy conquerors', 11, 3),
(4, 'Clickers', 10, 4);

-- --------------------------------------------------------

--
-- Table structure for table `guild_members`
--

CREATE TABLE `guild_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `guild_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guild_members`
--

INSERT INTO `guild_members` (`id`, `user_id`, `guild_id`) VALUES
(3, 11, 3),
(4, 11, 3);

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` int(11) NOT NULL,
  `guild_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invitations`
--

INSERT INTO `invitations` (`id`, `guild_id`, `user_id`) VALUES
(6, 4, 12),
(8, 4, 11);

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
(11, 'qwe@mail.com', 'Qwe', '$2a$10$lINez2/4OXVjAVtY5Ajr/uw/S5vaIPGq.JCPq6Hki0SkmIbXSblRC', 0, 0),
(12, 'moststrongestpotato@mail.com', 'MostStrongestPotato', '$2a$10$MSNS3Qq8/744On2MeolpTOyu6fvCnxIS3A8BNVMBNpJ8.i/koUEW.', 0, 0),
(26, 'gmail@gmail.com', 'Gmail', '$2a$10$Kc4fI8HLIflZBwYvNvMo4e9EX.kJrOJPFDJBgqtc4iKvBT1ShyE3S', 0, 0),
(31, 'email@email.com', 'Email', '$2a$10$Yu8A32JQoVOD2sV.5JhK.u3mX8XszXdw55mIB4YpYLG45eOrhxdRG', 0, 0),
(32, 'mail@mail.com', 'Mail', '$2a$10$O1ToRAgAsqdzXGWJaD9TAOOsqqpZgSig/G5sFtzyd/uy7t8dFt6sy', 0, 0),
(33, 'asd@asd.com', 'Asd', '$2a$10$mR1XnD.lZSL5FfqZZvV.hu.rFV3SxcQ0xYHCWwNHXzdqqAjKgvFay', 0, 0);

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
(1, 11, 1, '46', '943', '127', 0),
(2, 11, 2, '35', '5516', '942', 0),
(3, 11, 3, '16', '54571', '2576', 1),
(4, 12, 1, '1', '100', '1', 0),
(5, 12, 2, '0', '500', '1', 1),
(6, 12, 3, '0', '2500', '1', 1),
(8, 26, 1, '0', '100', '1', 0),
(9, 26, 2, '0', '1000', '10', 1),
(10, 26, 3, '0', '2500', '100', 1),
(11, 31, 1, '2', '110', '2', 0),
(12, 31, 2, '0', '1000', '10', 1),
(13, 31, 3, '0', '2500', '100', 1),
(14, 32, 1, '0', '100', '1', 0),
(15, 32, 2, '0', '1000', '10', 1),
(16, 32, 3, '0', '2500', '100', 1),
(17, 10, 1, '0', '100', '1', 0),
(18, 10, 2, '0', '1000', '10', 1),
(19, 10, 3, '0', '2500', '100', 1),
(20, 33, 1, '0', '100', '1', 0),
(21, 33, 2, '0', '1000', '10', 1),
(22, 33, 3, '0', '2500', '100', 1);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `guild_members_id` (`guild_members_id`);

--
-- Indexes for table `guild_members`
--
ALTER TABLE `guild_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guild_id` (`guild_id`),
  ADD KEY `user_id` (`user_id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `users_items`
--
ALTER TABLE `users_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `game_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `guilds`
--
ALTER TABLE `guilds`
  ADD CONSTRAINT `guilds_ibfk_1` FOREIGN KEY (`guild_members_id`) REFERENCES `guild_members` (`id`);

--
-- Constraints for table `guild_members`
--
ALTER TABLE `guild_members`
  ADD CONSTRAINT `guild_members_ibfk_1` FOREIGN KEY (`id`) REFERENCES `guilds` (`guild_members_id`),
  ADD CONSTRAINT `guild_members_ibfk_2` FOREIGN KEY (`guild_id`) REFERENCES `guilds` (`id`),
  ADD CONSTRAINT `guild_members_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
