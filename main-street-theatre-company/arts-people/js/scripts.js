if (jQuery) {
  jQuery(function($) {
    // make the ticket buttons pretty
    $('a[data-show]').addClass('btn btn-primary');

    // why do we show that?
    if (jQuery('main strong:contains("sold out")').length) {
      $('#BTNitem_add').closest('tr').parent().closest('tr').parent().closest('td').remove();
    }

    // why is there an empty row taking up space?
    // have you heard of css?
    $('.htable_front_page .show_image_div:first ').closest('tr').remove()

    // make the coupon form pretty
    $('#TXTcoupon_intro')
      .closest('table').parent()
      .closest('table')
      .closest('td')
      .css('padding', '3em')
      // this is bootstrap 4 but there is only bootstrap 3 loaded currently
      .addClass('w-25 p-4');

    // https://app.arts-people.com/index.php?retail=mnstr
    $('#TBLitems').addClass('table')

    // https://app.arts-people.com/index.php?membership=mnstr
    $('#membership_level_table').addClass('table')

    // Take over the "Retail" page for the Academy.
    const $retailHeading = $('h1:contains(Welcome to our online store.)');
    const academyNotStarted = Date.now() < new Date('Feb 15 2022').getTime();
    if (academyNotStarted && $retailHeading.length) {
      $retailHeading
      .text("Main Street Academy - Payment Center")
      .after(`<p>Please start by reviewing the 
      <a href="https://www.mainstreettheatrecompany.org/main-street-academy">Main Street Academy page</a>
       and fill out the <a href="https://docs.google.com/forms/d/e/1FAIpQLScnJYxaupZtM5BzvCt7UWLHaaCMXZtyILsOrqo6pMjSd_pVrA/viewform">form</a> 
       if you have not done so already.</p>`);

      $('title').text('Main Street Academy - Payment Center');
    }
    
    const ATTR_NAME = "data-mortoneer-html-load";
    function loadHtml(index, element) {
      const $form = $(element);
      const formPath = $form.attr(ATTR_NAME);
  
      jQuery.get(formPath, 'html')
      .then((data) => {
        $form.html(data);
      });
    }

    $(`[${ATTR_NAME}]`).each(loadHtml);
  });
}
