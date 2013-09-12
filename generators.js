var fs = require("fs");

var process = nodeGeneratorRunner(function*() {
  try {
    var contents = yield fs.readFile.bind(fs,"generators.js");
    console.log("process: started");
    var contents = yield fs.readFile.bind(fs,"foo");
    console.log("process: back");
  } catch(e) {
    console.log("process: handled");
  }
  try {
    var contents = yield fs.readFile.bind(fs,"bar");
  } catch(e) {
    console.log("process: handled");
  }
});

function nodeGeneratorRunner(generatorConstructor) {

  return function() {

    function next(err,result) {
      console.log("runner: step");

      var step;

      if(err) {
        console.log("runner: throw");
        step = generator.throw(err);
      } else {
        step = generator.next(result);
      }

      if(step.done) {
        console.log("runner: finished");
        return step.value;
      }

      if(typeof step.value != "function") {
        throw new Error("Expected a function!");
      }

      step.value.call(null,next);
    }

    var generator = generatorConstructor.apply(this,arguments);
    next();
  }

};
