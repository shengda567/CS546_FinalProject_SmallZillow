(function ($) {
  let delete_post_button = $("#delet-post-button");
  delete_post_button.click(async function (event) {
    event.preventDefault();
    let post_form = $("#user-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      alert("you need choose one post first");
      return;
    }
    let post_id = valueList[0].value;

    await $.post(
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

  let edit_post_button = $("#edit-post-button");

  edit_post_button.click(async function (event) {
    event.preventDefault();
    let post_form = $("#user-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      alert("you need choose one post first");
      return;
    }
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
  });

  let save_post_button = $("#user-post-edit-save-button");
  save_post_button.click(async function (event) {
    event.preventDefault();

    let id = $("#post-update-id").val();

    await $.get(
      "http://localhost:3000/api/post/" + id,
      async (data) => {
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
        console.log(img)
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
      }
    );
  });
})(jQuery);
