/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(() => {
  loadTweets();
  // remove warning message on keydown in new tweet textarea
  $("#tweet-text").on("keydown", () => {
    $(".warning").text("");
  });
  // event listener to show and hide new tweet section when nav button is clicked
  $(".nav-btn").on("click", function() {
    $(".new-tweet").toggleClass('hide')

  });
  // submit event on tweet button to log new tweet
  $('.new-tweet-form').on('submit', onTweetSubmit)
})

const onTweetSubmit = function(e) {
  e.preventDefault();
  const $form = $(this);
  const $counter = $(".counter");
  const $warning = $(".warning");

  // Form validation - display err msg if no text is input into text area
  if (!$("#tweet-text").val().trim()) {
    $warning.text("Oops! You forgot to write your tweet.");
    return;
  }
  // Form validation - display error if text is over character count
  if ($counter.val() < 0) {
    $warning.text("Dang! You wrote too much.");
    return;
  }

  // Use serialize method to return dat as a query string that will be sent to the server in the data field of the AJAX Post request
  const data = $form.serialize();

  // if no validation errors, run load tweets on form submission
  $.post("/tweets", data)
    .then(() => {
      // fetch and display latest tweets
      loadTweets();
      // reset form fields
      $counter.text("140");
      $warning.text("");
      // clear form
      $form.trigger("reset");
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      // log error to the console
      console.error("There was an error submitting the tweet: ", textStatus, errorThrown);
    });
}

const loadTweets = () => {
  // Make an AJAX request to fetch tweets
  $.ajax({
    url: "/tweets",
    method: "GET",
    datatype: "json",
    success: (tweets) => {
      renderTweets(tweets);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      console.error("There was an error fetching the tweets: ", textStatus, errorThrown);
    },
  });
};

// create the tweet article element dynamically upon successful form submission
const createTweetElement = (userTweet) => {
  // Use timeago api to display time tweet was created
  const date = new Date(userTweet.created_at);
  const dateString = timeago.format(date)
  // escape text function to avoid cross-site scripting.
  const escapeText = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
  const element = `
  <article class="tweet-container">
        <div class="tweet-profile">
          <div class="tweet-profile-data">
            <img src="${userTweet.user.avatars}" />
            <h2>${userTweet.user.name}</h2>
          </div>
          <h2 class="user-handle">${userTweet.user.handle}</h2>
        </div>
        <p class="tweet-content" name="tweets" id="tweets">${escapeText(userTweet.content.text)}</p>
        <div class="tweet-footer">
          <p>${dateString}</p>
          <ul>
            <li><i class="fa-solid fa-flag"></i></li>
            <li><i class="fa-solid fa-retweet"></i></li>
            <li><i class="fa-solid fa-heart"></i></li>
          </ul>
        </div>
      </article>
  `;
  return element;
};

const renderTweets = (dataObj) => {
  // empty tweets-container upon each render to avoid duplicate posts
  $(".tweets-container").empty();
  // loop through user tweets object and display data on the page.
  for (const data of dataObj) {
    const element = createTweetElement(data);
    $('.tweets-container').prepend(element)
  }
}

