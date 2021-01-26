//
// openfisca_this_month = function() {
//   function pad (str, max) {
//     str = str.toString();
//     return str.length < max ? pad("0" + str, max) : str;
//   }
//   return  openfisca_this_year() + '-' + pad(new Date().getMonth() +1, 2);
// }
//
// openfisca_this_year = function() {
//   return new Date().getFullYear();
// }
//
// $('#goBtn').click(function() {
//   var data = JSON.parse($("#package").val());
//   trace_and_score(data);
//   $('table.afterCalc tr').remove();
//   $('.afterCalc').show();
//   return false;
// });
//
// detect_unknown = function(result) {
// });
//
// show_calcs = function(result) {
//   $.each(result["requestedCalculations"], function(i, item) {
//     $('#showCalcResults').append(
//       '<tr><td>' + item + ': </td><td class="' + result["trace"][item]["value"] + '"><strong>' + result["trace"][item]["value"] + '</strong></td></tr>'
//     );
//   });
// }
//
// filter_unknown = function(result) {
//   $.each(result["trace"], function(i, item) {
//     $('#showCompleteResults').append(
//       '<tr><td>' + i + ': </td><td class="' + item["value"] + '"><strong>' + item["value"] + '</strong></td></tr>'
//     );
//     if(item["value"] != "unknown") {
//         delete result["trace"][i];
//         console.log("remove " + i);
//     } else {
//         console.log("keep " + i);
//     }
//   });
//   return result;
// }
//
// remove_zero = function(result) {
//   $.each(result["trace"], function(i, item) {
//     if(item["count"]) {
//         console.log("keep " + i);
//     } else {
//         delete result["trace"][i];
//         console.log("remove " + i + " (0 score)");
//     }
//   });
//   return result;
// }
//
// score = function(result) {
//   $.each(result["trace"], function(i, item) {
//     //alert(i);
//     $.each(result["trace"][i]["dependencies"], function(j, jitem) {
//       if(result["trace"][jitem]){
//         if(result["trace"][jitem]["count"]) {
//             result["trace"][jitem]["count"]++;
//             console.log("add another " + jitem);
//         } else {
//             result["trace"][jitem]["count"] = 1;
//             console.log("add " + jitem);
//         }
//       }
//     });
//   });
//   return result;
// }
//
// get_next_question = function(result) {
//   $.each(result["trace"], function(i, item) {
//     $('#showResults').append(
//       '<tr><td>' + i + ': </td><td><strong>' + item["count"] + '</strong></td></tr>'
//     );
//   });
//   return result;
// }
//
// trace_and_score = function(all_request_data) {
//
//   $("#package").html(JSON.stringify(all_request_data, null, '\t'));
//
//   $.ajax({
//     url: "https://openfisca-nsw-dev.herokuapp.com/trace",
//     data : JSON.stringify(all_request_data),
//     method: 'POST',
//     contentType: 'application/json',
//     success: function(result){
//       //$('#showResults').html("");
//       $("#response").html(JSON.stringify(result, null, '\t'));
//       detect_unknown(result);
//       show_calcs(result);
//       var filtered = filter_unknown(result);
//       var scored = score(filtered);
//       filtered = remove_zero(scored);
//       var next_question = get_next_question(filtered);
//       return result;
//   }});
//
//
//
// }
