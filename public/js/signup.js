// $("#submit-user").click((event) => {
//   alert("Dian wo");
// });
// () => {
let userLoginForm = $("#signup-form"),
  newFirstNameInput = $("#firstname"),
  newLastNameInput = $("#lastname"),
  newEmailInput = $("#email"),
  newGenderInput = $("#gender"),
  newBirthDayInput = $("#birthdaytime"),
  newPhoneInput = $("#phone"),
  newCityInput = $("#city"),
  newStateInput = $("#state"),
  newPasswordInput = $("#password");

userLoginForm.submit(handleSignup);

function handleSignup(e) {
  e.preventDefault();
  console.log("123");

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
    $("#register-error").show();
    $("#register-error").html("First name must be chars only.");
  } else if (!charReg.exec(newLastName)) {
    $("#register-error").show();
    $("#register-error").html("Last name must be chars only.");
  } else if (!charReg.exec(newCity)) {
    $("#register-error").show();
    $("#register-error").html("City name must be chars only.");
  } else if (
    newFirstName &&
    newLastName &&
    newEmail &&
    newGender &&
    newBirthday &&
    newPhone &&
    newCity &&
    newState &&
    newPassword
  ) {
    $("#register-error").hide();
    alert("you have registered successfully.");
  }
}
