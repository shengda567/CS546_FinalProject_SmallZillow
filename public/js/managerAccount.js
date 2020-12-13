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
          let manager_delete_modal_p = $("#manager-delete-modal-body-p");
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

    let post_name = $("#manager-delete-modal-body-p").text();
    post_name = post_name.slice(26, post_name.length - 2);
    console.log(post_name);

    let id = $("#manager-id").val();
    let manager_history = [];
    await $.post(
      "http://localhost:3000/posts/postName",
      { name: post_name },
      async (data) => {
        await $.post(
          `http://localhost:3000/posts/delete/${data._id}`,
          async (data) => {
            console.log(data);
            if (data != null) {
              manager_history.push(data.post.title);
              await $.post(
                `http://localhost:3000/managers/${id}`,
                { manager_history: manager_history },
                async (data) => {
                  console.log(data);
                  location.reload();
                }
              );
            }
          }
        );
      }
    );
  });

  save_manager_profile_button = $("#manager-account-edit-save-button");
  save_manager_profile_button.click(async function (event) {
    event.preventDefault();
    let username = $("#manager-username").val();
    let email = $("#manager-email").val();
    let manager_level = $("#manager_level").val();
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
