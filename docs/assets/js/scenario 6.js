var date = new Date();
window.calc_day = date.getDate();
window.calc_month = date.getMonth() + 1;
window.calc_year = date.getFullYear();
window.calc_date = window.calc_year + "-" + window.calc_month + "-" + window.calc_day;

$('#populateCalcs').click(function(){
  apiurl = window.OFURL;
  if($('#selectCalcs').length){
    $('#selectCalcs .menu').empty();
    $.ajax({
      url: apiurl + "variables",
      method: 'GET',
      contentType: 'application/json',
      success: function(result){

        $('.ui.dropdown').dropdown();
        $('.ui.dropdown').dropdown('clear');

        $.each(result, function(i, item) {
            $("#selectCalcs .menu").prepend(
              '<div class="item" data-value="' + i + '">' + i + '</div>'
            );
        });

        $('.ui.accordion').accordion('open', 0);

      }
    });
  }
});

$('#clearCalcs').click(function(){
  $('.ui.dropdown').dropdown('clear');
});

var plural_glossary = getPlurals();
function getPlurals(){
  var glossary = new Object();
  $.ajax({
    url: window.OFURL + "entities",
    method: 'GET',
    contentType: 'application/json',
    success: function(result){
      $.each(result, function(i, item) {
        plural = item['plural'];
        single = i;
        glossary[single] = plural; // this helps where variables list the singular but the obj needs the plural
      });
      return glossary;
    }
  });
}

$('#createForm').click(function(){
  //get the calcs from the form and array them
  var calcs = $("input[name='calculations']").val();
  var calc_array = calcs.split(',');
  //generate object structure based on entities
  var trace_data_structure = new Object();
  var plural_glossary = new Object(); //also create a glossary of plurals to save API calls
  createPayload(calc_array);
  console.log(calc_array);
});

var inputModel = {
    "birth": 17,
    "is_nsw_resident": 4,
    "is_enrolled_in_school": 4,
    "active_kids__already_issued_in_calendar_year": 4,
    "has_valid_medicare_card": 4,
    "paintball_marker_permit_person_has_completed_training": 1,
    "is_parent": 1,
    "is_guardian": 1,
    "is_carer": 1,
    "active_kids__family_has_children_eligible": 1
};
createPayload(inputModel.keys());

function createPayload(inputArr) {
  console.log("looping");
  console.log(inputArr);
  for (var key in inputArr) {
    console.log("add " +  key + " to object");
    var plural_glossary = new Object(); //also create a glossary of plurals to save API calls
    var trace_data_structure = new Object();

    $.ajax({
      url: window.OFURL + "variable/" + key,
      method: 'GET',
      contentType: 'application/json',
      success: function(result){
        var single_entity = result["entity"];
        var plural_entity = plural_glossary[single_entity];
        console.log(plural_glossary);
        var calcVar = result["id"];
        var traceDate;
        switch (result["definitionPeriod"])
          {
             case "DAY":
             case "ETERNITY":
                 traceDate = window.calc_date
                 break;

             case "MONTH":
                 traceDate = window.calc_year + "-" + window.calc_month
                 break;

             case "YEAR":
                 traceDate = window.calc_year
                 break;

             default:
             traceDate = window.calc_date
          };
          console.log("retrieved var " + calcVar);
          trace_data_structure[plural_entity] = trace_data_structure[plural_entity] || {};
          trace_data_structure[plural_entity][single_entity] = trace_data_structure[plural_entity][single_entity] || {};
          trace_data_structure[plural_entity][single_entity][calcVar] = trace_data_structure[plural_entity][single_entity][calcVar] || {};
          trace_data_structure[plural_entity][single_entity][calcVar][traceDate] = null;
          $("#scenarioForm").html(
            JSON.stringify(trace_data_structure,null,'\t')
          );
      }
    });
  }
}



//
//
//
//
//
//

$('#createFormewew').click(function(){
  //generate object structure based on entities
  var request_data_structure = {
      "persons": {
         "person1":{}
      }
  }
  var query_month = "2020-09";
  var calcs = $("input[name='calculations']").val();
  var calc_array = calcs.split(',');
  var data_location = request_data_structure.persons.person1;
  for(var i = 0; i < calc_array.length; i++) {
    thisOne = calc_array[i];
    data_location[thisOne] = {[query_month]: null};
  }
  console.log(JSON.stringify(request_data_structure, null, '\t'))
  trace_generate(request_data_structure);


});




trace_generate = function(all_request_data) {
  apiurl = window.OFURL;
  $.ajax({
    url: apiurl + "trace",
    data : JSON.stringify(all_request_data),
    method: 'POST',
    contentType: 'application/json',
    success: function(result){
      $('#fullSet tbody').empty();
      $.each(result["trace"], function(i, item) {
        console.log("need " + i);
        $.each(result["trace"][i]["dependencies"], function(j, jitem) {
          if(result["trace"][jitem]){
            if(result["trace"][jitem]["count"]) {
                result["trace"][jitem]["count"]++;
                console.log("add another " + jitem);
            } else {
                result["trace"][jitem]["count"] = 1;
                console.log("add " + jitem);
                // TODO - the score here is wrong and needs to include a multiplication of it's own dependencies (i.e. id 4 things depend on 'age' and 'age' depends on 'birth' birth should have a score of 4, not 1)
            }
          }
        });
      });
      $.each(result["trace"], function(i, item) {
        $.each(item['dependencies'], function(xi, xitem) {
          //add count of the main record of fitem (age) to score of each dependency (birth)
          if(result["trace"][i]["count"]) {
              //this variable (age) has a count
              if(result["trace"][xitem]["score"]) {
                result["trace"][xitem]["score"] += result["trace"][i]["count"];
                console.log("add " + i + " score to " + xitem);
              } else {
                result["trace"][xitem]["score"] = result["trace"][i]["count"];
                console.log(xitem + " doesn't have a score, start with " + result["trace"][i]["count"] + " (the score of " + i + ")")
              }

          } else {
            if(result["trace"][xitem]["score"]) {
              result["trace"][xitem]["score"] ++;
              console.log("add 1 score to " + xitem + " (for use in " + i + ")");
            } else {
              result["trace"][xitem]["score"] = 1;
              console.log(xitem + " doesn't have a score, start with 1 (for use in " + i + ")")
            }

          }
        });
      });
      $.each(result["trace"], function(i, item) {
        var dependenciesList = '';
        $.each(item['dependencies'], function(fi, fitem) {
          dependenciesList += '<li>' + fitem + '</li>';
        });
        var asked;
        if(!item['count']){
            item['count'] = 0;
        }
        if(!item['score']){
            item['score'] = 0;
        }
        if(item['value']!="false" && item['value']!="unknown"){
          asked = item['value'];
        } else {
          asked = "N/A"
        }
        console.log(i + "value is " + item['value'])
        console.log(JSON.stringify(item, null, '\t'))

        addRow = '<tr id="row_' + i + '"><td>' + i + '</td><td>' + item['count'] + '</td><td>' + item['score'] + '</td><td>' + asked + '</td><td>' + dependenciesList + '</td></tr>';
        $('#fullSet tbody').append(addRow);
      });
      $('#fullSet').tablesort()
      $('.ui.accordion')
        .accordion('open', 1)
      ;
  }});
}