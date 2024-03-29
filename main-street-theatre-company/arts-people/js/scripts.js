if (jQuery) {
  jQuery(function ($) {
    // make the ticket buttons pretty
    $('a[data-show]').addClass('btn btn-primary');

    // why do we show that?
    if (jQuery('main strong:contains("sold out")').length) {
      $('#BTNitem_add')
        .closest('tr')
        .parent()
        .closest('tr')
        .parent()
        .closest('td')
        .remove();
    }

    // why is there an empty row taking up space?
    // have you heard of css?
    $('.htable_front_page .show_image_div:first ').closest('tr').remove();

    // make the coupon form pretty
    $('#TXTcoupon_intro')
      .closest('table')
      .parent()
      .closest('table')
      .closest('td')
      .css('padding', '3em')
      // this is bootstrap 4 but there is only bootstrap 3 loaded currently
      .addClass('w-25 p-4');

    // These places need pretty tables.
    // https://app.arts-people.com/index.php?retail=mnstr
    // https://app.arts-people.com/index.php?membership=mnstr
    $('#TBLitems,#membership_level_table').addClass('table');

    const ATTR_NAME = 'data-mortoneer-html-load';
    function loadHtml(index, element) {
      const $form = $(element);
      const formPath = $form.attr(ATTR_NAME);

      jQuery.get(formPath, 'html').then((data) => {
        $form.html(data);
      });
    }

    $(`[${ATTR_NAME}]`).each(loadHtml);

    $('#TBL300 tr').appendTo($('#TBL240'))
    $('#TBL300').closest('td').remove()
    $('#TBL236').closest('td').css('width', '50%').removeProp('width')

    // if (!document.referrer.includes('arts-people') && /[?&]show=/.exec(location.search)) {
    //   // ticketing param resets the cookie (maybe), so cart goes missing
    //   history.pushState('https://app.arts-people.com/index.php?ticketing=mnstr');
    // }

    // grab the preseason and add it to the main season
    // you cannot buy tickets cross-season, so if you have a cart link (items in your cart), it will NOT grab the preseason
    // if (jQuery('.page_public.tt-page-160').length && !jQuery('#link-cart').length) {
    //   jQuery.get('https://app.arts-people.com/index.php?preseason=mnstr', 'html').then(data => {
    //     const $preseason = jQuery(data).find('.htable_front_page tbody');
    //     $preseason.find('a').addClass('btn btn-primary').prop('data-show-link', '1').prop('show-data', );
    //     const $preseasonRows = $('tr', $preseason);
    //     jQuery('td > .normal#TXTdescription', $preseason).wrap('<div class="show_text_div">');
    //     jQuery('.htable_front_page tbody').append($preseasonRows);
    //   });
    // }

    if ($('.page_public.tt-page-3679').length) {
      // this is the preseason page
      jQuery('td > .normal#TXTdescription').wrap('<div class="show_text_div">');
      jQuery('a:contains("Buy Tickets")').addClass('btn btn-primary');
    }

  });
}

try {
  if (window.location.href.indexOf('retail=mnstr') !== -1) {
    document.title = 'Sales | Main Street Theatre Company';
  }
}
catch(err) {
  console.error('unable to change location')
}
