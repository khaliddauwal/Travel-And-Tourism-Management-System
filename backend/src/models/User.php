<?php

class User {
    private $dbh;
    
    public function __construct($database) {
        $this->dbh = $database;
    }
    
    public function create($fullName, $mobileNumber, $email, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO tblusers(FullName,MobileNumber,EmailId,Password) VALUES(:fname,:mnumber,:email,:password)";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':fname', $fullName, PDO::PARAM_STR);
        $query->bindParam(':mnumber', $mobileNumber, PDO::PARAM_STR);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        
        return $query->execute();
    }
    
    public function authenticate($email, $password) {
        $sql = "SELECT EmailId, Password FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_OBJ);
        
        if($query->rowCount() > 0) {
            $stored_password = $results[0]->Password;
            return password_verify($password, $stored_password);
        }
        return false;
    }
    
    public function findByEmail($email) {
        $sql = "SELECT * FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        return $query->fetch(PDO::FETCH_OBJ);
    }
    
    public function updatePassword($email, $mobile, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $sql = "UPDATE tblusers SET Password=:newpassword WHERE EmailId=:email AND MobileNumber=:mobile";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':mobile', $mobile, PDO::PARAM_STR);
        $query->bindParam(':newpassword', $hashedPassword, PDO::PARAM_STR);
        
        return $query->execute();
    }
    
    public function emailExists($email) {
        $sql = "SELECT EmailId FROM tblusers WHERE EmailId=:email";
        $query = $this->dbh->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        return $query->rowCount() > 0;
    }
}
?>