$(function () {

  function getClickHandlerFor(time, dialog) {
    return function() {
      $('#open-house-time').val(time);
      dialog.dialog("open");
    }
  }

  function register({
    name,
    email,
    phone,
    time,
    partysize
  }) {
    console.log(`${name} registered for ${time}. ${email} - ${phone} - Party Size: ${partysize}`);
  }

  var openHouseDialog = $('#open-house-dialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Register": processForm,
      Cancel: function () {
        dialog.dialog("close");
      }
    },
    close: function () {
      form[0].reset();
    }
  });

  function processForm() {
    var answers = {};
    $('.open-house-data').each(function() {
      answers[$(this).attr('name')] = $(this).val();
    })
    register(answers);
  }

  $('#open-house-dialog-form').on("submit", function (event) {
    event.preventDefault();
    processForm();
  });

  $("td").button().on("click", function () {
    dialog.dialog("open");
  });

  $('#timeslots td').each(function() {
    var time = $(this).text();
    
    $('<div></div>')
      .text(time)
      .button()
        .on('click', getClickHandlerFor(time, openHouseDialog))
  });
});