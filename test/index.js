/*
*  index file that will start all the tests that we have to run
*/
var helpers = {};

helpers.color_command = (str, clr) => {
    var colors = {};
    colors.black = "\x1b[30m";
    colors.red = "\x1b[31m";
    colors.green = "\x1b[32m";
    colors.yellow = "\x1b[33m";
    colors.blue = "\x1b[34m";
    colors.magenta = "\x1b[35m";
    colors.cyan = "\x1b[36m";
    colors.white = "\x1b[37m";

    if(colors.hasOwnProperty(clr)){
        return colors[clr]+str+"\x1b[0m";
    }
    else return str;
}

class runner{
    constructor(){
        this.__tests = require('./unit');
    }
    run(){
        var self = this;
        var limit = self.__tests.length;
        var counter = 0
        var successes = 0;
        var errors = [];
        //get all tests for api. let us say they are in an array
        var run_ith_test = function(i){
            if(counter == self.__tests.length){
                self.produce_test_report(limit, successes, errors);
            }
            var test_name = self.__tests[i].name;
            var test_function = self.__tests[i].fn;
            try{
                test_function((err)=>{
                    if(err){
                        errors.push({
                            name: test_name,
                            error: err
                        });
                        counter++;
        
                        //log the test name in red
                        console.log(helpers.color_command((i+1).toString()+". TEST RUN FAILURE: "+test_name,"red"));
                        //run next fn
                        run_ith_test(i+1);        
                    }
                    else{
                        //if the callback was called it means the test run was a success
                        counter++;
                        successes++;

                        //log the test name in green
                        console.log(helpers.color_command((i+1).toString()+". TEST RUN SUCCESS: "+test_name,"green"));
                        //run next fn
                        run_ith_test(i+1);    
                    }
                });
            }
            catch(e){
                //if error was caught, it means the test run was a failure
                errors.push({
                    name: test_name,
                    error: e
                });
                counter++;

                //log the test name in red
                console.log(helpers.color_command((i+1).toString()+". TEST RUN FAILURE: "+test_name,"red"));
                //run next fn
                run_ith_test(i+1);
            }
        }
        //run in series
        run_ith_test(0);
    }

    produce_test_report(limit, successes, errors){
        console.log("");
        console.log("--------BEGIN TEST REPORT--------");
        console.log("");
        console.log("Total Tests: ",limit);
        console.log("Pass: ",successes);
        console.log("Fail: ",errors.length);
        console.log("");
        
        // If there are errors, print them in detail
        if(errors.length > 0){
            console.log("--------BEGIN ERROR DETAILS--------");
            console.log("");
            errors.forEach(function(test_error){
                console.log(helpers.color_command(test_error.name,"red"));
                console.log(test_error.error);
                console.log("");
            });
            console.log("");
            console.log("--------END ERROR DETAILS--------");
        }
        console.log("");
        console.log("--------END TEST REPORT--------");
        process.exit(0);
    }
}

var __runner = new runner();
if(require.main === module){
    __runner.run();
}


module.exports = __runner;