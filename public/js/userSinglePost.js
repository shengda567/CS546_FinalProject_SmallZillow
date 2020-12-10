window.onload = function () {
  var editBtm = document.getElementById("userPostGroup_EditBtm");

  // Edit
  editBtm.onclick = function (event) {
    event.preventDefault();
    editPost();
  };

  //Save
  var saveBtm = document.getElementById("userPostGroup_SaveBtm");
  saveBtm.onclick = function (event) {
    event.preventDefault();
    savePost();
  };

  //Delete
  var deleteBtm = document.getElementById("userPostGroup_DeleteBtm");
  deleteBtm.onclick = function (event) {
    event.preventDefault();
    deletePost();
  };
};

function editPost() {
  //alert("edit clicked");
  let instruction = $(
    `<p id = "userSinglePostInstruction">You are in edit mode
        <br>Click the value you want to change,
        <br>Press Enter confirm your change</p>`
  );
  if ($("#instruction").length == 0) {
    $("#userPostGroup_h1").append(instruction);
  }

  $(".userPostValue").click(function (event) {
    if ($(this).children("input").length > 0) return false;
    var tdObj = $(this);
    var preText = tdObj.html();
    //current text
    var inputObj = $("<input type='text' />");
    //create a input text
    tdObj.html(""); //清空td中的所有元素
    inputObj
      .width(tdObj.width())
      //setting text
      .height(tdObj.height())
      .css({ border: "0px", fontSize: "17px", font: "Arial" })
      .val(preText)
      .appendTo(tdObj)
      //insert to last point
      .trigger("focus")
      //set trigger
      .trigger("select");
    inputObj.keyup(function (event) {
      if (13 == event.which) {
        //set enter key
        var text = $(this).val();
        tdObj.html(text);
      } else if (27 == event.which) {
        //esc key
        tdObj.html(preText);
      }
    });
    //mute click
    inputObj.click(function () {
      return false;
    });
  });
}

function deletePost() {
  alert("delete clicked");
}

function savePost() {
  let title = $("#userPostGroup_li_title").text().trim();
  let address = $("#userPostGroup_li_address").text();
  let city = $("#userPostGroup_li_city").text();
  let state = $("#userPostValue_state_select").val();
  let zipcode = $("#userPostGroup_li_zipcode").text();
  let description = $("#userPostGroup_li_description").text();
  let tag = $("#userPostValue_tag_select").val();
  let email = $("#userPostGroup_li_email").text();
  let phone = $("#userPostGroup_li_phone").text();
  let price = $("#userPostGroup_li_price").text();
  let error_ul = $("#userSinglePostInfoError");
  let hasError = false;
  error_ul.empty();
  if (!title) {
    //const li = `<li>you must enter a title<li>`;
    error_ul.append(
      `<li>You must enter a title, please make you confirm your changes</li>`
    );
    hasError = true;
  }
  if (!address) {
    error_ul.append(
      `<li>You must enter a address, please make you confirm your changes</li>`
    );
    hasError = true;
  }
  if (!city) {
    error_ul.append(
      `<li>You must enter a city, please make sure confirm your changes</li>`
    );
    hasError = true;
  }

  if (!zipcode) {
    error_ul.append(
      `<li>You must enter a zipcode, please make sure confirm your changes</li>`
    );
    hasError = true;
  }
  if (!description) {
    error_ul.append(
      `<li>You must enter a house description, please make sure confirm your changes</li>`
    );
    hasError = true;
  }

  if (!email) {
    error_ul.append(
      `<li>You must enter a email, please make sure confirm your changes</li>`
    );
    hasError = true;
  }
  if (!phone) {
    error_ul.append(
      `<li>You must enter a phone number, please make sure confirm your changes</li>`
    );
    hasError = true;
  }
  if (!price) {
    error_ul.append(
      `<li>You must enter a price, please make sure confirm your changes</li>`
    );
    hasError = true;
  }

  let numberCheck = /[0-9]/;
  let zipCheck = true;
  for (let i = 0; i < zipcode.length; i++) {
    if (!numberCheck.test(zipcode[i])) {
      zipCheck = false;
      break;
    }
  }
  if (zipcode && zipCheck == false) {
    error_ul.append(`<li>Invalid zipcode, must be number</li>`);
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
    error_ul.append(`<li>Invalid phone number</li>`);
    hasError = true;
  }

  let pricesCheck = true;
  for (let i = 0; i < price.length; i++) {
    if (!numberCheck.test(price[i])) {
      pricesCheck = false;
      break;
    }
  }
  if (price && pricesCheck == false) {
    error_ul.append(`<li>Invalid price</li>`);
    hasError = true;
  }

  if (hasError) {
    error_ul.show();
  } else {
    let savePostDate = {
      title: title,
      address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      description: description,
      tag: tag,
      email: email,
      phone: phone,
      price: price,
    };
    alert(JSON.stringify(savePostDate));
    alert("save clicked and save successfully");
    // $.ajax({
    //   type: "PUT",
    //   url: "",
    //   dataType: "json",
    //   success: function (data) {
    //     alert("save clicked and save successfully");
    //   },
    // });
  }
}
