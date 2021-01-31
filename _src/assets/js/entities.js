$(document).ready(function() {
    $.ajax({
      url: window.OFURL + "entities",
      method: 'GET',
      contentType: 'application/json',
      success: function(result){
        $.each(result, function(i, item) {
            $("#entitiesTable tbody").append(
              '<tr><td class="wrap">' + i + '</td><td class="wrap">' + item['description'] + '</td><td><a class="ui button" href="/details/?v=' + encodeURIComponent(window.OFURL + "entities") + '&e=' + i + '">View</a></td></tr>'
            );
        });
        $('#entitiesTable').DataTable();
      }
    });
});
