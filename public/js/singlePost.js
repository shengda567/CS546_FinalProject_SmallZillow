window.onload = function () {
  var commentForm = $('#comment_form');
  var commentsArea = $('#comments-area');
  var commentInput = $('#comment_input');
  var commentError = $('#comment-error');
  var postId = $('#postId').text();
  var recommendPosts = $('#recommendPosts-area');
  var address = $('#address').text();
  var state = $('#state').text();
  var city = $('#city').text();
  var zipcode = $('#zipcode').text();
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
    let user = $('#user-error-message').text();;
    if(user == 'false'){
      alert("You have to login first!");
    }
    else{
      e.currentTarget.classList.toggle('liked');
      if($("#heart").hasClass("clicked")){

        $("#heart").addClass("clicked");
        await $.post(
          "http://localhost:3000/users/remove/" + postId,
          (data) => {
            console.log("Removed the post from user");
          }
        );

      }else{
        $("#heart").removeClass("clicked");
        await $.post(
          "http://localhost:3000/users/add/" + postId,
          (data) => {
              console.log("Saved the post from user");
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
