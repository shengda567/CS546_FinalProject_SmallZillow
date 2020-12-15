// $("#submit-user").click((event) => {
//   alert("Dian wo");
// });
// () => {

async function send_form() {
  let newUserNameInput = $("#username");
  let newEmailInput = $("#email");
  let newPasswordInput = $("#password");
  let manager_levelInput = $("#manager_level");
  let manager_verify_codeInput = $("#managerCode");

  let newUserName = newUserNameInput.val();
  let newEmail = newEmailInput.val();
  let newPassword = newPasswordInput.val();
  let manager_level = manager_levelInput.val();
  let manager_verify_code = manager_verify_codeInput.val();

  let formSet = {
    username: newUserName,
    email: newEmail,
    password: newPassword,
    manager_level: manager_level,
    managerCode: manager_verify_code,
  };
  console.log(formSet);
  try {
    $.ajax({
      url: "http://localhost:3000/managers",
      type: "post",
      data: formSet,
      dataType: "json",
    });
  } catch (e) {
    console.log(e);
  }
}

function sign_up_input_check() {
  let newUserNameInput = $("#username");
  let newEmailInput = $("#email");
  let newPasswordInput = $("#password");
  let manager_levelInput = $("#manager_level");
  let manager_verify_codeInput = $("#managerCode");

  let newUserName = newUserNameInput.val();
  let newEmail = newEmailInput.val();
  let newPassword = newPasswordInput.val();
  let manager_level = manager_levelInput.val();
  let manager_verify_code = manager_verify_codeInput.val();

  const charReg = RegExp("^[a-zA-Z_]{1,}$");
  const emailReq = RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$");
  if (!emailReq.exec(newEmail)) {
    $("#register-error").html(
      "Email must be the format: [zhangsan-001@gmail.com]."
    );
    return true;
  } else if (
    newUserName &&
    newEmail &&
    newPassword &&
    manager_level &&
    manager_verify_code
  ) {
    return false;
  }
}

let userLoginForm = $("#signup-form");
let user_signup_button = $("#submit-user");
user_signup_button.click(async (event) => {
  event.preventDefault();

  let checkSignUP = sign_up_input_check();
  if (checkSignUP) {
    $("#register-error").show();
  } //
  else {
    $("#register-error").hide();
    await send_form();
    alert("Signup successfully");
    window.location.href = "http://localhost:3000/managerLogin/myaccount";
    //$("#postForm").trigger("reset");
  }
});
