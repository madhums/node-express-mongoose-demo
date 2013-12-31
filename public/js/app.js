$(document).ready(function () {

  // confirmations
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Are you sure?';
    bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('#tags').tagsInput({
    'height':'60px',
    'width':'280px'
  });

});


function reply(commentId) {
  container = $('.comment[comment-id="' + commentId + '"] > .comment-reply-form');

  container.html($('#comment-form').clone())
  container.find('form input[name=parent]').val(commentId);
  container.find('button[type=submit]').click(function() {
    setTimeout(function() {
      container.find('form').empty();
    }, 3000);
    container.find('form').hide();

    return true;
  });
}
