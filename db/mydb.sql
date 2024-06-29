/*
 Navicat Premium Data Transfer

 Source Server         : phpmyadmin
 Source Server Type    : MySQL
 Source Server Version : 80037
 Source Host           : localhost:3306
 Source Schema         : mydb

 Target Server Type    : MySQL
 Target Server Version : 80037
 File Encoding         : 65001

 Date: 29/06/2024 18:19:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group
-- ----------------------------

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq`(`group_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq`(`content_type_id` ASC, `codename` ASC) USING BTREE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO `auth_permission` VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO `auth_permission` VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO `auth_permission` VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO `auth_permission` VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO `auth_permission` VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO `auth_permission` VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO `auth_permission` VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO `auth_permission` VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO `auth_permission` VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO `auth_permission` VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO `auth_permission` VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO `auth_permission` VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO `auth_permission` VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO `auth_permission` VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO `auth_permission` VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO `auth_permission` VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO `auth_permission` VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO `auth_permission` VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO `auth_permission` VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO `auth_permission` VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO `auth_permission` VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO `auth_permission` VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO `auth_permission` VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO `auth_permission` VALUES (25, 'Can add Token', 7, 'add_token');
INSERT INTO `auth_permission` VALUES (26, 'Can change Token', 7, 'change_token');
INSERT INTO `auth_permission` VALUES (27, 'Can delete Token', 7, 'delete_token');
INSERT INTO `auth_permission` VALUES (28, 'Can view Token', 7, 'view_token');
INSERT INTO `auth_permission` VALUES (29, 'Can add Token', 8, 'add_tokenproxy');
INSERT INTO `auth_permission` VALUES (30, 'Can change Token', 8, 'change_tokenproxy');
INSERT INTO `auth_permission` VALUES (31, 'Can delete Token', 8, 'delete_tokenproxy');
INSERT INTO `auth_permission` VALUES (32, 'Can view Token', 8, 'view_tokenproxy');
INSERT INTO `auth_permission` VALUES (33, 'Can add group', 9, 'add_group');
INSERT INTO `auth_permission` VALUES (34, 'Can change group', 9, 'change_group');
INSERT INTO `auth_permission` VALUES (35, 'Can delete group', 9, 'delete_group');
INSERT INTO `auth_permission` VALUES (36, 'Can view group', 9, 'view_group');
INSERT INTO `auth_permission` VALUES (37, 'Can add project', 10, 'add_project');
INSERT INTO `auth_permission` VALUES (38, 'Can change project', 10, 'change_project');
INSERT INTO `auth_permission` VALUES (39, 'Can delete project', 10, 'delete_project');
INSERT INTO `auth_permission` VALUES (40, 'Can view project', 10, 'view_project');
INSERT INTO `auth_permission` VALUES (41, 'Can add user', 11, 'add_user');
INSERT INTO `auth_permission` VALUES (42, 'Can change user', 11, 'change_user');
INSERT INTO `auth_permission` VALUES (43, 'Can delete user', 11, 'delete_user');
INSERT INTO `auth_permission` VALUES (44, 'Can view user', 11, 'view_user');
INSERT INTO `auth_permission` VALUES (45, 'Can add group projects link', 12, 'add_groupprojectslink');
INSERT INTO `auth_permission` VALUES (46, 'Can change group projects link', 12, 'change_groupprojectslink');
INSERT INTO `auth_permission` VALUES (47, 'Can delete group projects link', 12, 'delete_groupprojectslink');
INSERT INTO `auth_permission` VALUES (48, 'Can view group projects link', 12, 'view_groupprojectslink');
INSERT INTO `auth_permission` VALUES (49, 'Can add group preferences link', 13, 'add_grouppreferenceslink');
INSERT INTO `auth_permission` VALUES (50, 'Can change group preferences link', 13, 'change_grouppreferenceslink');
INSERT INTO `auth_permission` VALUES (51, 'Can delete group preferences link', 13, 'delete_grouppreferenceslink');
INSERT INTO `auth_permission` VALUES (52, 'Can view group preferences link', 13, 'view_grouppreferenceslink');
INSERT INTO `auth_permission` VALUES (53, 'Can add group users link', 14, 'add_groupuserslink');
INSERT INTO `auth_permission` VALUES (54, 'Can change group users link', 14, 'change_groupuserslink');
INSERT INTO `auth_permission` VALUES (55, 'Can delete group users link', 14, 'delete_groupuserslink');
INSERT INTO `auth_permission` VALUES (56, 'Can view group users link', 14, 'view_groupuserslink');
INSERT INTO `auth_permission` VALUES (57, 'Can add user preferences link', 15, 'add_userpreferenceslink');
INSERT INTO `auth_permission` VALUES (58, 'Can change user preferences link', 15, 'change_userpreferenceslink');
INSERT INTO `auth_permission` VALUES (59, 'Can delete user preferences link', 15, 'delete_userpreferenceslink');
INSERT INTO `auth_permission` VALUES (60, 'Can view user preferences link', 15, 'view_userpreferenceslink');

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_groups_user_id_group_id_94350c0c_uniq`(`user_id` ASC, `group_id` ASC) USING BTREE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id`(`group_id` ASC) USING BTREE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_groups
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq`(`user_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_user_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for authtoken_token
-- ----------------------------
DROP TABLE IF EXISTS `authtoken_token`;
CREATE TABLE `authtoken_token`  (
  `key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of authtoken_token
-- ----------------------------

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `object_repr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `action_flag` smallint UNSIGNED NOT NULL,
  `change_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content_type_id` int NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co`(`content_type_id` ASC) USING BTREE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_chk_1` CHECK (`action_flag` >= 0)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq`(`app_label` ASC, `model` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES (1, 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES (3, 'auth', 'group');
INSERT INTO `django_content_type` VALUES (2, 'auth', 'permission');
INSERT INTO `django_content_type` VALUES (4, 'auth', 'user');
INSERT INTO `django_content_type` VALUES (7, 'authtoken', 'token');
INSERT INTO `django_content_type` VALUES (8, 'authtoken', 'tokenproxy');
INSERT INTO `django_content_type` VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES (9, 'myapp', 'group');
INSERT INTO `django_content_type` VALUES (13, 'myapp', 'grouppreferenceslink');
INSERT INTO `django_content_type` VALUES (12, 'myapp', 'groupprojectslink');
INSERT INTO `django_content_type` VALUES (14, 'myapp', 'groupuserslink');
INSERT INTO `django_content_type` VALUES (10, 'myapp', 'project');
INSERT INTO `django_content_type` VALUES (11, 'myapp', 'user');
INSERT INTO `django_content_type` VALUES (15, 'myapp', 'userpreferenceslink');
INSERT INTO `django_content_type` VALUES (6, 'sessions', 'session');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES (1, 'contenttypes', '0001_initial', '2024-06-29 07:45:07.880936');
INSERT INTO `django_migrations` VALUES (2, 'auth', '0001_initial', '2024-06-29 07:45:08.498169');
INSERT INTO `django_migrations` VALUES (3, 'admin', '0001_initial', '2024-06-29 07:45:08.665119');
INSERT INTO `django_migrations` VALUES (4, 'admin', '0002_logentry_remove_auto_add', '2024-06-29 07:45:08.676246');
INSERT INTO `django_migrations` VALUES (5, 'admin', '0003_logentry_add_action_flag_choices', '2024-06-29 07:45:08.687465');
INSERT INTO `django_migrations` VALUES (6, 'contenttypes', '0002_remove_content_type_name', '2024-06-29 07:45:08.774835');
INSERT INTO `django_migrations` VALUES (7, 'auth', '0002_alter_permission_name_max_length', '2024-06-29 07:45:08.842608');
INSERT INTO `django_migrations` VALUES (8, 'auth', '0003_alter_user_email_max_length', '2024-06-29 07:45:08.865078');
INSERT INTO `django_migrations` VALUES (9, 'auth', '0004_alter_user_username_opts', '2024-06-29 07:45:08.874070');
INSERT INTO `django_migrations` VALUES (10, 'auth', '0005_alter_user_last_login_null', '2024-06-29 07:45:08.935181');
INSERT INTO `django_migrations` VALUES (11, 'auth', '0006_require_contenttypes_0002', '2024-06-29 07:45:08.938560');
INSERT INTO `django_migrations` VALUES (12, 'auth', '0007_alter_validators_add_error_messages', '2024-06-29 07:45:08.947483');
INSERT INTO `django_migrations` VALUES (13, 'auth', '0008_alter_user_username_max_length', '2024-06-29 07:45:09.027221');
INSERT INTO `django_migrations` VALUES (14, 'auth', '0009_alter_user_last_name_max_length', '2024-06-29 07:45:09.093576');
INSERT INTO `django_migrations` VALUES (15, 'auth', '0010_alter_group_name_max_length', '2024-06-29 07:45:09.112059');
INSERT INTO `django_migrations` VALUES (16, 'auth', '0011_update_proxy_permissions', '2024-06-29 07:45:09.121810');
INSERT INTO `django_migrations` VALUES (17, 'auth', '0012_alter_user_first_name_max_length', '2024-06-29 07:45:09.195511');
INSERT INTO `django_migrations` VALUES (18, 'authtoken', '0001_initial', '2024-06-29 07:45:09.288323');
INSERT INTO `django_migrations` VALUES (19, 'authtoken', '0002_auto_20160226_1747', '2024-06-29 07:45:09.314282');
INSERT INTO `django_migrations` VALUES (20, 'authtoken', '0003_tokenproxy', '2024-06-29 07:45:09.319353');
INSERT INTO `django_migrations` VALUES (21, 'authtoken', '0004_alter_tokenproxy_options', '2024-06-29 07:45:09.325303');
INSERT INTO `django_migrations` VALUES (22, 'myapp', '0001_initial', '2024-06-29 07:45:10.097529');
INSERT INTO `django_migrations` VALUES (23, 'myapp', '0002_add_admin_tut', '2024-06-29 07:45:10.933658');
INSERT INTO `django_migrations` VALUES (24, 'sessions', '0001_initial', '2024-06-29 07:45:10.972428');

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session`  (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`) USING BTREE,
  INDEX `django_session_expire_date_a5c62663`(`expire_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_session
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_group
-- ----------------------------
DROP TABLE IF EXISTS `myapp_group`;
CREATE TABLE `myapp_group`  (
  `GroupID` int NOT NULL AUTO_INCREMENT,
  `GroupName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `GroupDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedBy_id` int NOT NULL,
  PRIMARY KEY (`GroupID`) USING BTREE,
  INDEX `myapp_group_CreatedBy_id_cf83ca20_fk_myapp_user_UserID`(`CreatedBy_id` ASC) USING BTREE,
  CONSTRAINT `myapp_group_CreatedBy_id_cf83ca20_fk_myapp_user_UserID` FOREIGN KEY (`CreatedBy_id`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_group
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_grouppreferenceslink
-- ----------------------------
DROP TABLE IF EXISTS `myapp_grouppreferenceslink`;
CREATE TABLE `myapp_grouppreferenceslink`  (
  `GroupPreferencesLinkID` int NOT NULL AUTO_INCREMENT,
  `GroupID_id` int NOT NULL,
  `ProjectID_id` int NOT NULL,
  PRIMARY KEY (`GroupPreferencesLinkID`) USING BTREE,
  INDEX `myapp_grouppreferenc_GroupID_id_34bbca82_fk_myapp_gro`(`GroupID_id` ASC) USING BTREE,
  INDEX `myapp_grouppreferenc_ProjectID_id_18197913_fk_myapp_pro`(`ProjectID_id` ASC) USING BTREE,
  CONSTRAINT `myapp_grouppreferenc_GroupID_id_34bbca82_fk_myapp_gro` FOREIGN KEY (`GroupID_id`) REFERENCES `myapp_group` (`GroupID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_grouppreferenc_ProjectID_id_18197913_fk_myapp_pro` FOREIGN KEY (`ProjectID_id`) REFERENCES `myapp_project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_grouppreferenceslink
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_groupprojectslink
-- ----------------------------
DROP TABLE IF EXISTS `myapp_groupprojectslink`;
CREATE TABLE `myapp_groupprojectslink`  (
  `GroupProjectsLinkID` int NOT NULL AUTO_INCREMENT,
  `GroupID_id` int NOT NULL,
  `ProjectID_id` int NOT NULL,
  PRIMARY KEY (`GroupProjectsLinkID`) USING BTREE,
  INDEX `myapp_groupprojectsl_GroupID_id_993128fb_fk_myapp_gro`(`GroupID_id` ASC) USING BTREE,
  INDEX `myapp_groupprojectsl_ProjectID_id_aa0894c4_fk_myapp_pro`(`ProjectID_id` ASC) USING BTREE,
  CONSTRAINT `myapp_groupprojectsl_GroupID_id_993128fb_fk_myapp_gro` FOREIGN KEY (`GroupID_id`) REFERENCES `myapp_group` (`GroupID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_groupprojectsl_ProjectID_id_aa0894c4_fk_myapp_pro` FOREIGN KEY (`ProjectID_id`) REFERENCES `myapp_project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_groupprojectslink
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_groupuserslink
-- ----------------------------
DROP TABLE IF EXISTS `myapp_groupuserslink`;
CREATE TABLE `myapp_groupuserslink`  (
  `GroupUsersLinkID` int NOT NULL AUTO_INCREMENT,
  `GroupID_id` int NOT NULL,
  `UserID_id` int NOT NULL,
  PRIMARY KEY (`GroupUsersLinkID`) USING BTREE,
  INDEX `myapp_groupuserslink_GroupID_id_f4281f3e_fk_myapp_group_GroupID`(`GroupID_id` ASC) USING BTREE,
  INDEX `myapp_groupuserslink_UserID_id_3c0b5907_fk_myapp_user_UserID`(`UserID_id` ASC) USING BTREE,
  CONSTRAINT `myapp_groupuserslink_GroupID_id_f4281f3e_fk_myapp_group_GroupID` FOREIGN KEY (`GroupID_id`) REFERENCES `myapp_group` (`GroupID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_groupuserslink_UserID_id_3c0b5907_fk_myapp_user_UserID` FOREIGN KEY (`UserID_id`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_groupuserslink
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_interest
-- ----------------------------
DROP TABLE IF EXISTS `myapp_interest`;
CREATE TABLE `myapp_interest`  (
  `interest_id` int NOT NULL AUTO_INCREMENT,
  `interest_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`interest_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_interest
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_project
-- ----------------------------
DROP TABLE IF EXISTS `myapp_project`;
CREATE TABLE `myapp_project`  (
  `ProjectID` int NOT NULL AUTO_INCREMENT,
  `ProjectName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProjectDescription` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedBy_id` int NOT NULL,
  `ProjectOwner_id` int NOT NULL,
  `MaxNumof_group` int NOT NULL COMMENT 'MaxNumof_group for the maximum number of groups to be assigned to the project. ',
  PRIMARY KEY (`ProjectID`) USING BTREE,
  INDEX `myapp_project_CreatedBy_id_b3a69a4b_fk_myapp_user_UserID`(`CreatedBy_id` ASC) USING BTREE,
  INDEX `myapp_project_ProjectOwner_id_859cc4da_fk_myapp_user_UserID`(`ProjectOwner_id` ASC) USING BTREE,
  CONSTRAINT `myapp_project_CreatedBy_id_b3a69a4b_fk_myapp_user_UserID` FOREIGN KEY (`CreatedBy_id`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_project_ProjectOwner_id_859cc4da_fk_myapp_user_UserID` FOREIGN KEY (`ProjectOwner_id`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_project
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_skill
-- ----------------------------
DROP TABLE IF EXISTS `myapp_skill`;
CREATE TABLE `myapp_skill`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_skill
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_skill_group
-- ----------------------------
DROP TABLE IF EXISTS `myapp_skill_group`;
CREATE TABLE `myapp_skill_group`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `skill_id` int NULL DEFAULT NULL,
  `group_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `skill_id`(`skill_id` ASC) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE,
  CONSTRAINT `myapp_skill_group_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `myapp_skill` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_skill_group_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `myapp_group` (`GroupID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_skill_group
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_skill_project
-- ----------------------------
DROP TABLE IF EXISTS `myapp_skill_project`;
CREATE TABLE `myapp_skill_project`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `skill_id` int NULL DEFAULT NULL,
  `project_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `skill_id`(`skill_id` ASC) USING BTREE,
  INDEX `project_id`(`project_id` ASC) USING BTREE,
  CONSTRAINT `myapp_skill_project_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `myapp_skill` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_skill_project_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `myapp_project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_skill_project
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_student_interest
-- ----------------------------
DROP TABLE IF EXISTS `myapp_student_interest`;
CREATE TABLE `myapp_student_interest`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `interest_id` int NULL DEFAULT NULL,
  `userid` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `interest_id`(`interest_id` ASC) USING BTREE,
  INDEX `userid`(`userid` ASC) USING BTREE,
  CONSTRAINT `myapp_student_interest_ibfk_1` FOREIGN KEY (`interest_id`) REFERENCES `myapp_interest` (`interest_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_student_interest_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_student_interest
-- ----------------------------

-- ----------------------------
-- Table structure for myapp_user
-- ----------------------------
DROP TABLE IF EXISTS `myapp_user`;
CREATE TABLE `myapp_user`  (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EmailAddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Passwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserRole` int NOT NULL,
  `UserInformation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserID`) USING BTREE,
  UNIQUE INDEX `EmailAddress`(`EmailAddress` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_user
-- ----------------------------
INSERT INTO `myapp_user` VALUES (1, 'admin', 'admin', 'admin@admin.com', 'pbkdf2_sha256$720000$3ei2PbTFGU380anixGqrog$gdkXsG3r4IO3nfCJ+AQfiIlPtkzvLMCWa4Y5lEeYjtI=', 5, '');
INSERT INTO `myapp_user` VALUES (2, 'tut', 'tut', 'tut@tut.com', 'pbkdf2_sha256$720000$QDXSP8BojMNqRPg9m3ke3u$N/gotnTpjbJCwE3wmouomN9x/rs1370rHpFSu/PhNSs=', 3, '');
INSERT INTO `myapp_user` VALUES (3, 'Steven', 'Bian00', 'StevenBian00@qq.com', 'pbkdf2_sha256$720000$HIGa9RZbTyRT62nZKvFzvx$RySMJgddX8L8Et8QfsWthMMMZstfBSB0orrbADQDatg=', 1, '');
INSERT INTO `myapp_user` VALUES (4, 'shuo', 'shuoge', '123@gmail.com', 'pbkdf2_sha256$720000$ASF3v9hQE5zyMtGg5E4j8W$MhGigCEGBva03pXp+6n6+cWYAKqKnoT0jylIn4QBJGQ=', 1, '');

-- ----------------------------
-- Table structure for myapp_userpreferenceslink
-- ----------------------------
DROP TABLE IF EXISTS `myapp_userpreferenceslink`;
CREATE TABLE `myapp_userpreferenceslink`  (
  `UserPreferencesLinkID` int NOT NULL AUTO_INCREMENT,
  `ProjectID_id` int NOT NULL,
  `UserID_id` int NOT NULL,
  PRIMARY KEY (`UserPreferencesLinkID`) USING BTREE,
  INDEX `myapp_userpreference_ProjectID_id_428dc26b_fk_myapp_pro`(`ProjectID_id` ASC) USING BTREE,
  INDEX `myapp_userpreference_UserID_id_0b86c1ba_fk_myapp_use`(`UserID_id` ASC) USING BTREE,
  CONSTRAINT `myapp_userpreference_ProjectID_id_428dc26b_fk_myapp_pro` FOREIGN KEY (`ProjectID_id`) REFERENCES `myapp_project` (`ProjectID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `myapp_userpreference_UserID_id_0b86c1ba_fk_myapp_use` FOREIGN KEY (`UserID_id`) REFERENCES `myapp_user` (`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myapp_userpreferenceslink
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
