// $("#submit-user").click((event) => {
//   alert("Dian wo");
// });
// () => {

async function send_form() {
  let newUserNameInput = $("#username");
  let newFirstNameInput = $("#firstname");
  let newLastNameInput = $("#lastname");
  let newEmailInput = $("#email");
  let newGenderInput = $("#gender");
  let newBirthDayInput = $("#birthdaytime");
  let newPhoneInput = $("#phone");
  let newCityInput = $("#city");
  let newStateInput = $("#state");
  let newPasswordInput = $("#password");
  let verifyInput = $("#verifiy");

  let newUserName = newUserNameInput.val();
  let newFirstName = newFirstNameInput.val();
  let newLastName = newLastNameInput.val();

  let newEmail = newEmailInput.val();
  let newGender = newGenderInput.val();

  let newBirthday = newBirthDayInput.val();
  let newPhone = newPhoneInput.val();
  let newCity = newCityInput.val();

  let newState = newStateInput.val();
  let newPassword = newPasswordInput.val();
  let verify = verifyInput.val();

  let formSet = {
    username: newUserName,
    user: { firstname: newFirstName, lastname: newLastName },
    email: newEmail,
    gender: newGender,
    BOD: newBirthday,
    phone: newPhone,
    address: { city: newCity, state: newState },
    password: newPassword,
    verifiy: verify,
  };
  console.log(formSet);
  try {
    $.ajax({
      url: "http://localhost:3000/register",
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
  let newFirstNameInput = $("#firstname");
  let newLastNameInput = $("#lastname");
  let newEmailInput = $("#email");
  let newGenderInput = $("#gender");
  let newBirthDayInput = $("#birthdaytime");
  let newPhoneInput = $("#phone");
  let newCityInput = $("#city");
  let newStateInput = $("#state");
  let newPasswordInput = $("#password");
  let verifyInput = $("#verifiy");

  let newUserName = newUserNameInput.val();
  let newFirstName = newFirstNameInput.val();
  let newLastName = newLastNameInput.val();

  let newEmail = newEmailInput.val();
  let newGender = newGenderInput.val();

  let newBirthday = newBirthDayInput.val();
  let newPhone = newPhoneInput.val();
  let newCity = newCityInput.val();

  let newState = newStateInput.val();
  let newPassword = newPasswordInput.val();
  let verify = verifyInput.val();

  const emailReq = RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$");
  const charReg = RegExp("^[a-zA-Z_]{1,}$");
  const numberCheck = /[0-9]{10}/;
  if (!charReg.exec(newFirstName)) {
    //$("#register-error").show();
    $("#register-error").html("First name must be chars only.");
    return true;
  } else if (!charReg.exec(newLastName)) {
    //$("#register-error").show();
    $("#register-error").html("Last name must be chars only.");
    return true;
  } else if (!charReg.exec(newCity)) {
    //$("#register-error").show();
    $("#register-error").html("City name must be chars only.");
    return true;
  } else if (!emailReq.exec(newEmail)) {
    $("#register-error").html(
      "Email must be the format: [zhangsan-001@gmail.com]."
    );
    return true;
  } else if (!numberCheck.exec(newPhone)) {
    $("#register-error").html("Phone number should be like this: 1234567890.");
    return true;
  } else if (
    !newUserName.trim() ||
    !newFirstName.trim() ||
    !newLastName.trim() ||
    !newEmail.trim() ||
    !newGender.trim() ||
    !newPhone.trim() ||
    !newCity.trim() ||
    !newState.trim() ||
    !newPassword.trim() ||
    !verify.trim()
  ) {
    $("#register-error").html("All the field should be filled.");
    return true;
  } else if (
    newFirstName &&
    newLastName &&
    newEmail &&
    newGender &&
    newBirthday &&
    newPhone &&
    newCity &&
    newState &&
    newPassword &&
    newUserName &&
    verify
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
    window.location.href = "http://localhost:3000/users/myaccount";
    //$("#postForm").trigger("reset");
  }
});
