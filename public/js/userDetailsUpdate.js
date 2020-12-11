(function ($) {
  let save_profile_button = $("#user-account-edit-save-button");

  save_profile_button.click(async function (event) {
    event.preventDefault();
    let username = $("#username").val();
    let email = $("#email").val();
    let gender = $("#gender").val();
    let address = $("#address").val();
    let BOD = $("#BOD").val();
    let phone = $("#phone").val();
    console.log("123");
    await $.post(
      "http://localhost:3000/register/userInfo/update",
      { username, email, gender, address, BOD, phone },
      (data) => {
        console.log(data);
        if (data != null) {
          location.reload();
        }
      }
    );
  });
})(jQuery);
