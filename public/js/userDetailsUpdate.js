(function ($) {
  let delete_post_button = $("#delet-post-button");
  delete_post_button.click(async function (event) {
    event.preventDefault();
    let post_form = $("#user-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      alert("you need choose one post first");
      event.stopPropagation();
      return;
    }
    let post_id = valueList[0].value;
    console.log(post_id);
    await $.get(
      "http://localhost:3000/api/post/" + post_id,
      // { name: post_name },
      (data) => {
        // console.log(data);
        if (data == null) {
          alert("No post found");
        } else {
          let delete_post_id = $("#delete-post-id");
          let delete_modal_p = $("#delete-modal-body-p");
          delete_post_id.text(`${data._id}`);
          delete_modal_p.text("");
          delete_modal_p.text(`You will delete the post: ${data.title} ?`);
        }
      }
    );
  });

  let yes_delete_post_button = $("#delete-yes");
  yes_delete_post_button.click(async function (event) {
    event.preventDefault();

    let post_id = $("#delete-post-id").text();
    $.ajax({
      type: "DELETE",
      url: "/posts/" + post_id,
      dataType: "json",
      success: function () {
        alert("Delete successfully");
        location.reload();
      },
    });
  });

  let save_profile_button = $("#user-account-edit-save-button");

  save_profile_button.click(async function (event) {
    event.preventDefault();
    let username = $("#username").val();
    let email = $("#email").val();
    let gender = $("#gender").val();
    let address = $("#address").val();
    let BOD = $("#BOD").val();
    let phone = $("#phone").val();

    // Error Checking
    let error_div = $("#userDetailErrorLists_div");
    let error_ul = $("#userDetailErrorLists_ul");
    let hasError = false;
    error_ul.empty();
    if (!email.trim()) {
      error_ul.append(`<li>You must provide email</li>`);
      hasError = true;
    }
    if (!gender.trim()) {
      error_ul.append(`<li>You must provide gender</li>`);
      hasError = true;
    }
    if (!BOD.trim()) {
      error_ul.append(`<li>You must provide birthday</li>`);
      hasError = true;
    }
    if (!phone.trim()) {
      error_ul.append(`<li>You must provide phone</li>`);
      hasError = true;
    }

    const emailReq = RegExp(
      "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
    );
    if (!emailReq.exec(email)) {
      error_ul.append(`<li>Invalid email address</li>`);
      hasError = true;
    }

    let phoneReg = /[0-9]{10}/;
    let phoneValid = phoneReg.test(phone);

    if (phoneValid == false) {
      error_ul.append(
        `<li>Invalid phone number,please follow the example</li>`
      );
      hasError = true;
    }

    let BODReg = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
    let BODValid = BODReg.test(BOD);
    if (BODValid == false) {
      error_ul.append(`<li>Invalid Birthday</li>`);
      hasError = true;
    }

    if (hasError) {
      error_div.show();
    } else {
      error_div.hide();
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
    }
  });

  let edit_post_button = $("#edit-post-button");

  edit_post_button.click(async function (event) {
    event.preventDefault();
    let post_form = $("#user-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      $("#unChooseError").show();
      event.stopPropagation();
    }
    if (valueList.length != 0) {
      $("#unChooseError").hide();
      let post_id = valueList[0].value;
      $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/post/" + post_id,
        dataType: "json",
        success: function (data) {
          console.log(data);
          if (data == null) {
            alert("No post found");
          } else {
            let id = $("#post-update-id");
            let title = $("#title");
            let time = $("#date");
            let post_adress = $("#post-address");
            let city = $("#city");
            let state = $("#state");
            let zipcode = $("#zipcode");
            let description = $("#description");
            let tag = $("#tag");
            let post_email = $("#post-email");
            let post_phone = $("#post-phone");
            let price = $("#price");
            id.val(data._id);
            title.val(data.title);
            time.val(data.date);
            post_adress.val(data.address);
            city.val(data.city);
            let state_split_arr = data.state.split(" ");
            let state_fisrt_char = "";
            for (let i in state_split_arr) {
              state_fisrt_char += state_split_arr[i].slice(0, 1);
            }
            state.val(state_fisrt_char);
            zipcode.val(data.zipcode);
            description.val(data.description);
            post_email.val(data.email);
            tag.val(data.tag);
            post_phone.val(data.phone);
            price.val(data.price);
          }
        },
      });
    }
  });

  let save_post_button = $("#user-post-edit-save-button");
  save_post_button.click(async function (event) {
    event.preventDefault();

    let id = $("#post-update-id").val();
    let title = $("#title").val();
    let time = $("#date").val();
    let post_address = $("#post-address").val();
    let city = $("#city").val();
    let state = $("#state").val();
    let zipcode = $("#zipcode").val();
    let description = $("#description").val();
    let tag = $("#tag").val();
    let post_email = $("#post-email").val();
    let post_phone = $("#post-phone").val();
    let price = $("#price").val();
    let img = $("#img").val();

    // Error Checking
    let hasError = false;
    let post_error_div = $("#userDetailPostErrorLists_div");
    let post_error_ul = $("#userDetailPostErrorLists_ul");
    post_error_ul.empty();
    if (!title.trim()) {
      post_error_ul.append(`<li>You must provide title</li>`);
      hasError = true;
    }
    if (!post_address.trim()) {
      post_error_ul.append(`<li>You must provide post_address</li>`);
      hasError = true;
    }
    if (!city.trim()) {
      post_error_ul.append(`<li>You must provide city</li>`);
      hasError = true;
    }
    if (!state) {
      post_error_ul.append(`<li>You must provide state</li>`);
      hasError = true;
    }
    if (!zipcode.trim()) {
      post_error_ul.append(`<li>You must provide zipcode</li>`);
      hasError = true;
    }
    if (!description.trim()) {
      post_error_ul.append(`<li>You must provide description</li>`);
      hasError = true;
    }
    if (!tag) {
      post_error_ul.append(`<li>You must provide tag</li>`);
      hasError = true;
    }
    if (!post_email.trim()) {
      post_error_ul.append(`<li>You must provide email</li>`);
      hasError = true;
    }
    if (!post_phone.trim()) {
      post_error_ul.append(`<li>You must provide phone</li>`);
      hasError = true;
    }
    if (!price.trim()) {
      post_error_ul.append(`<li>You must provide price</li>`);
      hasError = true;
    }

    const emailReq = RegExp(
      "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
    );
    if (!emailReq.exec(post_email)) {
      post_error_ul.append(`<li>Invalid email address</li>`);
      hasError = true;
    }

    let phoneReg = /[0-9]{10}/;
    let phoneValid = phoneReg.test(post_phone);

    if (phoneValid == false) {
      post_error_ul.append(
        `<li>Invalid phone number,please follow the example</li>`
      );
      hasError = true;
    }

    let numberCheck = /[0-9]/;
    let zipValid = numberCheck.test(zipcode);
    if (zipValid == false) {
      post_error_ul.append(
        `<li>Invalid Zip Code,please follow the example</li>`
      );
      hasError = true;
    }
    let priceValid = numberCheck.test(price);
    if (priceValid == false) {
      post_error_ul.append(`<li>Invalid Price, must be number</li>`);
      hasError = true;
    }

    if (hasError) {
      post_error_div.show();
    } else {
      post_error_div.hide();
      await $.get("http://localhost:3000/api/post/" + id, async (data) => {
        console.log(img);
        let savePostData = {
          title: title,
          address: post_address,
          city: city,
          state: state,
          zipcode: zipcode,
          description: description,
          tag: tag,
          email: post_email,
          phone: post_phone,
          price: price,
        };
        $.ajax({
          type: "PATCH",
          url: "/posts/" + id,
          dataType: "json",
          data: savePostData,
          success: function () {
            alert("Edit successfully");
            location.reload();
          },
        });
      });
    }
  });
})(jQuery);
