if (jQuery) {
  jQuery(function($) {
    // remove art-people's styles
    //$('link[href*=arts-people]').remove();
    $('link[href*=1620mainstreet_mk]').remove();

    // make the ticket buttons pretty
    $('a[data-show]').addClass('btn btn-primary')

    // make the coupon form pretty
    $('#TXTcoupon_intro')
      .closest('table').parent()
      .closest('table')
      .closest('td')
      .css('padding', '3em')
      .addClass('w-25 p-4');

    // https://app.arts-people.com/index.php?retail=mnstr
    $('#TBLitems').addClass('table')
    // https://app.arts-people.com/index.php?membership=mnstr
    $('#membership_level_table').addClass('table')

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
