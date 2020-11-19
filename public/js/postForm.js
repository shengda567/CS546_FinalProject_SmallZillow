$("#postForm").submit((event) => {
  event.preventDefault();
  $("#postErrorList").empty();
  // empty check
  let hasError = false;
  let title = $("#post-title-input").val().trim();
  let address = $("#post-address-input").val().trim();
  let city = $("#post-city-input").val().trim();
  let zipcode = $("#post-zipcode-input").val().trim();
  let description = $("#post-description-input").val().trim();
  let email = $("#post-email-input").val().trim();
  let phone = $("#post-phone-input").val().trim();
  let prices = $("#post-prices-input").val().trim();
  if (!title) {
    //const li = `<li>you must enter a title<li>`;
    $("#postErrorList").append(`<li>You must enter a title</li>`);
    hasError = true;
  }
  if (!address) {
    $("#postErrorList").append(`<li>You must enter a address</li>`);
    hasError = true;
  }
  if (!city) {
    $("#postErrorList").append(`<li>You must enter a city</li>`);
    hasError = true;
  }
  if (!zipcode) {
    $("#postErrorList").append(`<li>You must enter a zipcode</li>`);
    hasError = true;
  }
  if (!description) {
    $("#postErrorList").append(`<li>You must enter a house description</li>`);
    hasError = true;
  }
  if (!email) {
    $("#postErrorList").append(`<li>You must enter a email</li>`);
    hasError = true;
  }
  if (!phone) {
    $("#postErrorList").append(`<li>You must enter a phone number</li>`);
    hasError = true;
  }
  if (!prices) {
    $("#postErrorList").append(`<li>You must enter a prices</li>`);
    hasError = true;
  }
  // type check
  //1.zipcode && phone check
  let numberCheck = /[0-9]/;
  let zipCheck = true;
  for (let i = 0; i < zipcode.length; i++) {
    if (!numberCheck.test(zipcode[i])) {
      zipCheck = false;
      break;
    }
  }
  if (zipcode && zipCheck == false) {
    $("#postErrorList").append(`<li>Invalid zipcode, must be number</li>`);
    hasError = true;
  }

  let phoneCheck = true;
  for (let i = 0; i < phone.length; i++) {
    if (!numberCheck.test(phone[i])) {
      phoneCheck = false;
      break;
    }
  }
  if (phone.length != 10) {
    phoneCheck = false;
  }

  if (phone && phoneCheck == false) {
    $("#postErrorList").append(`<li>Invalid phone number, must be number</li>`);
    hasError = true;
  }

  let pricesCheck = true;
  for (let i = 0; i < prices.length; i++) {
    if (!numberCheck.test(prices[i])) {
      pricesCheck = false;
      break;
    }
  }
  if (prices && pricesCheck == false) {
    $("#postErrorList").append(`<li>Invalid prices, must be number</li>`);
    hasError = true;
  }

  if (hasError) {
    $("#post-errors").show();
  } else {
    window.location.href = "http://localhost:3000/posts/succuss";
    //$("#postForm").trigger("reset");
  }
});
