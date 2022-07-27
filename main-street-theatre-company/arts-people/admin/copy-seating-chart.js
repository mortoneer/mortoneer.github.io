// copy seating chart

// store object in localStorage so paste can access it
localStorage.setItem('copy-seating-chart', 
  // local storage likes strings
  JSON.stringify(
    jQuery('.seating-chart')
    // create an array of the name -> value pairs
    .map((index, item) => ({
      name: [$(item).attr('name')],
      value: $(item).val()
    })).get()
  )
)

// paste seating chart
// size must be equal or greater than copied

JSON.parse(localStorage.getItem('copy-seating-chart')).forEach(({name, value}) => {
  jQuery(`[name=${name}]`).val(value)
});