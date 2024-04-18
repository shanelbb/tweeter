/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetData = [
  {
    user: {
      name: "Newton",
      avatars: "https://i.imgur.com/73hZDYK.png",
      handle: "@SirIsaac",
    },
    content: {
      text: "If I have seen further it is by standing on the shoulders of giants",
    },
    created_at: 1711600892431,
  },
  {
    user: {
      name: "Descartes",
      avatars: "https://i.imgur.com/nlhLi3I.png",
      handle: "@rd",
    },
    content: {
      text: "Je pense , donc je suis",
    },
    created_at: 1711687292431,
  },
];

$(() => {
  $("#tweet-text").on("keydown", () => {
    $(".warning").text("");
  });
  loadTweets();
  $('.new-tweet-form').on('submit', onTweetSubmit)
})

const onTweetSubmit = function(e) {
  e.preventDefault();
  const $form = $(this);
  const $counter = $('.counter')

  if (!$('#tweet-text').val().trim()) {
    $(".warning").text("Oops! You forgot to write your tweet.");
    return;
  }

  if ($counter.val() < 0) {
    $(".warning").text("Dang! You wrote too much.");
    return;
  }

  const data = $form.serialize();

  $.post('/tweets', data)
  .then(() => {
    // fetch and display latest tweets
    loadTweets()
    $counter.text('140')
    $(".warning").text("");
    // clear form
    $form.trigger('reset')
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      // log error to the console
    console.error("There was an error submitting the tweet: ", textStatus, errorThrown)
  })
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

const createTweetElement = (userTweet) => {
  const timeAgoString = jQuery.timeago(userTweet.created_at)
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
          <p>${timeAgoString}</p>
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
  $(".tweets-container").empty();
  for (const data of dataObj) {
    const element = createTweetElement(data);
    $('.tweets-container').prepend(element)
  }
}

