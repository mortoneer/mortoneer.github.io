// include this as an async script in the head of your wordpress theme

jQuery(function($) {
  $('#lab-partner-link a[href], #covid-lab-link-direct').on('click', function() {

    var url = $(this).attr('href');
    
    gtag('event', 'covid-19-link', {
      'send_to': 'UA-183714801-1',
      'event_category' : 'engagement',
      'event_callback': function () {
        window.open(url, '_blank');
      }
    });

    return false;
  });
});