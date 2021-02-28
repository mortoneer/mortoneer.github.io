jQuery(($) => {
  var title = document.location.search.match(/title=([^&]+)?/)[1];
  var url = document.location.search.match(/item=([^&]+)?/)[1];

  const ATTR_NAME = "data-mortoneer-form-load";
  function initializeForm(index, element) {
    const $form = $(element);
    const formPath = $form.data(ATTR_NAME);

    jQuery.get(formPath, 'html')
    .then((data) => {
      $form.html(data);

      if (title && url) {
        $form.find('#item-list').append(`${title} ${url}`)
      }
    });
  }

  $(`[${ATTR_NAME}]`).each(initializeForm);
});
