var cities = [];
var userTotal = 0;
var baseline = 100;
var cityObject = {};

function alpacaBag(result, callback) {

  var destination = $.get('/api/destinations', function(data) {
    userTotal = result;

    for (var i = 0; i < data.length; i++) {
      var city = {
        score: data[i].surveyPoints
      }
      cities.push(city);
    }

  }).then(function(data) {
    return callback();
  });
  return destination;
};

$("form").on("submit", function(e) {
  e.preventDefault();

  var responses = [
    $("#Q1").val(),
    $("#Q2").val(),
    $("#Q3").val(),
    $("#Q4").val(),
    $("#Q5").val(),
    $("#Q6").val(),
    $("#Q7").val(),
    $("#Q8").val(),
    $("#Q9").val(),
    $("#Q10").val(),
    $("#Q11").val()
  ];

  responses[0] *= 2;
  responses[1] *= 1.5;

  var responseTotal = 0;

  responses.forEach(function(currentResponse, index) {
    responseTotal += currentResponse;
  });

  var destinationMatch = alpacaBag(responseTotal, function() {
    var cityIndex = 0;

    //loop cities
    for (var i = 0; i < cities.length; i++) {
      var difference = Math.abs((userTotal - cities[i].score));
      if (difference < baseline) {
        baseline = difference;
        cityIndex = i;
      };
    };

    return cityIndex;

  }).then(function(data) {

    // console.log("Destination Match Data =", data);
    getDestinationInfo(data + 1);

  });
});

function getDestinationInfo(id) {
  $.get("/api/destinations/" + id, function(response) {
    if (response) {
      // console.log("Our response", response);
      // console.log("Respone.location", response.locationName)
      getPointsOfInterest(response.locationName);
      cityObject = {
        name: response.locationName,
        location: {
          latitude: response.lat,
          longitude: response.lon
        },
        interests: [],
        survey: response.surveyPoints,
        category: response.category
      };
      // console.log(cityObject);
    };
  });
};

function getPointsOfInterest(location) {
  $.get("/api/poi/" + location, function(responses) {
    // console.log(responses);
    responses.forEach(function(response, index) {
      var interestsObject = {
        name: response.name,
        description: response.description,
        link: response.link,
        photo: response.photo
      };

      cityObject.interests.push(interestsObject);
    })
    // console.log(cityObject);
  });
}
