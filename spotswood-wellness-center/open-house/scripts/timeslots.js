/**
 * Scheduling for Spotswood Wellness Center's open house.
 * 
 * @see https://jqueryui.com/dialog/#modal-form
 */

$(function () {

  var convertTime = time => time.match(/1?[0-9]:[0-5][0-9][ap]m/)[0]

  $('body').addClass('open-house');

  var $successDialog = $('#open-house-registration-success').dialog({
    autoOpen: false,
    height: 500,
    width: 350,
    modal: true,
    closeText: '',
    buttons: {
      OK: function () {
        $(this).dialog('close');
      }
    },
  });

  var getClickHandlerFor = function (time, dialog) {
    return function () {
      $('#open-house-time').val(time);
      $('.insert-time-for-form').text(time);
      dialog.dialog('open');
    }
  }

  var register = function ({
    name,
    email,
    phone,
    time,
    partySize,
    type
  }) {
    console.log(`${name} registered for ${time}. ${email} - ${phone} - Party Size: ${partySize} - ${type}`);

    gtag('event', 'open-house-timeslot-submit', {
      'send_to': 'UA-183714801-1',
      'event_category' : 'engagement'
    });

    $.ajax({
      type: "POST",
      url: 'https://zy9kzkpff3.execute-api.us-east-1.amazonaws.com/default/swc-open-house',
      data: JSON.stringify({
        name,
        email,
        phone,
        time: convertTime(time),
        partySize,
        type
      }),
      contentType: 'application/json',
      dataType: 'json'
    })
    .then(function(data) {
      $successDialog.dialog('open');
      if (data && data.statusCode === 200) {
        $('#open-house-registration-success-msg').html(
          `${name},
          <br><br>
          Thank you for registering for the <em>${time}</em> session. If you need to update your registration, please message us on Facebook.
          <br><br>
          Thanks!`)
      } else {
        $('#open-house-registration-success-msg').html(`We seem to have encountered a problem. Please call us to book your spot.`)
      }
    })
    .catch(function() {
      $successDialog.dialog('open');
      $('#open-house-registration-success-msg').text(`We seem to have encountered a problem. Please call us to book your spot.`)
    });
  }

  var processForm;

  var openHouseDialog = $('#open-house-dialog').dialog({
    autoOpen: false,
    open: function () {
      $('.open-house-warning').removeClass('ui-icon');
      $('.ui-dialog-buttonpane').addClass('wp-block-buttons');
      $('.ui-dialog-buttonset').addClass('wp-block-button');
      $('.ui-dialog-buttonpane .ui-button')
        .removeClass('ui-button ui-corner-all ui-widget')
        .addClass('wp-block-button__link');
    },
    height: 585,
    width: 400,
    modal: true,
    closeText: '',
    buttons: {
      'Register': function() {
        processForm();
      }
    },
    close: function () {

    }
  });

  processForm = function () {
    var answers = {};
    var bad = false;
    $('.open-house-data').each(function () {
      answers[$(this).attr('name')] = $(this).val();
      if (!$(this).val()) bad = true;
    })

    if (bad) {
      $('.open-house-warning').addClass('ui-icon').focus();
    } else {
      register(answers);
      openHouseDialog.dialog('close');
    }
  }

  $('#open-house-dialog-form').on('submit', function (event) {
    event.preventDefault();
    processForm();
  });

  $.get('https://zy9kzkpff3.execute-api.us-east-1.amazonaws.com/default/swc-open-house')

  .then(function(times) {

    $('#open-house-timeslots td').each(function () {
      var time = $(this).text();
      var converted = convertTime(time);

      if (times[converted] && times[converted] > 4) {
        $(this).empty().append(`<span style="text-decoration: line-through;">${time}</span>`);
      } else {
        var $opener = $(`<a href="#${time}">${time}</a>`)
          .on('click', getClickHandlerFor(time, openHouseDialog))
  
        $(this).empty().append($opener);
      }
    });
  });
});