CREATE TABLE IF NOT EXISTS `BlogComments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BlogPostId` int NOT NULL,
  `AuthorName` varchar(255) NOT NULL,
  `AuthorEmail` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `IsApproved` tinyint(1) NOT NULL DEFAULT 0,
  `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`Id`),
  KEY `IX_BlogComments_BlogPostId` (`BlogPostId`),
  CONSTRAINT `FK_BlogComments_BlogPosts_BlogPostId` FOREIGN KEY (`BlogPostId`) REFERENCES `BlogPosts` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
