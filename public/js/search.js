
  // Let's start writing AJAX calls!
(function ($) {
  var priceRange = $('#priceRange');
  var selectTag = $('#selectTag');
  var searchForm = $('#search_form');
  var postArea = $('#results');
  var searchInput = $('#search_input');
  var errorMessage = $('#search-error-message1');
  var errorArea = $('#error-area');
  let pTag2 = `Here are some of the apartments we currently have`;


  if(errorMessage.text() != ""){
    let pTag = ` <p class = 'search-error-message'>${errorMessage.text()}. ${pTag2}</p>`;
    errorArea.append(pTag);
  }
  postArea.show()

  priceRange.on('change', function() {
    errorArea.empty();
    var search_input = searchInput.val();
    var price = priceRange.val();
    var tag = selectTag.val();
    var requestConfig = {
        method: 'POST',
        url: '/api/search',
        contentType: 'application/json',
        data: JSON.stringify({
          search_input: search_input,
          price: price,
          tag: tag
      })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      let newElement = $(responseMessage);
      postArea.empty();
      postArea.append(newElement);
      let errorMessage2 = $('#search-error-message2');
      if(errorMessage2.text() != ""){
        let pTag = ` <p class = 'search-error-message'>${errorMessage2.text()}. ${pTag2}</p> `;
        errorArea.append(pTag);
      }

      postArea.show()
    });
  });
  selectTag.on('change', function() {
    errorArea.empty();
    var search_input = searchInput.val();
    var price = priceRange.val();
    var tag = selectTag.val();
    var requestConfig = {
        method: 'POST',
        url: '/api/search',
        contentType: 'application/json',
        data: JSON.stringify({
          search_input: search_input,
          price: price,
          tag: tag
      })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      let newElement = $(responseMessage);
      postArea.empty();
      postArea.append(newElement);
      let errorMessage2 = $('#search-error-message2');
      if(errorMessage2.text() != ""){
        let pTag = ` <p class = 'search-error-message'>${errorMessage2.text()}. ${pTag2}</p>`;
        errorArea.append(pTag);
      }
      postArea.show();

    });

  });
  searchForm.submit(function (event) {
    event.preventDefault();
    errorArea.empty();
    var search_input = searchInput.val();
    var price = priceRange.val();
    var tag = selectTag.val();

    var requestConfig = {
        method: 'POST',
        url: '/api/search',
        contentType: 'application/json',
        data: JSON.stringify({
          search_input: search_input,
          price: price,
          tag: tag
      })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      let newElement = $(responseMessage);
      postArea.empty();
      postArea.append(newElement);
      let errorMessage2 = $('#search-error-message2');
      if(errorMessage2.text() != ""){

        let pTag = `<p class = 'search-error-message'>${errorMessage2.text()}. ${pTag2}</p> `;
        errorArea.append(pTag);
      }
      postArea.show();

    });
  });
})(jQuery);
