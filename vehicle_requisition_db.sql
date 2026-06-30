-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2026 at 08:17 AM
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
  `ticket_copy` varchar(500) DEFAULT NULL,
  `journey_by` varchar(255) NOT NULL,
  `vehicle_required_date` datetime NOT NULL,
  `vehicle_required_at` text NOT NULL,
  `expected_return_time` datetime NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `hod_signature` varchar(500) DEFAULT NULL,
  `hod_remarks` text DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requisitions`
--

INSERT INTO `requisitions` (`id`, `employee_name`, `employee_no`, `designation`, `vehicle_required_for`, `from_station`, `to_station`, `pnr_number`, `ticket_copy`, `journey_by`, `vehicle_required_date`, `vehicle_required_at`, `expected_return_time`, `status`, `hod_signature`, `hod_remarks`, `approved_at`, `created_by`, `created_at`) VALUES
(11, 'eins', '1001', 'Engineer', 'fff', 'oiiaasdjoi', 'oiijlkdfj', 'lklk652', NULL, 'kook,o', '2026-06-25 09:52:00', 'ddgt', '2026-06-26 09:52:00', 'approved', '/uploads/1780999771137-ntpc-logo.png', NULL, '2026-06-09 10:09:31', 23, '2026-06-09 09:52:24'),
(12, 'Vier', '4004', 'hd', 'doil', 'oifko', 'okfio', '5554', NULL, 'jdh', '2026-06-17 09:58:00', 'dda', '2026-06-26 09:58:00', 'approved', NULL, NULL, '2026-06-09 10:06:33', 25, '2026-06-09 09:59:00'),
(13, 'Vier', '4004', 'm,kl', 'fff', 'oiiaasdjoi', 'oiijlkdfj', 'lklk652', NULL, 'kook,o', '2026-06-11 05:14:00', 'ddgt', '2026-06-10 21:17:00', 'approved', NULL, NULL, '2026-06-10 05:15:13', 25, '2026-06-10 05:14:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `employee_id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','hod') DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp(),
  `department` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `employee_id`, `email`, `password`, `role`, `created_at`, `department`) VALUES
(22, 'Null', '0000', 'null@gmail.com', '$2b$10$tlnqMA3irH/l7m58lYSpf.cBRaBA6ZdIsELj4pD9xmt.NnvRePBJC', 'admin', '2026-06-09 09:46:41', 'HR'),
(23, 'eins', '1001', 'eins@gmail.com', '$2b$10$a18fRwUxKNQ4RybXqf8ti.zGuzIoSsHxVdWFjgnCXXA.D88fQww9C', 'user', '2026-06-09 09:47:50', 'IT'),
(24, 'Drei', '2002', 'drei@gmail.com', '$2b$10$ykoC/xCZPGxW3fw01kJzVuIz9pel3BQELXaozkYC0ri9wSvb3QL5i', 'hod', '2026-06-09 09:51:41', 'IT'),
(25, 'Vier', '4004', 'vier@gmail.com', '$2b$10$98jBQw6TOaGKZ5dI5elGA.C11JR/Ew2v0Mrs/v6i8nij1PxZCy2R2', 'user', '2026-06-09 09:55:21', 'HR'),
(26, 'Funf', '5005', 'funf@gmail.com', '$2b$10$OzxKu58fuOLLiaV7TuogP.bJS/6HXjzIl4f1PGA8EZlyOXPkn/Rk.', 'hod', '2026-06-09 09:56:33', 'HR');

--
-- Indexes for dumped tables
--

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
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `requisitions`
--
ALTER TABLE `requisitions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `requisitions`
--
ALTER TABLE `requisitions`
  ADD CONSTRAINT `requisitions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
