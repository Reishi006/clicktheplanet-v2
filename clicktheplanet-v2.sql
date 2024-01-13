-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2024 at 07:01 PM
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
  `gold` varchar(50) NOT NULL,
  `diamonds` varchar(50) NOT NULL,
  `currentlevel` varchar(50) NOT NULL,
  `maxlevel` varchar(50) NOT NULL,
  `currentstage` int(2) NOT NULL,
  `maxstage` int(2) NOT NULL,
  `currentdamage` varchar(50) NOT NULL,
  `totaldamage` varchar(50) NOT NULL,
  `guild_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`id`, `gold`, `diamonds`, `currentlevel`, `maxlevel`, `currentstage`, `maxstage`, `currentdamage`, `totaldamage`, `guild_id`) VALUES
(10, '420', '999', '1', '1', 9, 0, '', '', 0),
(11, '2137', '120', '210', '212', 1, 6, '100000', '1337', 3),
(12, '100', '100', '20', '20', 6, 6, '', '', 3);

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
(3, 11, 3);

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
(1, 3, 12);

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
(104, '11', 'Hello world, no socket rooms yet! :[', '2024-01-12 18:48:51', 3);

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
  `game_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `login`, `password`, `admin`, `game_id`) VALUES
(10, 'hello@mail.com', 'Hello', '$2a$10$0WrhDWNoA2IQL6J7aGOA2O3uYkz9Tc/eEjXjjumMtvhcGb.KIrBRW', 1, 10),
(11, 'qwe@mail.com', 'Qwe', '$2a$10$lINez2/4OXVjAVtY5Ajr/uw/S5vaIPGq.JCPq6Hki0SkmIbXSblRC', 0, 11),
(12, 'moststrongestpotato@mail.com', 'MostStrongestPotato', '$2a$10$MSNS3Qq8/744On2MeolpTOyu6fvCnxIS3A8BNVMBNpJ8.i/koUEW.', 0, 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `guilds`
--
ALTER TABLE `guilds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `guild_members`
--
ALTER TABLE `guild_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
