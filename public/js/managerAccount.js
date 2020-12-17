(function ($) {
  let all_posts_button = $("#allpost-button");
  all_posts_button.click(async function (event) {
    event.preventDefault();
    let all_posts_container = $("#manager-all-posts-container");
    let manager_history_container = $("#manager-history-container");
    manager_history_container.hide();
    all_posts_container.show();
  });

  let manager_history_button = $("#manager-history-button");
  manager_history_button.click(async function (event) {
    event.preventDefault();
    let all_posts_container = $("#manager-all-posts-container");
    let manager_history_container = $("#manager-history-container");
    all_posts_container.hide();
    manager_history_container.show();
  });

  let manager_delete_post_button = $("#manager-delet-post-button");
  manager_delete_post_button.click(async function (event) {
    event.preventDefault();

    let post_form = $("#manager-account-post-form");
    let valueList = post_form.serializeArray();
    if (valueList.length == 0) {
      alert("you need choose one post first");
      event.stopPropagation();
      return;
    }

    console.log(valueList[0].value);
    let post_id = valueList[0].value;

    await $.get(
      "http://localhost:3000/api/post/" + post_id,
      //{ name: post_name },
      (data) => {
        //console.log(data);
        if (data == null) {
          alert("No post found");
        } else {
          let delete_post_id = $("#manager-delete-post-id");
          let manager_delete_modal_p = $("#manager-delete-modal-body-p");
          delete_post_id.text(`${data._id}`);
          manager_delete_modal_p.text("");
          manager_delete_modal_p.text(
            `You will delete the post: ${data.title} ?`
          );
        }
      }
    );
  });

  let manager_yes_delete_post_button = $("#manager-delete-yes");
  manager_yes_delete_post_button.click(async function (event) {
    event.preventDefault();

    let post_id = $("#manager-delete-post-id").text();
    let post_name = $("#manager-delete-modal-body-p").text();
    post_name = post_name.slice(26, post_name.length - 2);
    //console.log(post_name);

    let id = $("#manager-id").val();
    let manager_history = [];

    $.ajax({
      type: "DELETE",
      url: "/posts/" + post_id,
      dataType: "json",
      success: async function () {
        alert("Delete successfully");
        manager_history.push(post_name);
        await $.post(
          `http://localhost:3000/managers/${id}`,
          { manager_history: manager_history },
          (data) => {
            console.log(data);
            location.reload();
          }
        );
        location.reload();
      },
    });
  });

  let save_manager_profile_button = $("#manager-account-edit-save-button");
  save_manager_profile_button.click(async function (event) {
    event.preventDefault();
    $("#manager-edit-error").hide();
    let username = $("#manager-username").val();
    let email = $("#manager-email").val();
    let manager_level = $("#manager_level").val();

    const emailReq = RegExp(
      "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$"
    );
    if (!emailReq.exec(email)) {
      $("#manager-edit-error").html(
        "Email must be the format: [zhangsan-001@gmail.com]."
      );
      $("#manager-edit-error").show();
      return;
    }
    save_manager_profile_button.attr("data-dismiss", "modal");
    let id = $("#manager-id").val();
    console.log("123");
    await $.post(
      `http://localhost:3000/managers/${id}`,
      { username, email, manager_level },
      (data) => {
        console.log(data);
        if (data != null) {
          location.reload();
        }
      }
    );
  });
})(jQuery);
