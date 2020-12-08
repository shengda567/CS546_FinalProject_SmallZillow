$('#single-container').ready(function(){
  var commentForm = $('#comment_form');
  var commentsArea = $('#comments-area');
  var commentInput = $('#comment_input');
  var commentError = $('#comment-error');
  var postId = $('#postId').attr("data-id");
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
});
