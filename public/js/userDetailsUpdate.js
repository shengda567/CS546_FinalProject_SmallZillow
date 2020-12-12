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

  let edit_post_button = $("#edit-post-button");

  edit_post_button.click(async function (event) {
    event.preventDefault();
    let post_form = $("#user-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      alert("you need choose one post first");
      return;
    }
    console.log(valueList[0].value);
    let post_name = valueList[0].value;

    await $.post(
      "http://localhost:3000/posts/postName",
      { name: post_name },
      (data) => {
        console.log(data);
        if (data == null) {
          alert("No post found");
        } else {
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
      }
    );
  });

  let save_post_button = $("#user-post-edit-save-button");
  save_post_button.click(async function (event) {
    event.preventDefault();

    let title = $("#title").val();

    await $.post(
      "http://localhost:3000/posts/postName",
      { name: title },
      async (data) => {
        console.log(data);
        let id = data._id;
        let time = $("#date").val();
        let post_adress = $("#post-address").val();
        let city = $("#city").val();
        let state = $("#state").val();
        let zipcode = $("#zipcode").val();
        let description = $("#description").val();
        let tag = $("#tag").val();
        let post_email = $("#post-email").val();
        let post_phone = $("#post-phone").val();
        let price = $("#price").val();
        let img = $("#img").val();

        await $.post(
          `http://localhost:3000/posts/${id}`,
          {
            title: title,
            address: post_adress,
            city: city,
            state: state,
            zipcode: zipcode,
            description: description,
            tag: tag,
            email: post_email,
            phone: post_phone,
            price: price,
          },
          (data) => {
            console.log(data);
            if (data != null) {
              location.reload();
            }
          }
        );
      }
    );
  });
})(jQuery);
