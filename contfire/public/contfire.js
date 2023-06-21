"use strict";

function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    //Others
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

var myAppJavaScript = function myAppJavaScript($) {
  var betaTest = window.meta && window.meta.page && (window.meta.page.customerId === 2904274632738 || window.meta.page.customerId === 972087525410 || window.meta.page.customerId === 2956095455266);

  if (betaTest && $('.cart-header').length) {
    customCartExperience($);
  }

  if ($('meta[property=og\\:price\\:amount][content="0.00"]').remove().length) {
    if (betaTest) {} else {
      removePrices($);
    }

    if ($('body.template-product').length) {
      if (betaTest) {
        customAddToQuoteExperience($);
      } else {
        replaceAddToCartWithQuote($);
      }
    }
  }

  if (betaTest) {
    $('.price-item.price-item--regular').filter(function (i, item) {
      return item.innerText.trim() === '$0.00';
    }).text('Request Quote For Price');
  } else {
    $('.price-item.price-item--regular').filter(function (i, item) {
      return item.innerText.trim() === '$0.00';
    }).remove();
  }

  var $quoteForm = $('#quote-request-form');

  if ($quoteForm.length) {
    var title = document.location.search.match(/title=([^&]+)?/)[1];
    var url = document.location.search.match(/item=([^&]+)?/)[1];

    if (title && url) {
      var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc2X4OFbBD7IDYKXOnK4xD8B_ck-QhsZIHxGSMKKGcFUZZOyw/viewform?usp=pp_url&entry.1358141896=';
      formUrl += title + '+++' + url + '%0A%0A';
      $quoteForm.find('iframe').attr('src', formUrl);
    }
  }

  function customAddToQuoteExperience($) {
    $('#AddToCart-product-template').text('Add to Quote');
  }

  function customCartExperience($) {
    $('.cart__row').addClass('cart__update--show');
    $('.cart__edit').remove();
    $('.cart__price-wrapper').each(function (i, elm) {
      if ($(elm).text().trim() === '$0.00') {
        $(elm).text('Request Quote');
      }
    });
  }

  function getDefaultQuoteRequestUrl($) {
    return 'https://contfire.com/pages/continental-fire-quote-request-form?title=' + encodeURIComponent($('meta[property="og:title"]').attr('content')) + '&item=' + encodeURIComponent(window.location.href);
  }

  function getAlternateQuoteUrl($) {
    var $altQuote = $('[data-mortoneer-quote-url]');

    if ($altQuote.length) {
      return $altQuote.attr('data-mortoneer-quote-url');
    }
  }

  function replaceAddToCartWithQuote($) {
    var url = getAlternateQuoteUrl($) || getDefaultQuoteRequestUrl($);
    $('<a />').attr('href', url).attr('type', 'button').addClass('btn').addClass('product-form__cart-submit').text('Request Quote').insertAfter($('.product__price'));
    $('form.product-form').remove();
  }

  function removePrices($) {
    $('.price__sale, .price__regular, #product_form_1800611266594, .product__policies').remove();
  }
  /*
    Conversion Tracking
  */


  function getGlobeRequestHandler(url) {
    return function () {
      gtag('event', 'conversion', {
        'send_to': 'AW-667557470/31pWCPvUjdkBEN68qL4C',
        'event_callback': function event_callback() {
          window.open(url, '_blank');
        }
      });
      return false;
    };
  }

  $('#request-globe-quote').on('click', getGlobeRequestHandler('/request/globe/quote'));
  $('#request-globe-demo').on('click', getGlobeRequestHandler('/request/globe/demo'));
  $('#request-globe-boots').on('click', getGlobeRequestHandler('/request/globe/boots'));
};

if (typeof jQuery === 'undefined' || parseFloat(jQuery.fn.jquery) < 1.7) {
  loadScript('//ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js', function () {
    var jQuery191 = jQuery.noConflict(true);
    myAppJavaScript(jQuery191);
  });
} else {
  myAppJavaScript(jQuery);
}
