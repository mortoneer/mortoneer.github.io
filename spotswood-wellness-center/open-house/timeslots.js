/**
 * Scheduling for Spotswood Wellness Center's open house.
 * 
 * @see https://jqueryui.com/dialog/#modal-form
 */

$(function () {

  var $successDialog = $('#open-house-registration-success').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      OK: function () {
        $(this).dialog('close');
      }
    },
  });

  var getClickHandlerFor = function (time, dialog) {
    return function () {
      $('#open-house-time').val(time);
      dialog.dialog('open');
    }
  }

  var register = function ({
    name,
    email,
    phone,
    time,
    partysize,
    type
  }) {
    console.log(`${name} registered for ${time}. ${email} - ${phone} - Party Size: ${partysize} - ${type}`);
    $.ajax({
      type: "POST",
      url: 'https://zy9kzkpff3.execute-api.us-east-1.amazonaws.com/default/swc-open-house',
      data: JSON.stringify({
        name,
        email,
        phone,
        time,
        partysize,
        type
      }),
      contentType: 'application/json',
      dataType: 'json'
    })
    .then(function() {
      $successDialog.dialog('open');
      $('open-house-registration-success-msg').html(`${name},<br><br>Thank you for registering for ${time}. If you need to update your registration, please message us on Facebook.<br><br>Thanks!`)
    })
    .catch(function() {
      $successDialog.dialog('open');
      $('open-house-registration-success-msg').text('')
    });
  }

  var openHouseDialog = $('#open-house-dialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      'Register': processForm,
      Cancel: function () {
        $(this).dialog('close');
      }
    },
    close: function () {

    }
  });

  var processForm = function () {
    var answers = {};
    $('.open-house-data').each(function () {
      answers[$(this).attr('name')] = $(this).val();
    })
    register(answers);
    openHouseDialog.dialog('close');
  }

  $('#open-house-dialog-form').on('submit', function (event) {
    event.preventDefault();
    processForm();
  });

  $('#open-house-timeslots td').each(function () {
    var time = $(this).text();

    var $opener = $(`<a href="#${time}">${time}</div>`)
      .on('click', getClickHandlerFor(time, openHouseDialog))

    $(this).empty().append($opener);
  });
});