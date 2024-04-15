const app = {};

app.composeTweet = function() {
  let count = 140;
  let txtVal = $(this).val();
  count = count - txtVal.length;
  let counter = $('.counter');
  counter.text(count);
  count < 0 ? counter.addClass('counter-color') : counter.removeClass('counter-color')
};

$(document).ready(function() {
  $('#tweet-text').on('keyup', app.composeTweet)
});

