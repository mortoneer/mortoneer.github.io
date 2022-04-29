    // Take over the "Retail" page for the Academy.
    if ($('.academy-take-over').length) {
      const $retailHeading = $('h1:contains(Welcome to our online store.)');
      const academyNotStarted = Date.now() < new Date('Feb 15 2022').getTime();
      if (academyNotStarted && $retailHeading.length) {
        $retailHeading.text('Main Street Academy - Payment Center')
          .after(`<p>Please start by reviewing the 
        <a href="https://www.mainstreettheatrecompany.org/main-street-academy">Main Street Academy page</a>
         and fill out the <a href="https://docs.google.com/forms/d/e/1FAIpQLScnJYxaupZtM5BzvCt7UWLHaaCMXZtyILsOrqo6pMjSd_pVrA/viewform">form</a> 
         if you have not done so already.</p>`);

        $('title').text('Main Street Academy - Payment Center');
      }
    }