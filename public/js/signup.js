// $("#submit-user").click((event) => {
//   alert("Dian wo");
// });
// () => {

function send_form() {
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

  let formSet = {
    newUserName: newUserName,
    newFirstName: newFirstName,
    newLastName: newLastName,
    newEmail: newEmail,
    newGender: newGender,
    newBirthday: newBirthday,
    newPhone: newPhone,
    newCity: newCity,
    newState: newState,
    newPassword: newPassword,
  };
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

  const charReg = RegExp("^[a-zA-Z_]{1,}$");
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
    newUserName
  ) {
    return false;
  }
}

let userLoginForm = $("#signup-form");
userLoginForm[0].addEventListener("submit", (event) => {
  event.preventDefault();

  let checkSignUP = sign_up_input_check();
  if (checkSignUP) {
    $("#register-error").show();
  } //
  else {
    $("#register-error").hide();
    send_form();
    //window.location.href = "http://localhost:3000/posts";
    //$("#postForm").trigger("reset");
  }
});
