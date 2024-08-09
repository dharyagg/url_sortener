;(function() {
  const regex = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i)
  var $urlInput = $('#url_input')
  var $errorMsg = $('#error_msg')
  var $shortenBtn = $('#shorten_btn')
  var $shortenedPlace = $('#shortened_place')
  var $visitedPlace = $('#visited_place')
  var $resultContainer = $('#result_container')
  var $copyBtn = $('#copy_btn')

  function showError(errorMsg) {
      $errorMsg
        .html(errorMsg)
        .removeClass('is-invisible')
      $urlInput.removeClass('is-primary').addClass('is-danger')
      $shortenBtn
        .attr('disabled', true)
        .removeClass('is-primary')
        .addClass('is-danger')
  }

  function hideError() {
    $errorMsg.addClass('is-invisible')
    $urlInput.addClass('is-primary').removeClass('is-danger')
    $shortenBtn
      .attr('disabled', false)
      .addClass('is-primary')
      .removeClass('is-danger')
  }

  function disableInput() {
    $shortenBtn
      .addClass('is-loading')
      .attr('disabled', true)
    $urlInput.attr('disabled', true)
  }

  function enableInput() {
    $shortenBtn
      .removeClass('is-loading')
      .attr('disabled', false)
    $urlInput.attr('disabled', false)
  }

  $urlInput.on('input', hideError)

  $('#main_form').submit(function(e) {
    e.preventDefault()

    $resultContainer.addClass('is-invisible')
    hideError()

    var url = $(this).serializeArray()[0].value
    url = url.replace('!"#$%&\'()*+,-./@:;<=>[\\]^_`{|}~', '').trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    if (url.match(regex) === null) {
      showError('The URL is invalid')
      return
    }

    disableInput()
    $.post(
      '/shorten',
      {url: url},
      function(data) {
        $shortenedPlace
          .attr('href', data.hash)
          .html(window.location.href + data.hash)
        $visitedPlace.html(data.visited_times)
        $resultContainer.removeClass('is-invisible')
    })
      .always(enableInput)
      .fail(function(data) {
        if (data.responseText) {
          showError(data.responseText)
        } else {
          showError('Sorry, something went wrong')
        }
        enableInput()
      })
  })

  $copyBtn.on('click', function() {
    var tempInput = document.createElement('input')
    tempInput.value = $shortenedPlace.html()
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)

    $copyBtn.html('Copied!')
    setTimeout(function() {
      $copyBtn.html('Copy')
    }, 1500)
  })
})()
