// navigate to a seating chart where nothing is taken or on hold
// then execute this code in the browser via the Chrome Develop Tools console

$('[data-seatno]')
  .removeAttr('class')
  .unwrap()
  .each(function() {
    const $seat = $(this);
    $seat.text($seat.attr('data-seatno'));
})

$('.seatmap-div .seatmap-row>div').css('width', '33px');

const $seatmap = $('div.seatmap.seatmap-div').detach();
$('body').empty().append($seatmap)