/**
 * Take over the "Retail" page for the Academy.
 * 
 * Adds a message to the retail page. Changes the welcome message.
 * 
 * In order for this code to be activated, you must update the "retail_page" message in arts people to include the "academy-take-over" class like this:
 * 
 * <h1 class="academy-take-over">Welcome to our online store.</h1>
 */

    if ($('.academy-take-over').length) {
      const $retailHeading = $('h1:contains(Welcome to our online store.)');
      const enrollingNow = Date.now() < new Date('Nov 1 2022').getTime();
      if (enrollingNow && $retailHeading.length) {
        const $detailsLink = '<a href="https://www.mstcob.org/main-street-academy">Main Street Academy page</a>'
        const $formLink = '<a href="https://forms.gle/rYs89vdweUo2Y3Vq9">enrollment form</a>'
        $retailHeading.text('Main Street Academy - Payment Center')
          .after(`<p>Please start by reviewing the ${$detailsLink} and fill out the ${$formLink} if you have not done so already.</p>`);
        $('title').text('Main Street Academy - Payment Center');
      }
    }