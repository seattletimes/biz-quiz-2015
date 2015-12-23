// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var ich = require("icanhaz");

var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");
var overviewTemplate = require("./_overviewTemplate.html");

var score = 0;
var id = 1;

ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);
ich.addTemplate("overviewTemplate", overviewTemplate);

var showQuestion = function(questionId) {
  $(".quiz-box").html(ich.questionTemplate(quizData[id]));
  $(".index").html(id + " of " + Object.keys(quizData).length);
};

var watchInput = function() {
  $(".quiz-box").on("click", "input", (function(){
    $(".submit").addClass("active");
    $(".submit").attr("disabled", false);
  }));
};

$(".quiz-box").on("click", ".submit", function() {
  var answerData = {};
  answerData.place = quizData[id].place;
  var correct = $("input:checked").val();
  if (correct) { 
    score += 1;
    answerData.hooray = true;
  }

  quizData[id].answers.forEach(function(a) {
    if (a.correct) {
      answerData.correct = a.answer;
      answerData.description = quizData[id].desc;
      answerData.answerImage = quizData[id].answerImage;
      answerData.photographer = quizData[id].photographer;
      answerData.caption = quizData[id].caption;
    }
  });

  $(".quiz-box").html(ich.resultTemplate(answerData));
  $(".index").html(id + " of " + Object.keys(quizData).length);

  if (id == Object.keys(quizData).length) {
    $(".next").html("See results!");
  }
  watchNext();
});


var watchNext = function() {
  $(".next").click(function() {
    if (id < Object.keys(quizData).length) {
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
      result.score = score;
      if (result.score > 5) { 
        result.color = "#557F23"
      } else {
        result.color = "#7F3723"
      }

      $(".quiz-box").html(ich.overviewTemplate(result));

      $(".retake").click(function() {
        id = 1;
        score = 0;
        showQuestion(id);
      });
    }
  }
};

showQuestion(id);
watchInput();

