if (jQuery) {
  jQuery(function ($) {
    const storageKey = 'academyStore';
    async function digestMessage(message) {
      const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    }

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

    // https://app.arts-people.com/index.php?retail=mnstr
    $('#TBLitems').addClass('table');

    // https://app.arts-people.com/index.php?membership=mnstr
    $('#membership_level_table').addClass('table');

    const $pricingError = $(
      'p.error:contains("We were not able to price all your tickets.")'
    );

    const academy =
      $('strong:contains("Main Street Academy - Showcase")').length &&
      $('h1:contains("Review Your Order")').length;

    if ($pricingError.length) {
      let parentPromise = Promise.resolve(
        academy ? 'NO_PERSON_ID' : 'NOT_ACADEMY'
      );
      const academyParents = [
        '47ef05148b6e50fc4cb023617bfd4c4b34b9efb2e2d5bed7c0be54ca2c81a65e',
        'b5fed40e9a0308f1544e84c03e193567f6f9a53ea979b3e7230a4081f9b2eec5',
        '2816974451f0b97aae5eb52225fde6a1e87ee620e2c730aa7a988d70ee3b1ee6',
        '7c059dd43713ebecf4d86c9e5f9c7fccdbc7758e66069285eecd8da3ae6d8071',
        '5f7910c5da534c74ace11478e2d235a8c744dcf8c1b039df2e85fcc7d1c90c3c',
        '5cda68bf108254b153311f89e9694c1cc07a86157ace1776b85fef67d68a90c5',
        '1c89ec81228f464e29a03c98e30091317857e72c1c4a428b993bdb75b3eb12fc',
        'a5c45a90480f48c4c26b57c9ccbb4ad9f7ca30696de13ca7be438bd4f6554469',
        'e81e67a1281c5abff9c8212088031732890bb8fc161f6d87927606111dead44b',
        'ae02f2338530a804c7062b4553d569117edfa7bd172726eb2752d1447d885406',
        'ab8185d24f11685094aea8480d667d4b3b78700dcab64514773b3462d447063f',
        'ff283c73ec0319d1c64e85cba24581d6e1d47ae950f6afb36c6ced443c60e16a',
        '69660cdab4bc4f88abc94d0f2eda9024a8cd41aaab663cd28332a262fb05b8c6',
        'cb5b0d14ed1b881789ced99abf102b58561db7c59b96014e591683caad81b26d',
        'be3da8781830cee168fd0360ce14f82a964eb12153a605f3bbfc08935008d96b',
        'b7e517a945a12ac77f9844b5259134a2ac2d9b44a218b0b15a616996fe7fff5e',
        '5aab9bab699cdf79cbf4900cce36c22fd75f3a778c6a300e912307bd6a718968',
        '67df0a6f0fcc6bf0a92e7324b9ce9d6cdcea5b9f98346c8854dd35a2c1a21d43',
        '073ae3a0ec5bcd8797500f3506b5c1243e72c0f2820767572ad4714284027715',
        '855dc0e9bb5e767aa294278ab6f7dac5c94416b66cd96fa89f1189926fc74555',
        '4170f51260d6f4ce169ee93262c416db3f147309f2c877977b1dbc85ccbfa51b',
        'bd6bfb60eda218c97e6cb824dd62f5780a2fb27ef091d189df41992dbe40c10e',
        'cf5926bef8078a01fcf2a95bb80a272b21ea8b70d647033eaf5c0233db9abd7d',
        '95f9ffd4b890017b57b03698ebc1c804efa7b07e9b3a6b1e6265b4454eef49da',
        'a4901a7a82b55ad1f3f7be610fca89883bac133fa813262464e4f7b7a4924f68',
        '136df052c6ba76f19f9bf44a29b15956281af257cf83d2da46826fe0b25fcd3b',
        '0e06fb1a3f4e32431cbf1acbe440a03195a0195c91f6fd1aacc1dcebbeb4a5ce',
        '05152d0b8079ce6f905389fa012b02d9c673bae90d8cbbd29430835ee9a0df2f',
        '5e63ae7a18e3b388caaae63fdcc74b2f8159dccd8bcb6aaaea1740b9625b72c9',
        'c02b96f4d1073a2a091d4b6374da9acd79435c7e92130576bf55e4c3fccf892e',
        '8241194e253c9714a32ee7f5821965ef5506ac948a2e6b5f0cf7fbefc14bd1bf',
      ];
      if (window.personId) {
        const localParent = localStorage.getItem(`${storageKey}-${personId}`);
        if (localParent == null) {
          parentPromise = new Promise((resolve, reject) => {
            $.get(
              `https://app.arts-people.com/api.v.1/person/action/id/${personId}/t/${apiToken}`,
              'json'
            ).then(resolve, reject);
          });

          parentPromise = parentPromise
            .then((person) => person.Person.primaryEmail)
            .then(digestMessage)
            .then((parentEnc) => {
              console.log('encrypted', parentEnc);
              return Boolean(academyParents.includes(parentEnc)).toString();
            })
            .then((parentStorage) => {
              console.log('setting local localStorage', parentStorage);
              localStorage.setItem(`${storageKey}-${personId}`, parentStorage);
              return parentStorage;
            });
        } else {
          parentPromise = Promise.resolve(localParent);
        }
      }

      parentPromise.then((parentStorage) => {
        window.mortoneer = {
          cancelOrder: () => $('[value="Cancel Order"]').get(0).click(),
          parentStorage,
        };

        const boxOfficeHelp = `<p>If you need help, you can reach us at 
        <a href="mailto:tickets@mainstreettheatrecompany.org">tickets@mainstreettheatrecompany.org</a>.</p>`;

        // may not be an academy parent
        const academyNotLoggedIn = `
          <p><strong>Academy Ticket Issues Detected</strong> Tickets are only available to parents at this time.
          Please log in so that we can determine if you are eligible for academy tickets.</p>
          
          ${boxOfficeHelp}`;

        const academyNotParent = `
          <p><strong>Academy Ticket Issues Detected</strong> Tickets are only available to parents at this time. 
          Please log in using the same account that you used when you signed up for the academy.</p>
          
          ${boxOfficeHelp}`;

        // confirmed academy parent
        const academyTooMany = `
          <p><strong>Academy Ticket Issues Detected</strong> A <em>limited</em> number of tickets are available at this time. 
          Please <a href="#" onclick="window.mortoneer.cancelOrder()">cancel your order</a> and add no more than 4 tickets per child enrolled.
          You can request additional tickets via an email to tickets@mainstreettheatrecompany.org.</p>`;

        const generalNote = `<p>
          <strong>We've detected an issue with your tickets.</strong> 
          It looks like you've gotten ahead of us. 
          Tickets will be available soon. 
          If you are still having trouble after a few minutes, 
          contact us at tickets@mainstreettheatrecompany.org.</p>`;

        let oneMessage = generalNote;
        if (academy) {
          if (parentStorage === 'true') {
            oneMessage = academyTooMany;
          } else if (parentStorage === 'false') {
            oneMessage = academyNotParent;
          } else if (parentStorage === 'NO_PERSON_ID') {
            oneMessage = academyNotLoggedIn;
          }
        }

        $pricingError
          .addClass('alert')
          .addClass('alert-danger')
          .html(oneMessage);
      });
    }

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

    const ATTR_NAME = 'data-mortoneer-html-load';
    function loadHtml(index, element) {
      const $form = $(element);
      const formPath = $form.attr(ATTR_NAME);

      jQuery.get(formPath, 'html').then((data) => {
        $form.html(data);
      });
    }

    $(`[${ATTR_NAME}]`).each(loadHtml);
  });
}
