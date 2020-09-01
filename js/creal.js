
openfisca_this_month = function() {
  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  return  openfisca_this_year() + '-' + pad(new Date().getMonth() +1, 2);
}

openfisca_this_year = function() {
  return new Date().getFullYear();
}

var all_form_data = {
    "paintball_marker_permit_person_is_eligible": [
      "paintball_marker_permit_person_has_completed_training",
      "birth"
    ],
    "paintball_marker_permit_person_can_be_autoapproved": [
      "paintball_marker_permit_person_has_completed_training",
      "birth",
      "paintball_marker_permit_person_is_convicted_of_relevant_offence",
      "paintball_marker_permit_person_has_had_suspended_or_cancelled",
      "paintball_marker_permit_person_has_been_disqualified",
      "paintball_marker_permit_person_has_mental_incapacity",
      "paintball_marker_permit_person_is_patient",
      "paintball_marker_permit_person_is_protected_person"
    ]
}
var request_data_structure = {
    "persons": {
       "person1":{}
    },
    "families": {
        "family1": {
            "parents": ["person1"],
        }
    },
    "organisations": {
        "org1": {
        }
    }
}
var query_month = "2020-08";


if( $('#inputform').length ){
  $.ajax({
    url: "https://openfisca-nsw-dev.herokuapp.com/variables",
    method: 'GET',
    contentType: 'application/json',
    success: function(result){
      $.each(result, function(i, item) {
          $("#inputform table").prepend(
            '<tr class="formRow '+ i + '" style="display:none;">' +
            '<td><small><label for="'+ i + '">' + i + '</label></small></td>' +
            '<td><input name="'+ i + '" class="au-text-input calculationsValue" type="text"></td>' +
            '</tr>'
          );
      });
    }
  });

  $.each(all_form_data, function(i, item) {
      $("#whichpolicy").prepend(
        '<label class="au-control-input '+ i + '">' +
        '<input value="'+ i + '" class="au-control-input__input calculationsCheckbox chk_'+ i + '" type="checkbox" name="calculations" >' +
        '<span class="au-control-input__text"><small>' + i + '</small></span>' +
        '</label>'
      );
  });

  $( ".calculationsCheckbox" ).change(function() {
    $(".formRow").hide();
    $(".calculationsCheckbox:checked").each(function () {
      $.each(all_form_data[$(this).val()], function(i, item) {
        $("tr."+item).show();
      });
    });
    $("input[name=birth]").attr("placeholder", "YYYY-MM-DD");
  });


  $( "#goBtn" ).click(function() {
    all_request_data(); return false;
  });


  all_request_data = function() {
    var all_request_data = request_data_structure;
//    var query_month = openfisca_this_month(); var query_year = openfisca_this_year();
    var data_location = all_request_data.persons.person1;
    var val = null;

    $.each(all_form_data, function(i, item) {
      //add the calculations we want responses for to the person object
      if ($(".chk_" + i).is(':checked')){
        data_location[i] = {[query_month]: null};
        thisparent = i;
        item.forEach(function(entry) {
            val = $( "input[name='" + entry + "']").val();
            data_location[entry] = {[query_month]: val};
        });
      }
    });
    $("#package").html(JSON.stringify(all_request_data, null, '\t'));

    $.ajax({
      url: "https://openfisca-nsw-dev.herokuapp.com/calculate",
      data : JSON.stringify(all_request_data),
      method: 'POST',
      contentType: 'application/json',
      success: function(result){
        $('#showResults').html("");
        $("#response").html(result);
        $.each(all_form_data, function(i, item) {
          //alert(i);
          if($('.chk_'+i).is(":checked")){
            $('#showResults').append(
              '<tr><td><small>' + i + '</small></td><td><small><strong>' + result["persons"]["person1"][i][query_month] + '</strong></small></td></tr>'
            );
          }
        });
    }});



    return all_request_data;

  }

}
