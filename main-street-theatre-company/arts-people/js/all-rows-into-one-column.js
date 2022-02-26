let $repl = $('<div />')
let $main = $('main.container')
let $oneTable = $('<table id="one-table" />');
let $row = $('<tr />');
$oneTable.append($row);
$main.find('table td')
  .removeProp('style').removeProp('valigh').removeProp('haligh').removeProp('aligh').removeProp('width')    
  .removeAttr('style').removeAttr('valigh').removeAttr('haligh').removeAttr('aligh').removeAttr('width')
  .each(function() {
      const $td = $(this);
      const $colContainer = $('<div />').append($td.children());
      $repl.append($colContainer)
  })

$repl.find('table').remove()
$('main.container').empty().append($repl.children());