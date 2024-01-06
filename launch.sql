create database RAP_AI;
USE RAP_AI;
CREATE TABLE User
(
  user_id INT NOT NULL AUTO_INCREMENT COMMENT 'User id',
  user_name VARCHAR(50) NOT NULL COMMENT 'user_name dung de dang nhap',
  password VARCHAR(255) NOT NULL COMMENT 'password cua user',
  email VARCHAR(255) NOT NULL COMMENT 'email cua user',
  day_of_birth DATE NOT NULL COMMENT 'ngay sinh cua user',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trang thai cua user: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  full_name NVARCHAR(50) NOT NULL COMMENT 'ten day du cua nguoi dung',
  phone_number CHAR(10) NOT NULL COMMENT 'so dien thoai cua nguoi dungf',
  PRIMARY KEY (user_id, user_name)
);
ALTER TABLE User AUTO_INCREMENT=1000;

CREATE TABLE Menu
(
  menu_id INT NOT NULL AUTO_INCREMENT COMMENT 'menu id',
  menu_name NVARCHAR(50) NOT NULL COMMENT 'ten menu',
  menu_path NVARCHAR(255) NOT NULL COMMENT 'duong dan cua menu',
  pid CHAR(10) NOT NULL COMMENT 'path id',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trag thai: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  PRIMARY KEY (menu_id)
);

CREATE TABLE Role
(
  role_id INT NOT NULL AUTO_INCREMENT COMMENT 'role id',
  role_name VARCHAR(10) NOT NULL COMMENT 'ten role',
  role_description VARCHAR(100) NOT NULL COMMENT 'mo ta cua role',
  PRIMARY KEY (role_id)
);

CREATE TABLE Report
(
  report_id INT NOT NULL AUTO_INCREMENT COMMENT 'report id',
  title VARCHAR(255) NOT NULL COMMENT 'tile cua report',
  description LONGTEXT NOT NULL COMMENT 'mo ta trong report',
  location LONGTEXT NOT NULL COMMENT 'luu lai dia diem report cua user',
  report_time DATETIME NOT NULL COMMENT 'thoi gian nguoi dung report',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trag thai: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  PRIMARY KEY (report_id)
);

CREATE TABLE Conservation_Status
(
  conservation_status_id INT NOT NULL AUTO_INCREMENT COMMENT 'id tinh trang bao ton',
  status_name VARCHAR(50) NOT NULL COMMENT 'tinhf trang bao ton',
  stand_name CHAR(2) NOT NULL COMMENT 'viet tat cua tinh trang bao ton',
  description VARCHAR(255) NOT NULL COMMENT 'mo ta cua tinh trang bao ton',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trag thai: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  PRIMARY KEY (conservation_status_id)
);

CREATE TABLE Animal_Types
(
  animal_type_id INT NOT NULL AUTO_INCREMENT COMMENT 'loai dong vat id',
  type_name VARCHAR(50) NOT NULL COMMENT 'ten loài động vật',
  description VARCHAR(255) NOT NULL COMMENT 'mô tả loài động vật',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trag thai: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  PRIMARY KEY (animal_type_id)
);

