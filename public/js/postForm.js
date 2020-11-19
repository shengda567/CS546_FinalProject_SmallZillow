<<<<<<< HEAD
$("#postForm").submit((event) => {
  event.preventDefault();
  $("#postErrorList").empty();
  // empty check
  let hasError = false;
  let title = $("#post-title-input").val().trim();
  let address = $("#post-address-input").val().trim();
  let city = $("#post-city-input").val().trim();
  let zipcode = $("#post-zipcode-input").val().trim();
  let description = $("#post-description-input").val().trim();
  let email = $("#post-email-input").val().trim();
  let phone = $("#post-phone-input").val().trim();
  let prices = $("#post-prices-input").val().trim();
  if (!title) {
    //const li = `<li>you must enter a title<li>`;
    $("#postErrorList").append(`<li>You must enter a title</li>`);
    hasError = true;
  }
  if (!address) {
    $("#postErrorList").append(`<li>You must enter a address</li>`);
    hasError = true;
  }
  if (!city) {
    $("#postErrorList").append(`<li>You must enter a city</li>`);
    hasError = true;
  }
  if (!zipcode) {
    $("#postErrorList").append(`<li>You must enter a zipcode</li>`);
    hasError = true;
  }
  if (!description) {
    $("#postErrorList").append(`<li>You must enter a house description</li>`);
    hasError = true;
  }
  if (!email) {
    $("#postErrorList").append(`<li>You must enter a email</li>`);
    hasError = true;
  }
  if (!phone) {
    $("#postErrorList").append(`<li>You must enter a phone number</li>`);
    hasError = true;
  }
  if (!prices) {
    $("#postErrorList").append(`<li>You must enter a prices</li>`);
    hasError = true;
  }
  // type check
  //1.zipcode && phone check
  let numberCheck = /[0-9]/;
  let zipCheck = true;
  for (let i = 0; i < zipcode.length; i++) {
    if (!numberCheck.test(zipcode[i])) {
      zipCheck = false;
      break;
    }
  }
  if (zipcode && zipCheck == false) {
    $("#postErrorList").append(`<li>Invalid zipcode, must be number</li>`);
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
    $("#postErrorList").append(`<li>Invalid phone number, must be number</li>`);
    hasError = true;
  }

  let pricesCheck = true;
  for (let i = 0; i < prices.length; i++) {
    if (!numberCheck.test(prices[i])) {
      pricesCheck = false;
      break;
    }
  }
  if (prices && pricesCheck == false) {
    $("#postErrorList").append(`<li>Invalid prices, must be number</li>`);
    hasError = true;
  }

  if (hasError) {
    $("#post-errors").show();
  } else {
    window.location.href = "http://localhost:3000/posts/succuss";
    //$("#postForm").trigger("reset");
  }
});
=======
window.onload = function () {
  var input = document.getElementById("file_input");
  var result;
  var dataArr = []; //save selected img filename and base64 data
  var fd; //FormData send request
  var oAdd = document.getElementById("postImg");
  var oInput = document.getElementById("file_input");

  if (typeof FileReader === "undefined") {
    alert("Sorry, your browser does not support FileReader");
    input.setAttribute("disabled", "disabled");
  } else {
    input.addEventListener("change", readFile, false);
  } //handler
  function readFile() {
    fd = new FormData();
    var iLen = this.files.length;

    for (var i = 0; i < iLen; i++) {
      if (!input["value"].match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {
        return alert("Wrong img type try agin");
      }
      var reader = new FileReader();
      fd.append(i, this.files[i]);
      reader.readAsDataURL(this.files[i]); //trans to base64
      reader.fileName = this.files[i].name;
      reader.onload = function (e) {
        var imgMsg = {
          name: this.fileName, //file name
          base64: this.result, // after reader.readAsDataURL execute , save base64 data in reader.result
        };
        dataArr.push(imgMsg);
        result =
          '<div class="delete">delete</div><div class="result"><img class="subPic" src="' +
          this.result +
          '" alt="' +
          this.fileName +
          '"/></div>';
        var div = document.createElement("div");
        div.innerHTML = result;
        div["className"] = "float";
        document.getElementsByTagName("body")[0].appendChild(div); //insert dom tree
        var img = div.getElementsByTagName("img")[0];
        img.onload = function () {
          var nowHeight = ReSizePic(this); //setting img size
          this.parentNode.style.display = "block";
          var oParent = this.parentNode;
          if (nowHeight) {
            oParent.style.paddingTop = (oParent.offsetHeight - nowHeight) / 2 + "px";
          }
        };
        div.onclick = function () {
          $(this).remove(); // delete
        };
      };
    }
  }

  function send() {
    var submitArr = [];
    $(".subPic").each(function () {
      submitArr.push({
        name: $(this).attr("alt"),
        base64: $(this).attr("src"),
      });
    });
    $.ajax({
      url: "http://123.206.89.242:9999",
      type: "post",
      data: JSON.stringify(submitArr),
      dataType: "json",
      //processData: false,  trans form data need these two
      //contentType: false,
      success: function (data) {
        console.log("The return data: " + JSON.stringify(data));
      },
    });
  }

  oAdd.onclick = function () {
    oInput.value = ""; // clean oInput
    oInput.click();
  };

  function ReSizePic(ThisPic) {
    var RePicWidth = 200; //width to show
    var TrueWidth = ThisPic.width;
    var TrueHeight = ThisPic.height;
    if (TrueWidth > TrueHeight) {
      var reWidth = RePicWidth;
      ThisPic.width = reWidth;
      //set to mid
      var nowHeight = TrueHeight * (reWidth / TrueWidth);
      return nowHeight;
    } else {
      //when width less than height
      var reHeight = RePicWidth;
      ThisPic.height = reHeight;
    }
  }

  let formSubmit = document.getElementById("postForm");
  let imgButton = document.getElementById("postImg");
  formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();
    $("#postErrorList").empty();
    // empty check
    let hasError = false;
    let title = $("#post-title-input").val().trim();
    let address = $("#post-address-input").val().trim();
    let city = $("#post-city-input").val().trim();
    let zipcode = $("#post-zipcode-input").val().trim();
    let description = $("#post-description-input").val().trim();
    let email = $("#post-email-input").val().trim();
    let phone = $("#post-phone-input").val().trim();
    let prices = $("#post-prices-input").val().trim();

    if (!dataArr.length) {
      $("#postErrorList").append(`<li>You must upload your house pictures</li>`);
    }

    if (!title) {
      //const li = `<li>you must enter a title<li>`;
      $("#postErrorList").append(`<li>You must enter a title</li>`);
      hasError = true;
    }
    if (!address) {
      $("#postErrorList").append(`<li>You must enter a address</li>`);
      hasError = true;
    }
    if (!city) {
      $("#postErrorList").append(`<li>You must enter a city</li>`);
      hasError = true;
    }
    if (!zipcode) {
      $("#postErrorList").append(`<li>You must enter a zipcode</li>`);
      hasError = true;
    }
    if (!description) {
      $("#postErrorList").append(`<li>You must enter a house description</li>`);
      hasError = true;
    }
    if (!email) {
      $("#postErrorList").append(`<li>You must enter a email</li>`);
      hasError = true;
    }
    if (!phone) {
      $("#postErrorList").append(`<li>You must enter a phone number</li>`);
      hasError = true;
    }
    if (!prices) {
      $("#postErrorList").append(`<li>You must enter a prices</li>`);
      hasError = true;
    }

    // type check
    //1.zipcode && phone check
    let numberCheck = /[0-9]/;
    let zipCheck = true;
    for (let i = 0; i < zipcode.length; i++) {
      if (!numberCheck.test(zipcode[i])) {
        zipCheck = false;
        break;
      }
    }
    if (zipcode && zipCheck == false) {
      $("#postErrorList").append(`<li>Invalid zipcode, must be number</li>`);
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
      $("#postErrorList").append(`<li>Invalid phone number, must be number</li>`);
      hasError = true;
    }

    let pricesCheck = true;
    for (let i = 0; i < prices.length; i++) {
      if (!numberCheck.test(prices[i])) {
        pricesCheck = false;
        break;
      }
    }
    if (prices && pricesCheck == false) {
      $("#postErrorList").append(`<li>Invalid prices, must be number</li>`);
      hasError = true;
    }
    if (hasError) {
      $("#postFormErrors").show();
    } else {
      send();
      window.location.href = "http://localhost:3000/newpost/success";
      //$("#postForm").trigger("reset");
    }
  });

  imgButton.addEventListener("click", (event) => {
    event.preventDefault();
  });

  function showTime() {
    let date = new Date();
    date = date.toLocaleDateString();
    return date;
  }

  $("#timestamp").text(showTime());
};
>>>>>>> 68272472bde1193c207805765ad3b6400d66b226
