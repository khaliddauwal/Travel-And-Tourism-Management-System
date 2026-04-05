<?php
error_reporting(0);
<?php
if(isset($_POST['submit']))
{
requireCSRFToken();

$validator = new Validator();
$isValid = $validator->validate($_POST, [
    'fname' => ['required', 'alpha', 'min:2', 'max:50'],
    'mobilenumber' => ['required', 'phone'],
    'email' => ['required', 'email'],
    'password' => ['required', 'min:6', 'max:100']
]);

if (!$isValid) {
    $_SESSION['msg'] = $validator->getFirstError();
    header('location:thankyou.php');
    exit();
} else {
    $fname = sanitizeInput($_POST['fname']);
    $mnumber = sanitizePhone($_POST['mobilenumber']);
    $email = sanitizeEmail($_POST['email']);
    $password = $_POST['password']; // Don't sanitize password, just validate length
    
    // Check if email already exists
    $checkSql = "SELECT EmailId FROM tblusers WHERE EmailId=:email";
    $checkQuery = $dbh->prepare($checkSql);
    $checkQuery->bindParam(':email', $email, PDO::PARAM_STR);
    $checkQuery->execute();
    
    if($checkQuery->rowCount() > 0) {
        $_SESSION['msg'] = "Email already exists. Please use a different email.";
        header('location:thankyou.php');
        exit();
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO tblusers(FullName,MobileNumber,EmailId,Password) VALUES(:fname,:mnumber,:email,:password)";
        $query = $dbh->prepare($sql);
        $query->bindParam(':fname', $fname, PDO::PARAM_STR);
        $query->bindParam(':mnumber', $mnumber, PDO::PARAM_STR);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        $query->execute();
        
        $lastInsertId = $dbh->lastInsertId();
        if($lastInsertId) {
            Logger::info("New user registered", ['email' => $email]);
            $_SESSION['msg'] = "You are successfully registered. Now you can login";
            header('location:thankyou.php');
            exit();
        } else {
            Logger::error("User registration failed", ['email' => $email]);
            $_SESSION['msg'] = "Something went wrong. Please try again.";
            header('location:thankyou.php');
            exit();
        }
    }
}
}
?>
<!--Javascript for check email availabilty-->
<script>
function checkAvailability() {

$("#loaderIcon").show();
jQuery.ajax({
url: "check_availability.php",
data:'emailid='+$("#email").val(),
type: "POST",
success:function(data){
$("#user-availability-status").html(data);
$("#loaderIcon").hide();
},
error:function (){}
});
}
</script>

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>						
						</div>
							<section>
								<div class="modal-body modal-spa">
									<div class="login-grids">
										<div class="login">
											<div class="login-left">
												<ul>
													<li><a class="fb" href="#"><i></i>Facebook</a></li>
													<li><a class="goog" href="#"><i></i>Google</a></li>
													
												</ul>
											</div>
											<div class="login-right">
												<form name="signup" method="post">
													<h3>Create your account </h3>
					

				<input type="text" value="" placeholder="Full Name" name="fname" autocomplete="off" required="">
				<input type="text" value="" placeholder="Mobile number" maxlength="10" name="mobilenumber" autocomplete="off" required="">
		<input type="text" value="" placeholder="Email id" name="email" id="email" onBlur="checkAvailability()" autocomplete="off"  required="">	
		 <span id="user-availability-status" style="font-size:12px;"></span> 
	<input type="password" value="" placeholder="Password" name="password" required="">	
													<?php echo getCSRFTokenField(); ?>
													<input type="submit" name="submit" id="submit" value="CREATE ACCOUNT">
												</form>
											</div>
												<div class="clearfix"></div>								
										</div>
											<p>By logging in you agree to our <a href="page.php?type=terms">Terms and Conditions</a> and <a href="page.php?type=privacy">Privacy Policy</a></p>
									</div>
								</div>
							</section>
					</div>
				</div>
			</div>