CREATE TABLE Menu_Role
(
  menu_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (menu_id, role_id),
  FOREIGN KEY (menu_id) REFERENCES Menu(menu_id),
  FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE User_Role
(
  role_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (role_id, user_id),
  FOREIGN KEY (role_id) REFERENCES Role(role_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE User_Report
(
  action VARCHAR(10) NOT NULL,
  handle_time DATETIME NOT NULL COMMENT 'thời gian xử lý báo cáo',
  user_id INT NOT NULL COMMENT 'xử lý bởi user nào',
  report_id INT NOT NULL COMMENT 'xử lý báo cáo nào',
  PRIMARY KEY (user_id, report_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (report_id) REFERENCES Report(report_id)
);

CREATE TABLE Animal_Red_List
(
  animal_red_list_id INT NOT NULL COMMENT 'id sách đỏ',
  vn_name VARCHAR(50) NOT NULL COMMENT 'tên đông vật tiếng Việt',
  en_name VARCHAR(50) NOT NULL COMMENT 'tên động vật tiếng Anh',
  sc_name VARCHAR(100) NOT NULL COMMENT 'tên khoa học của động vật',
  animal_infor LONGTEXT NOT NULL COMMENT 'thông tin động vật',
  status ENUM('OK', 'WT', 'XX') NOT NULL DEFAULT 'OK' COMMENT 'trag thai: [OK]-binh thuong, [XX]-da bi xoa, [WT]-bi block',
  animal_type_id INT NOT NULL,
  conservation_status_id INT NOT NULL,
  PRIMARY KEY (animal_red_list_id),
  FOREIGN KEY (animal_type_id) REFERENCES Animal_Types(animal_type_id),
  FOREIGN KEY (conservation_status_id) REFERENCES Conservation_Status(conservation_status_id)
);

CREATE TABLE Image
(
  image_id INT NOT NULL COMMENT 'id cua anh',
  image_local_path LONGTEXT NOT NULL COMMENT 'duong dan anh trong may',
  image_public_path LONGTEXT NOT NULL COMMENT 'duong dan anh tren cloud',
  description NVARCHAR(255) NOT NULL COMMENT 'mo ta cua anh',
  image_type CHAR(3) NOT NULL COMMENT 'kieu anh: [AVT]-ảnh đại diện, [RPT]-ảnh của báo cáo, [AIC]-ảnh gửi vào hệ thống kiểm tra, [SYS]-ảnh hệ thống',
  status CHAR(2) NOT NULL COMMENT 'trag thai: [OK]-được chấp nhận, [XX]-da bi xoa, [WT]-đang chờ xử lý',
  animal_red_list_id INT,
  user_id INT NOT NULL,
  report_id INT,
  PRIMARY KEY (image_id),
  FOREIGN KEY (animal_red_list_id) REFERENCES Animal_Red_List(animal_red_list_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (report_id) REFERENCES Report(report_id)
);

CREATE TABLE History_Watch
(
  watch_time DATE NOT NULL COMMENT 'Thoi gian tra cuu',
  search_type CHAR(3) NOT NULL COMMENT 'loại tra cứu: [AIC]: nhận dạng AI, [SER]-tìm kiếm',
  ratio_search FLOAT COMMENT 'tỉ lệ nhận dạng',
  user_id INT NOT NULL COMMENT 'người tra cứu',
  animal_red_list_id INT NOT NULL COMMENT 'tra cứu động vật nào',
  PRIMARY KEY (user_id, animal_red_list_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (animal_red_list_id) REFERENCES Animal_Red_List(animal_red_list_id)
);

#---------------------------------------------------------------
#Insert role
INSERT INTO role(role_name, role_description) VALUES ('admin', 'Quyền quản trị');
INSERT INTO role(role_name, role_description) VALUES ('officer', 'Quyền của cán bộ quản lý');
INSERT INTO role(role_name, role_description) VALUES ('user', 'Người dùng');

#Insert user
INSERT INTO User(user_name, password, email, day_of_birth, full_name, phone_number) 
	VALUES ('rap_admin', '$2y$10$puQr8d.yG9oT1Tktj6MQ8OcyrMFkxVV5kXKjVQ813kn4T0G24cdNi', 'admin@rap-ai.asia', '2024-01-05', 'Admin', '9999999999');
INSERT INTO user_role VALUES (1,1000);    

#Insert menu
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("CRUD user", "/crud_user", "01");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("Red list", "/redList", "02");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("edit red list", "/editRedList", "03");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("add red list", "/addRedList", "04");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("report", "/report", "05");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("search", "/search", "05");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("history", "/history", "06");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("news", "/news", "07");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("review report", "/reviewReport", "08");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("accept report", "/acceptReport", "09");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("demiss report", "/demissReport", "10");
INSERT INTO menu(menu_name, menu_path, pid) VALUES ("re-training", "/reTrainning", "11");