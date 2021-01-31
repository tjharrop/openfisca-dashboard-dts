$(document).ready(function() {
    $.ajax({
      url: window.OFURL + "variables",
      method: 'GET',
      contentType: 'application/json',
      success: function(result){
        $.each(result, function(i, item) {
            $("#variablesTable tbody").append(
              '<tr><td class="wrap">' + i + '</td><td class="wrap">' + item['description'] + '</td><td><a class="ui button" href="/details/?v=' + encodeURIComponent(item['href']) + '">View</a></td></tr>'
            );
        });
        $('#variablesTable').DataTable();
      }
    });
});
