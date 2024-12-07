-- Active: 1733557756430@@127.0.0.1@3306@WUWU
/* Run this file to populate the database with arbitrary data. */
/* Please make sure to run this script with a super user, so that the function can be created. */
DELIMITER //

-- This functions generates random IDs in the format decided for this project.
CREATE FUNCTION IF NOT EXISTS generate_random_string()
RETURNS CHAR(16)
NOT DETERMINISTIC
NO SQL
BEGIN
    DECLARE chars_str VARCHAR(62) DEFAULT '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    DECLARE random_string CHAR(16) DEFAULT '';
    DECLARE i INT DEFAULT 0;

    WHILE i < 16 DO
        SET random_string = CONCAT(random_string, SUBSTRING(chars_str, FLOOR(1 + RAND() * LENGTH(chars_str)), 1));
        SET i = i + 1;
    END WHILE;

    RETURN random_string;
END //

DELIMITER ;
DELIMITER ;
USE WUWU;

INSERT INTO Station VALUES (generate_random_string(), 'Beijing Railway Station', 0x00000000010100000088855AD3BCF343407A36AB3E571B5D40),
(generate_random_string(), 'Xi''an Railway Station', 0x00000000010100000033C4B12E6E234140E3C798BB963C5B40),
(generate_random_string(), 'Chongqing Railway Station', 0x00000000010100000076E09C11A58D3D406C787AA52CA35A40),
(generate_random_string(), 'Shenzhen Railway Station', 0x000000000101000000F2D24D62108836402497FF907E875C40),
(generate_random_string(), 'Wuhan Railway Station', 0x0000000001010000005AF5B9DA8A9D3E40107A36AB3E9B5C40),
(generate_random_string(), 'Suzhou Industrial Park Railway Station', 0x0000000001010000000B462575024A3F40F931E6AE252C5E40),
(generate_random_string(), 'Guangzhou South Railway Station', 0x000000000101000000B0726891EDFC3640AF25E4839E515C40),
(generate_random_string(), 'Shanghai Railway Station', 0x000000000101000000C520B07268413F40D3DEE00B935D5E40),
(generate_random_string(), 'Nanjing West Railway Station', 0x000000000101000000917EFB3A7006404067D5E76A2BAE5D40),
(generate_random_string(), 'Xi''an North Railway Station', 0x00000000010100000071AC8BDB683041407AC7293A92475B40),
(generate_random_string(), 'Chongqing North Railway Station', 0x000000000101000000B537F8C2649A3D407A36AB3E57A35A40),
(generate_random_string(), 'Beijing South Railway Station', 0x000000000101000000E63FA4DFBEEE4340B1BFEC9E3C185D40),
(generate_random_string(), 'Wuchang Railway Station', 0x00000000010100000027A089B0E1893E403FC6DCB584945C40),
(generate_random_string(), 'Chengdu Railway Station', 0x00000000010100000050FC1873D7B23E406ADE718A8E045A40),
(generate_random_string(), 'Guangzhou East Railway Station', 0x00000000010100000011C7BAB88D263740B84082E2C7545C40),
(generate_random_string(), 'Hangzhou Railway Station', 0x000000000101000000567DAEB6623F3E409EEFA7C64B0B5E40),
(generate_random_string(), 'Shanghai South Railway Station', 0x00000000010100000062105839B4283F40DE02098A1F5B5E40),
(generate_random_string(), 'Suzhou Railway Station', 0x000000000101000000C217265305533F40AC1C5A643B275E40),
(generate_random_string(), 'Nanjing Railway Station', 0x000000000101000000166A4DF38E0B4040D712F241CFB25D40),
(generate_random_string(), 'Chongqing West Railway Station', 0x00000000010100000005A3923A017D3D40DBF97E6ABCA05A40),
(generate_random_string(), 'Beijing West Railway Station', 0x0000000001010000005F984C158CF24340AA8251499D145D40),
(generate_random_string(), 'Hankou Railway Station', 0x000000000101000000ADFA5C6DC59E3E40D3DEE00B93915C40),
(generate_random_string(), 'Chengdu East Railway Station', 0x00000000010100000061C3D32B65A93E405A643BDF4F095A40),
(generate_random_string(), 'Shenzhen North Railway Station', 0x0000000001010000005DDC4603789B364060E5D022DB815C40),
(generate_random_string(), 'Hangzhou East Railway Station', 0x0000000001010000000B24287E8C493E404BC8073D9B0D5E40),
(generate_random_string(), 'Suzhou North Railway Station', 0x000000000101000000C217265305633F403EE8D9ACFA285E40),
(generate_random_string(), 'Guangzhou Railway Station', 0x0000000001010000000F9C33A2B4273740FE43FAEDEB505C40),
(generate_random_string(), 'Shanghai Hongqiao Railway Station', 0x0000000001010000001904560E2D323F40A167B3EA73555E40),
(generate_random_string(), 'Nanjing South Railway Station', 0x00000000010100000096218E7571FB3F40AC1C5A643BB35D40);

