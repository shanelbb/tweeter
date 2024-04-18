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
  $('.new-tweet-form').on('submit', onTweetSubmit)
  loadTweets();
})

const onTweetSubmit = function(e) {
  e.preventDefault();
  const $form = $(this);
  const data = $form.serialize();

  $.post('/tweets', data)
    .then(() => {
      console.log("Tweet sent to server")
      // clear form
      $form.trigger('reset')
      // fetch and display latest tweets
      loadTweets()
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

const dateConverter = (date) => {
  const now = Date.now();
  const diff = Math.floor((now - date) / 1000 / 60 / 60 / 24);
  return diff;
};

const createTweetElement = (userTweet) => {
  const days = dateConverter(userTweet.created_at);
  const element = `
  <article class="tweet-container">
        <div class="tweet-profile">
          <div class="tweet-profile-data">
            <img src="${userTweet.user.avatars}" />
            <h2>${userTweet.user.name}</h2>
          </div>
          <h2 class="user-handle">${userTweet.user.handle}</h2>
        </div>
        <p class="tweet-text-area" name="tweets" id="tweets">If I have seen further it is by standing ont the shoulders of giants</p>
        <div class="tweet-footer">
          <p>${days} days ago</p>
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
  for (const data of dataObj) {
    const element = createTweetElement(data);
    $('.tweets-container').append(element)
  }
}

