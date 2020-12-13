window.onload = function () {
  var commentForm = $('#comment_form');
  var commentsArea = $('#comments-area');
  var commentInput = $('#comment_input');
  var commentError = $('#comment-error');
  var postId = $('#postId').attr("data-id");
  var recommendPosts = $('#recommendPosts-area');
  var address = $('#address').attr("data");
  var state = $('#state').attr("data");
  var city = $('#city').attr("data");
  var zipcode = $('#zipcode').attr("data");

    var requestConfig1 = {
        method: 'POST',
        url: '/api/similarPosts' ,
        contentType: 'application/json',
        data:JSON.stringify({
          zipcode:zipcode,
          address:address,
          city:city,
          state:state
      })
    };

    $.ajax(requestConfig1).then(function (responseMessage) {
        let newElement = $(responseMessage);

        recommendPosts.append(newElement);
    });



  // when clicking the button start the timeline/animation:
  document.querySelector(".like-button" ).addEventListener('click', async function(e) {
    let user = $('#user-error-message').attr("data");
    e.currentTarget.classList.toggle('liked');
    if(user == 'false'){
      $('#user-error-message').show();
    }
    else{
      if($("#heart").hasClass("clicked")){

        console.log("2")
        $("#heart").addClass("clicked");
        await $.post(
          "http://localhost:3000/users/remove/" + postId,
          (data) => {
            console.log(data);
          }
        );

      }else{
        console.log("1")
        $("#heart").removeClass("clicked");
        await $.post(
          "http://localhost:3000/users/add/" + postId,
          (data) => {
            console.log(data);
          }
        );

       }
     }
  });

  commentForm.submit(function (event) {
    event.preventDefault();
    let comment_input = commentInput.val();
    var requestConfig = {
        method: 'POST',
        url: '/comments/' + postId,
        contentType: 'application/json',
        data:JSON.stringify({
          comment_input:comment_input
      })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      if(responseMessage.error){
        let newElement = "<p class = 'comment-error-message'> " + responseMessage.error + "</p>";
        commentError.append(newElement);
        commentError.show();

      }else{
        let newElement = $(responseMessage);
        commentsArea.empty();
        commentInput.empty();
        commentsArea.append(newElement);
      }


    });
  });
}
