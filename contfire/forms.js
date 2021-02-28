jQuery(($) => {
  var title = document.location.search.match(/title=([^&]+)?/);
  var url = document.location.search.match(/item=([^&]+)?/);
  title = title && title[1];
  url = url && url[1];

  const ATTR_NAME = "data-mortoneer-form-load";
  function initializeForm(index, element) {
    const $form = $(element);
    const formPath = $form.attr(ATTR_NAME);

    jQuery.get(formPath, 'html')
    .then((data) => {
      $form.html(data);

      if (title && url) {
        $form.find('#item-list').append(`${title} ${url}`)
      }

      // for Shopify: theme style makes inputs wide
      $form.addClass('form-vertical');
    });
  }

  $(`[${ATTR_NAME}]`).each(initializeForm);
});
