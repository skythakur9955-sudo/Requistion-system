-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2026 at 10:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vehicle_requisition_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `otp`, `expires_at`, `is_used`, `created_at`) VALUES
(9, 'vormir8384@gmail.com', '040555db84ee3d7591c81f9749de8d654caa158851594916de14d0fccc161173', '192578', '2026-06-09 08:05:14', 1, '2026-06-09 07:55:15'),
(16, 'skythakur9955@gmail.com', '0fcdcb7c8ae11d7ad923e192dc25bc1cc376dee8b0d7ec6e28f59a3e41837a80', '426590', '2026-06-09 10:07:13', 1, '2026-06-09 09:57:13'),
(17, 'skythakur9955@gmail.com', 'f6bf195f2c7402f68985cd6f0ad80ce9332eeb47a86b50443a12e0917863402f', '679520', '2026-06-09 10:41:44', 1, '2026-06-09 10:31:44'),
(18, 'vormir8384@gmail.com', '294ecc5b8ca168a41f4788724e3ecd1dc6635cc0ebc2fa9a040451c093a59c87', '909925', '2026-06-09 10:49:51', 1, '2026-06-09 10:39:51'),
(19, 'timmusk92@gmail.com', '7dcd4bf03f5f0854a1874de18db433622b38e574c4131ec6c546f8a1fd1461c7', '665577', '2026-06-09 10:55:34', 1, '2026-06-09 10:45:34');

-- --------------------------------------------------------

--
-- Table structure for table `requisitions`
--

CREATE TABLE `requisitions` (
  `id` int(11) NOT NULL,
  `employee_name` varchar(255) NOT NULL,
  `employee_no` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `vehicle_required_for` text NOT NULL,
  `from_station` varchar(255) NOT NULL,
  `to_station` varchar(255) NOT NULL,
  `pnr_number` varchar(255) NOT NULL,
  `ticket_copy` varchar(255) DEFAULT NULL,
  `journey_by` varchar(255) NOT NULL,
  `vehicle_required_date` datetime NOT NULL,
  `vehicle_required_at` text NOT NULL,
  `expected_return_time` datetime NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `hod_signature` varchar(255) DEFAULT NULL,
  `hod_remarks` text DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requisitions`
--

INSERT INTO `requisitions` (`id`, `employee_name`, `employee_no`, `designation`, `vehicle_required_for`, `from_station`, `to_station`, `pnr_number`, `ticket_copy`, `journey_by`, `vehicle_required_date`, `vehicle_required_at`, `expected_return_time`, `status`, `hod_signature`, `hod_remarks`, `approved_at`, `created_by`, `created_at`) VALUES
(8, 'elf', '11011', 'jr enginer', 'kd', 'dkd', 'jdd', '6445', NULL, '788', '2026-06-12 06:35:00', 'vvj', '2026-06-19 06:36:00', 'pending', NULL, NULL, NULL, 16, '2026-06-10 06:36:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `designation` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','hod') DEFAULT 'user',
  `created_at` datetime DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `employee_id`, `designation`, `email`, `password`, `role`, `created_at`, `department`) VALUES
(14, 'badal', '1004', '', 'vormir8384@gmail.com', '$2b$10$w2QU1JaDv3F52WOksgSssexfQJdCJ3xAlcoij2rTKmktIGbe3Om7O', 'admin', '2026-06-10 06:29:11', 'it'),
(16, 'elf', '11011', '', 'elf@gmail.com', '$2b$10$EfQqHJvAxoYcgAq35Un8muYe1/c/fKD0fCKjl32tfKL0jU6S3ANFO', 'user', '2026-06-10 06:35:10', 'IT'),
(17, 'Null', '0000', '', 'tinkukumar9124@gmail.com', '$2b$10$NGXl/T8ePqE3IAcgrlbWNeGQ9S6FArqJlTBo1uWI79cHMtMIwQyhW', 'hod', '2026-06-10 06:45:24', 'IT'),
(18, 'Zweri', '2002', '', 'zweri9124@gmail.com', '$2b$10$8n2/VGbBR7Mcv7ydxza/kOomth10Ia84o2iI9/YADc5.d7SIH5hZq', 'user', '2026-06-10 06:48:58', 'HR');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `token` (`token`);

--
-- Indexes for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `employee_id_2` (`employee_id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `employee_id_3` (`employee_id`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `employee_id_4` (`employee_id`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `employee_id_5` (`employee_id`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `employee_id_6` (`employee_id`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `employee_id_7` (`employee_id`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `employee_id_8` (`employee_id`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `employee_id_9` (`employee_id`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `employee_id_10` (`employee_id`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `employee_id_11` (`employee_id`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `employee_id_12` (`employee_id`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `employee_id_13` (`employee_id`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `employee_id_14` (`employee_id`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `employee_id_15` (`employee_id`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `employee_id_16` (`employee_id`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `employee_id_17` (`employee_id`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `employee_id_18` (`employee_id`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `employee_id_19` (`employee_id`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `employee_id_20` (`employee_id`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `employee_id_21` (`employee_id`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `employee_id_22` (`employee_id`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `employee_id_23` (`employee_id`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `employee_id_24` (`employee_id`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `employee_id_25` (`employee_id`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `employee_id_26` (`employee_id`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `employee_id_27` (`employee_id`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `employee_id_28` (`employee_id`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `employee_id_29` (`employee_id`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `employee_id_30` (`employee_id`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `employee_id_31` (`employee_id`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `employee_id_32` (`employee_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `requisitions`
--
ALTER TABLE `requisitions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD CONSTRAINT `requisitions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
