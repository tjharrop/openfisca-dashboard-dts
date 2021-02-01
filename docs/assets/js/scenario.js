var date = new Date();
window.calc_day = date.getDate();
window.calc_month = date.getMonth() + 1;
window.calc_year = date.getFullYear();
window.calc_date = window.calc_year + "-" + window.calc_month + "-" + window.calc_day;
var plural_glossary = new Object();
var data_structure = new Object();
var formSchema = new Object;

getPlurals(function (data) {
  $.each(data, function(i, item) {
    plural = item['plural'];
    single = i;
    plural_glossary[single] = plural_glossary[single] || {};
    plural_glossary[single] = plural; // this helps where variables list the singular but the obj needs the plural
  });
})

$(document).ready(function() {
  if($('#selectCalcs').length){
    $('.ui.dropdown').dropdown();
    var varList = new Object();
    getVariables(function (data) {
        $.each(data, function(i, item) {
            $("#selectCalcs .menu").prepend(
              '<div class="item" data-value="' + i + '">' + i + '</div>'
            );
        });
    })
    $('.ui.accordion').accordion('open', 0);
  }
  $('#clearCalcs').click(function(){
    $('.ui.dropdown').dropdown('clear');
  });

  $('#createForm').click(function(){
    window.payload_calls = [];
    window.formgen_calls = [];
    data_structure = {};
    //get the calcs from the form and array them
    applog("1. Create form for:",$("input[name='calculations']").val());
    var calcs = $("input[name='calculations']").val();
    var calc_array = calcs.split(',');
    createPayload(
      calc_array,
      function(data){
            applog("2. Payload based on step 1 variables:",data_structure);
            getDeps(data_structure, function(depInput){
              applog("3. Dependencies for that structure:", depInput);
              applog("4. Format a payload for the keys:",Object.keys(depInput));
              createPayload( //create payload from deps to generate form
                Object.keys(depInput),
                function(formPayload){
                  applog("5. Payload formed from step 4 keys:", data_structure);
                  createFormSchema(Object.keys(depInput), function(){
                    applog("6 Add to form:", formSchema);
                    //(function() {$('#formContainer').jsonForm(completeFormSchema);})()
                    console.log(formSchema);
                    applog("formschema going to jsonform is", formSchema);
                    $('#formContainer').jsonForm(formSchema);
                    $('.ui.accordion').accordion('open', 2);
                  });
                }
              )
            }); // Send payload to /deps and get new list

      }
    );
  });

});

function getDeps(depInputData, callback){
  console.log("Data inside deps");
  console.log(JSON.stringify(depInputData));
  $.ajax({
    url: window.OFURL + "dependencies",
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(depInputData,null,'\t'),
    success: callback
  });
}

function getPlurals(callback){
  var glossary = new Object();
  $.ajax({
    url: window.OFURL + "entities",
    method: 'GET',
    contentType: 'application/json',
    success: callback
  });
}

function getVariables(callback){
  $.ajax({
    url: window.OFURL + "variables",
    method: 'GET',
    contentType: 'application/json',
    success: callback
  });
}

function createPayload(inputArr, callback) {

  for (var key in inputArr) {
    window.payload_calls.push(
      $.ajax({
        url: window.OFURL + "variable/" + inputArr[key],
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          window.payload_calls.push(payloadAddVar(data));
        }
      })
    );
  }
  Promise.all(window.payload_calls).then(
    callback
  );
}

function payloadAddVar(result) {
  var single_entity = result["entity"];
  var plural_entity = plural_glossary[single_entity];
  var calcVar = result["id"];
  var traceDate = formatDate(result["definitionPeriod"]);
    single_entity = single_entity + " 1";
    data_structure[plural_entity] = data_structure[plural_entity] || {};
    data_structure[plural_entity][single_entity] = data_structure[plural_entity][single_entity] || {};
    data_structure[plural_entity][single_entity][calcVar] = data_structure[plural_entity][single_entity][calcVar] || {};
    data_structure[plural_entity][single_entity][calcVar][traceDate] = null;
}

function createFormSchema(questions, callback) {
  formSchema = {};
  for (var key in questions) {
    window.formgen_calls.push(
      $.ajax({
        url: window.OFURL + "variable/" + questions[key],
        method: 'GET',
        contentType: 'application/json',
        success: function(data){
          window.formgen_calls.push(
            addField(data)
          );
        }
      })
    );
  }
  Promise.all(window.formgen_calls).then(
    callback
  );
}

function addField(result){
    var single_entity = result["entity"];
    var plural_entity = plural_glossary[single_entity];
    var id = result["id"];
    var date = formatDate(result["definitionPeriod"]);
    var type = result["valueType"];
    var pathSelector = "$." + plural_entity + ".*~." + result["id"];
    var specific_entity = JSONPath.JSONPath({path: pathSelector, json: data_structure});
    formSchema["schema"] = formSchema["schema"] || {};
    formSchema["schema"][id] = formSchema["schema"][id] || {
      "type": "object",
      "title": id,
      "properties":{
        "value":{
          "title": "Value",
          "description": result["description"],
          "type": "string",
          "default": result["defaultValue"]
        },
        "date":{
          "title": "Date",
          "description": "Formatted as " + dateDescriptor(result["definitionPeriod"]),
          "type": "string",
          "default": date
        },
        "entity":{
          "title": single_entity,
          "type": "string",
          "default": specific_entity
        },
      }
    };
}

function applog(title, content){
  $("#scenarioForm").append(
    "<h4>" + title + "</h4>" +
    "<pre>" + JSON.stringify(content) + "</pre>" +
    "<hr>"
  );
}

function formatDate(type){
  switch (type)
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
    }
    return traceDate;
}

function dateDescriptor(type){
  switch (type)
    {
       case "DAY":
       case "ETERNITY":
           dateHelper = "YYYY-MM-DD"
           break;

       case "MONTH":
           dateHelper = "YYYY-MM"
           break;

       case "YEAR":
           dateHelper = "YYYY"
           break;

       default:
       dateHelper = "YYYY-MM-DD"
    }
    return dateHelper;
}


//
//
// TODO
// REMOVE BELOW HERE WHEN REFACTOR IS COMPLETE
//
//

// const inputModel = {
//     "birth": 17,
//     "is_nsw_resident": 4,
//     "is_enrolled_in_school": 4,
//     "active_kids__already_issued_in_calendar_year": 4,
//     "has_valid_medicare_card": 4,
//     "paintball_marker_permit_person_has_completed_training": 1,
//     "is_parent": 1,
//     "is_guardian": 1,
//     "is_carer": 1,
//     "active_kids__family_has_children_eligible": 1
// };
// var depData = createPayload(
//   Object.keys(inputModel),
//   function(data){
//     console.log(data);
//     formSchema(depData); // Turn the openfisca payload into a form
//   }
// );



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
