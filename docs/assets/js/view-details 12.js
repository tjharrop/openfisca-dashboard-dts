const urlParams = new URLSearchParams(window.location.search);

$(document).ready(function() {
    $.ajax({
      url: decodeURIComponent(urlParams.get('v')),
      method: 'GET',
      contentType: 'application/json',
      success: function(result){
        $("#pageTitle").html(result["id"]);
        if(urlParams.get('e')){
          result = result[urlParams.get('e')];
          $("#pageTitle").html(urlParams.get('e'));
        }
        $.each(result, function(i, item) {
            $("#detailsTable").append(
              "<tr><td>" + i + "</td><td><pre>" + JSON.stringify(item,null,'\t') + "</pre></td></tr>"
            );
        });
      }
    });
});
