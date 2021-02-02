var date = new Date();
window.calc_day = ("0" + date.getDate()).slice(-2);
window.calc_month = ("0" + (date.getMonth() + 1)).slice(-2);
window.calc_year = date.getFullYear();
window.calc_date = window.calc_year + "-" + window.calc_month + "-" + window.calc_day;
var plural_glossary = new Object();
var data_structure = new Object();
var formSchema = new Object;
var dependenciesList = [];
window.variable_library = {};

getPlurals(function (data) {
  $.each(data, function(i, item) {
    plural = item['plural'];
    single = i;
    plural_glossary[single] = plural_glossary[single] || {};
    plural_glossary[single] = plural; // this helps where variables list the singular but the obj needs the plural
  });
  applog("Create plural / single entity glossary",plural_glossary);
})

$(document).ready(function() {

  $('#clearCalcs').click(function(){
    $('.ui.dropdown').dropdown('clear');
  });

  $('#formContainer').on('click', '.btn', function() {
    minorlog("----------------------------------");
    minorlog("--------- FORM SUBMITTED ---------");
    minorlog("----------------------------------");
    minorlog("");
    calcGenArray = Object.keys(dependenciesList);
    for (var key in calcGenArray) {
      calculate_structure = data_structure;
      id = calcGenArray[key]
      varObj = window.variable_library[id];
      var single_entity = varObj["entity"];
      var plural_entity = plural_glossary[single_entity];
      // var pathSelector = "$." + plural_entity + ".*~." + id;
      // var specific_entity = JSONPath.JSONPath({path: pathSelector, json: data_structure});
      var specific_entity = single_entity + " 1";
      //single_entity = $("input[name='" + id + ".entity']").val();
      inputDate = $("[name='" + id + ".date']").val();
      inputVal = $("[name='" + id + ".value']").val();
      // Check if still the same entity
      if(specific_entity){
        calculate_structure[plural_entity][specific_entity][id] = {};
        data_structure[plural_entity][specific_entity][id][inputDate] = inputVal;
      } else {
        console.log(id + " entity was [" + specific_entity + "] now [" + single_entity + "]");
        delete calculate_structure[plural_entity][specific_entity][id]
        data_structure[plural_entity][single_entity] = data_structure[plural_entity][single_entity] || {};
        data_structure[plural_entity][single_entity][id] = data_structure[plural_entity][single_entity][id] || {};
        data_structure[plural_entity][single_entity][id][inputDate] = inputVal;
      }
    }
    applog("7. /calculate payload with form data", calculate_structure);
    $('#resultSet tbody').html("");
    getCalc(calculate_structure,function(results){
      applog("8. Display results", results);
      $.each(calc_array, function(i, item){
        minorlog("listing " + item)
        var pathSelector = "$..." + item + "^~";
        var specific_entity = JSONPath.JSONPath({path: pathSelector, json: results});
        var resPathSelector = "$.." + item + ".*";
        var values = JSONPath.JSONPath({path: resPathSelector, json: results});
        addRow = '<tr id="res_row_' + item + '"><td>' + item + '</td><td>' + specific_entity + '</td><td>' + values + '</td></tr>';
        $('#resultSet tbody').append(addRow);
      });
      $('.ui.accordion').accordion('open', 3);
      // if (!(calc_array.includes(i))){
      //   traceObj[i] = 0;
      // }
    });
  });

  $('#createForm').click(function(){
    window.payload_calls = [];
    window.formgen_calls = [];
    data_structure = {};
    //get the calcs from the form and array them
    applog("1. Create form for:",$("input[name='calculations']").val());
    var calcs = $("input[name='calculations']").val();
    calc_array = calcs.split(',');
    minorlog(calcs + " -> " + calc_array);
    createPayload(
      calc_array,
      function(data){
            applog("2. Payload based on step 1 variables:",data_structure);
            getDeps(data_structure, function(depInput){
              trace_generate(data_structure);
              applog("3b. Dependencies for that structure:", depInput);
              applog("4. Format a payload for the keys:",Object.keys(depInput));
              dependenciesList = depInput;
              createPayload( //create payload from deps to generate form
                Object.keys(depInput),
                function(formPayload){
                  applog("5. Payload formed from step 4 keys:", data_structure);
                  createFormSchema(Object.keys(depInput), function(){
                    applog("6. Add to form:", formSchema);
                    //(function() {$('#formContainer').jsonForm(completeFormSchema);})()
                    $('#formContainer').html("");
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

if($('#selectCalcs').length){
  $('.ui.dropdown').dropdown();
  var varList = new Object();
  getVariables(function (data) {
      $.each(data, function(i, item) {
          $("#selectCalcs .menu").prepend(
            '<div class="item" data-value="' + i + '">' + i + '</div>'
          );
      });
      applog("Add variables to type-ahead", data);
  })
  $('.ui.accordion').accordion('open', 0);
}

function getDeps(depInputData, callback){
  minorlog("send request to [/dependencies]");
  $.ajax({
    url: window.OFURL + "dependencies",
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(depInputData,null,'\t'),
    success: callback
  }).fail(useTrace());
  function useTrace(){
  }
}

function getCalc(calcPayload, callback){
  minorlog("send request to [/calculate]");
  $.ajax({
    url: window.OFURL + "calculate",
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(boolize(calcPayload),null,'\t'),
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
  var id = result["id"];
  var single_entity = result["entity"];
  var plural_entity = plural_glossary[single_entity];
  var calcVar = result["id"];
  var traceDate = formatDate(result["definitionPeriod"]);
    single_entity = single_entity + " 1";
    data_structure[plural_entity] = data_structure[plural_entity] || {};
    data_structure[plural_entity][single_entity] = data_structure[plural_entity][single_entity] || {};
    data_structure[plural_entity][single_entity][calcVar] = data_structure[plural_entity][single_entity][calcVar] || {};
    data_structure[plural_entity][single_entity][calcVar][traceDate] = null;
    window.variable_library[id] = result;
    minorlog("added " + id + " to payload for entity [" + single_entity + "] in [" + plural_entity + "]");
}

function createFormSchema(questions, callback) {
  formSchema = {};
  for (var key in questions) {
    minorlog("get variable schema [" + questions[key] + "]");
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
    minorlog("generate JSONform [" + result["id"] + "]");
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
          "default": date,
          "pattern": dateRegex(result["definitionPeriod"])
        }
        // "entity":{
        //   "title": single_entity,
        //   "type": "string",
        //   "default": specific_entity
        // },
      }
    };
    if (type == "Boolean"){
      formSchema["schema"][id]["properties"]["value"]["enum"] = ["true","false"]
    }
    if (result["possibleValues"]){
      formSchema["schema"][id]["properties"]["value"]["enum"] = Object.keys(result["possibleValues"])
    }

}


function applog(title, content){
  $("#scenarioForm").append(
    "<hr>" +
    "<h4>" + title + "</h4>" +
    "<pre>" + JSON.stringify(content) + "</pre>"
  );
}

function minorlog(title){
  $("#scenarioForm").append(
    "<pre>" + title + "</pre>"
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

function dateRegex(type){
  switch (type)
    {
       case "DAY":
       case "ETERNITY":
           dateHelper = "/(?<=\D|^)(?<year>\d{4})(?<sep>[^\w\s])(?<month>1[0-2]|0[1-9])\k<sep>(?<day>0[1-9]|[12][0-9]|(?<=11\k<sep>|[^1][4-9]\k<sep>)30|(?<=1[02]\k<sep>|[^1][13578]\k<sep>)3[01])(?=\D|$)/gm"
           break;

       case "MONTH":
           dateHelper = "/(?<=\D|^)(?<year>\d{4})(?<sep>[^\w\s])(?<month>1[0-2]|0[1-9])(?=\D|$)/gm"
           break;

       case "YEAR":
           dateHelper = "(?<=\D|^)(?<year>\d{4})(?=\D|$)"
           break;

       default:
       dateHelper = "/(?<=\D|^)(?<year>\d{4})(?<sep>[^\w\s])(?<month>1[0-2]|0[1-9])\k<sep>(?<day>0[1-9]|[12][0-9]|(?<=11\k<sep>|[^1][4-9]\k<sep>)30|(?<=1[02]\k<sep>|[^1][13578]\k<sep>)3[01])(?=\D|$)/gm"
    }
    return dateHelper;
}

function trace_generate(all_request_data, callback) {
  apiurl = window.OFURL;
  $.ajax({
    url: apiurl + "trace",
    data : JSON.stringify(all_request_data),
    method: 'POST',
    contentType: 'application/json',
    success: function(result){
      $('#fullSet tbody').empty();

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

        addRow = '<tr id="row_' + i + '"><td>' + i + '</td><td>' + JSON.stringify(item['parameters']) + '</td><td>' + item['value'] + '</td><td>' + dependenciesList + '</td></tr>';
        $('#fullSet tbody').append(addRow);
      });
      $('#fullSet').tablesort();
      applog("3a.Logging trace",result);
  }});
}

function boolize(obj) {
    var map = Object.create(null);
    map['false'] = false;
    // the recursive iterator
    function walker(obj) {
        var k,
            has = Object.prototype.hasOwnProperty.bind(obj);
        for (k in obj) if (has(k)) {
            switch (typeof obj[k]) {
                case 'object':
                    walker(obj[k]); break;
                case 'string':
                    if (obj[k].toLowerCase() in map) obj[k] = map[obj[k].toLowerCase()]
            }
        }
    }
    // set it running
    walker(obj);
    return obj;
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



// function trace_generate(all_request_data) {
//   apiurl = window.OFURL;
//   $.ajax({
//     url: apiurl + "trace",
//     data : JSON.stringify(all_request_data),
//     method: 'POST',
//     contentType: 'application/json',
//     success: function(result){
//       $('#fullSet tbody').empty();
//       $.each(result["trace"], function(i, item) {
//         console.log("need " + i);
//         $.each(result["trace"][i]["dependencies"], function(j, jitem) {
//           if(result["trace"][jitem]){
//             if(result["trace"][jitem]["count"]) {
//                 result["trace"][jitem]["count"]++;
//                 console.log("add another " + jitem);
//             } else {
//                 result["trace"][jitem]["count"] = 1;
//                 console.log("add " + jitem);
//                 // TODO - the score here is wrong and needs to include a multiplication of it's own dependencies (i.e. id 4 things depend on 'age' and 'age' depends on 'birth' birth should have a score of 4, not 1)
//             }
//           }
//         });
//       });
//       $.each(result["trace"], function(i, item) {
//         $.each(item['dependencies'], function(xi, xitem) {
//           //add count of the main record of fitem (age) to score of each dependency (birth)
//           if(result["trace"][i]["count"]) {
//               //this variable (age) has a count
//               if(result["trace"][xitem]["score"]) {
//                 result["trace"][xitem]["score"] += result["trace"][i]["count"];
//                 console.log("add " + i + " score to " + xitem);
//               } else {
//                 result["trace"][xitem]["score"] = result["trace"][i]["count"];
//                 console.log(xitem + " doesn't have a score, start with " + result["trace"][i]["count"] + " (the score of " + i + ")")
//               }
//
//           } else {
//             if(result["trace"][xitem]["score"]) {
//               result["trace"][xitem]["score"] ++;
//               console.log("add 1 score to " + xitem + " (for use in " + i + ")");
//             } else {
//               result["trace"][xitem]["score"] = 1;
//               console.log(xitem + " doesn't have a score, start with 1 (for use in " + i + ")")
//             }
//
//           }
//         });
//       });
//       $.each(result["trace"], function(i, item) {
//         var dependenciesList = '';
//         $.each(item['dependencies'], function(fi, fitem) {
//           dependenciesList += '<li>' + fitem + '</li>';
//         });
//         var asked;
//         if(!item['count']){
//             item['count'] = 0;
//         }
//         if(!item['score']){
//             item['score'] = 0;
//         }
//         if(item['value']!="false" && item['value']!="unknown"){
//           asked = item['value'];
//         } else {
//           asked = "N/A"
//         }
//         console.log(i + "value is " + item['value'])
//         console.log(JSON.stringify(item, null, '\t'))
//
//         addRow = '<tr id="row_' + i + '"><td>' + i + '</td><td>' + item['count'] + '</td><td>' + item['score'] + '</td><td>' + asked + '</td><td>' + dependenciesList + '</td></tr>';
//         $('#fullSet tbody').append(addRow);
//       });
//       $('#fullSet').tablesort()
//       $('.ui.accordion')
//         .accordion('open', 1)
//       ;
//   }});
// }
