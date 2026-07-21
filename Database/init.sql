CREATE DATABASE IF NOT EXISTS PortfolioDB;
USE PortfolioDB;

CREATE TABLE IF NOT EXISTS Admins (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Profiles (
    Id INT PRIMARY KEY DEFAULT 1,
    FullName VARCHAR(100) DEFAULT '',
    FullNameAr VARCHAR(100) DEFAULT '',
    JobTitle VARCHAR(200) DEFAULT '',
    JobTitleAr VARCHAR(200) DEFAULT '',
    Bio TEXT,
    BioAr TEXT,
    PhotoUrl VARCHAR(500) DEFAULT '',
    ResumeUrl VARCHAR(500) DEFAULT '',
    Email VARCHAR(200) DEFAULT '',
    Phone VARCHAR(50) DEFAULT '',
    Location VARCHAR(200) DEFAULT '',
    LocationAr VARCHAR(200) DEFAULT '',
    HeroEffect ENUM('Parallax','Hologram','3DPlane') DEFAULT 'Parallax',
    ThemeColor VARCHAR(20) DEFAULT '#6366f1',
    StatsProjects INT DEFAULT 0,
    StatsExperience INT DEFAULT 0,
    StatsClients INT DEFAULT 0,
    StatsAwards INT DEFAULT 0,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SocialLinks (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Platform VARCHAR(50) NOT NULL,
    Url VARCHAR(500) NOT NULL,
    Icon VARCHAR(50) DEFAULT '',
    SortOrder INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Skills (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    NameAr VARCHAR(100) DEFAULT '',
    Category VARCHAR(50) DEFAULT 'Technical',
    CategoryAr VARCHAR(50) DEFAULT '',
    Percentage INT DEFAULT 0,
    SortOrder INT DEFAULT 0,
    Type VARCHAR(20) DEFAULT 'Design'
);

CREATE TABLE IF NOT EXISTS Experiences (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    TitleAr VARCHAR(200) DEFAULT '',
    Company VARCHAR(200) DEFAULT '',
    CompanyAr VARCHAR(200) DEFAULT '',
    Period VARCHAR(100) DEFAULT '',
    Description TEXT,
    DescriptionAr TEXT,
    SortOrder INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Educations (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Degree VARCHAR(200) NOT NULL,
    DegreeAr VARCHAR(200) DEFAULT '',
    Institution VARCHAR(200) DEFAULT '',
    InstitutionAr VARCHAR(200) DEFAULT '',
    Period VARCHAR(100) DEFAULT '',
    Description TEXT,
    DescriptionAr TEXT,
    SortOrder INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Certifications (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    NameAr VARCHAR(200) DEFAULT '',
    Issuer VARCHAR(200) DEFAULT '',
    IssuerAr VARCHAR(200) DEFAULT '',
    IssueDate VARCHAR(50) DEFAULT '',
    ExpiryDate VARCHAR(50) DEFAULT '',
    CredentialUrl VARCHAR(500) DEFAULT '',
    LogoUrl VARCHAR(500) DEFAULT '',
    ImageUrl1 VARCHAR(500) DEFAULT '',
    ImageUrl2 VARCHAR(500) DEFAULT '',
    ImageUrl3 VARCHAR(500) DEFAULT '',
    Category VARCHAR(50) DEFAULT 'Technical',
    CategoryAr VARCHAR(50) DEFAULT '',
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Projects (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    TitleAr VARCHAR(200) DEFAULT '',
    Description TEXT,
    DescriptionAr TEXT,
    Type ENUM('Design','Code') NOT NULL DEFAULT 'Design',
    Category VARCHAR(100) DEFAULT '',
    TechStack VARCHAR(500) DEFAULT '',
    LiveUrl VARCHAR(500) DEFAULT '',
    Problem TEXT,
    ProblemAr TEXT,
    Solution TEXT,
    SolutionAr TEXT,
    Role TEXT,
    RoleAr TEXT,
    Impact TEXT,
    ImpactAr TEXT,
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Media (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProjectId INT NOT NULL,
    MediaType ENUM('Image','3DModel') NOT NULL,
    Url VARCHAR(500) NOT NULL,
    FileName VARCHAR(255),
    IsPrimary BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BlogPosts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(300) NOT NULL,
    TitleAr VARCHAR(300) DEFAULT '',
    Slug VARCHAR(300) NOT NULL UNIQUE,
    Content TEXT,
    ContentAr TEXT,
    Excerpt VARCHAR(500) DEFAULT '',
    ExcerptAr VARCHAR(500) DEFAULT '',
    CoverImageUrl VARCHAR(500) DEFAULT '',
    Author VARCHAR(200) DEFAULT '',
    Tags VARCHAR(500) DEFAULT '',
    Published BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Testimonials (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ClientName VARCHAR(100) NOT NULL,
    ClientNameAr VARCHAR(100) DEFAULT '',
    ClientTitle VARCHAR(200) DEFAULT '',
    ClientTitleAr VARCHAR(200) DEFAULT '',
    Content TEXT,
    ContentAr TEXT,
    Rating INT DEFAULT 5,
    AvatarUrl VARCHAR(500) DEFAULT '',
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Messages (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(200) NOT NULL,
    Subject VARCHAR(300) DEFAULT '',
    Message TEXT NOT NULL,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Visitors (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IpAddress VARCHAR(50) DEFAULT '',
    UserAgent VARCHAR(500) DEFAULT '',
    Page VARCHAR(200) DEFAULT '/',
    VisitedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS SiteSettings (
    SettingKey VARCHAR(100) PRIMARY KEY,
    SettingValue TEXT
);

INSERT IGNORE INTO Profiles (Id, FullName, FullNameAr, JobTitle, JobTitleAr, Bio, BioAr, Email, Phone, Location, StatsProjects, StatsExperience, StatsClients, StatsAwards) VALUES
(1, 'Asil Al-Aziz Al-Rumaili', 'أصيل العزي محمد الرميلي', 'Graphic Designer & Digital Creative', 'مصمم جرافيك وإبداعي رقمي', 'Crafting visual experiences that bridge creativity with strategic design. Specializing in brand identity, digital illustration, and creative direction for forward-thinking brands.', 'أصنع تجارب بصرية تجمع بين الإبداع والتصميم الاستراتيجي. متخصص في الهوية البصرية والتوضيح الرقمي والتوجيه الإبداعي للعلامات التجارية.', 'asil.rumaili@example.com', '+966 55 XXX XXXX', 'Riyadh, KSA', 30, 3, 25, 5);

INSERT IGNORE INTO SocialLinks (Platform, Url, Icon, SortOrder) VALUES
('LinkedIn', 'https://linkedin.com/in/asil-rumaili', 'linkedin', 1),
('GitHub', 'https://github.com/asil-rumaili', 'github', 2);

INSERT IGNORE INTO Skills (Name, Category, Percentage, SortOrder) VALUES
('Adobe Photoshop', 'Design', 95, 1),
('Adobe Illustrator', 'Design', 92, 2),
('Figma', 'Design', 90, 3),
('Brand Identity', 'Design', 88, 4),
('UI/UX Design', 'Design', 85, 5),
('Motion Graphics', 'Design', 80, 6);

INSERT IGNORE INTO Certifications (Name, Issuer, IssueDate, Category) VALUES
('Adobe Certified Professional (ACP)', 'Adobe', '2024-01', 'Technical'),
('Google UX Design Certificate', 'Google/Coursera', '2023-06', 'Technical'),
('Meta Social Media Marketing', 'Meta', '2023-09', 'Technical'),
('High School Diploma', 'Al-Rumaili School', '2021', 'Academic');

INSERT IGNORE INTO Testimonials (ClientName, ClientTitle, Content, Rating, SortOrder) VALUES
('Khalid Al-Fahad', 'Marketing Director at BrandCo', 'Exceptional creative vision and attention to detail. Asil transformed our brand identity completely.', 5, 1),
('Nora Al-Saud', 'CEO at StyleHub', 'Incredible design sense and professional delivery. Highly recommended for any creative project.', 5, 2),
('Omar Bin Laden', 'Startup Founder', 'Creative, fast, and reliable. The best designer we have worked with.', 4, 3);

INSERT IGNORE INTO BlogPosts (Title, TitleAr, Slug) VALUES
('The Power of Brand Identity', 'قوة الهوية البصرية', 'power-of-brand-identity'),
('Design Principles for Modern Brands', 'مبادئ التصميم للعلامات الحديثة', 'design-principles-modern-brands');

INSERT IGNORE INTO Projects (Title, Type, Category, Description, TechStack, SortOrder) VALUES
('Royal Heritage Branding', 'Design', 'Branding', 'Complete brand identity for a luxury heritage brand', 'Figma, Illustrator, Photoshop', 1),
('Digital Art Exhibition', 'Design', 'Illustration', 'Curated digital art series for an international exhibition', 'Procreate, Photoshop', 2),
('E-Commerce Redesign', 'Design', 'Web', 'Modern e-commerce UI/UX redesign', 'Figma, Adobe XD', 3);

INSERT IGNORE INTO SiteSettings (SettingKey, SettingValue) VALUES
('site_title', 'Asil Al-Rumaili Portfolio'),
('site_subtitle', 'Graphic Designer & Digital Creative');

ALTER TABLE BlogPosts ADD COLUMN IF NOT EXISTS Author VARCHAR(200) DEFAULT '' AFTER CoverImageUrl;
ALTER TABLE BlogPosts ADD COLUMN IF NOT EXISTS Tags VARCHAR(500) DEFAULT '' AFTER Author;

ALTER TABLE Skills ADD COLUMN IF NOT EXISTS Type VARCHAR(20) DEFAULT 'Design' AFTER SortOrder;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS Problem TEXT AFTER LiveUrl;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS ProblemAr TEXT AFTER Problem;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS Solution TEXT AFTER ProblemAr;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS SolutionAr TEXT AFTER Solution;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS Role TEXT AFTER SolutionAr;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS RoleAr TEXT AFTER Role;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS Impact TEXT AFTER RoleAr;
ALTER TABLE Projects ADD COLUMN IF NOT EXISTS ImpactAr TEXT AFTER Impact;