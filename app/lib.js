/*
*
* File having various sync and async functions that we will run tests for
*/

var lib = {}

//Perfectly fine sync function
lib.get_string = () => {
    return "hello";
}

//Sync function that throws an error
lib.get_error = () => {
    throw new Error("error");
}

//Sync function that throws a reference error
lib.get_reference_error = () => {
    var bar = foo;
}

//sync function that returns an object based on the type sent
lib.get_type_instance = (type) => {
    switch(type){
        case "string":
        return "hello";
        break;

        case "number":
        return 3;
        break;

        case "boolean":
        return true;
        break;

        case "undefined":
        return undefined;
        break;

        case "function":
        return ()=>{};
        break;

        case "object":
        return {};
        break;

        default:
        throw new Error("no type sent");
        break;
    }
}

//sync functions that performs some calculation
lib.round_off_to_nearest_10 = (num) => {
    let ten = (num/10);
    if(ten - Math.floor(ten) < Math.ceil(ten) - ten){
        return 10*Math.floor(ten);
    }
    else return 10*Math.ceil(ten);

}

//sync function that checks if a string is a palindrome
lib.check_palindrome = (str) => {
    for(var i = 0; i<str.length/2; i++){
        if(str[i] == str[str.length -1 -i]){
            //continue
            continue;
        }
        else return false;
    }
    return true;
}


//async function that does nothing
lib.simple_async_function = (callback) => {
    callback();
}

//async function that calls back after a delay
lib.delayed_async_function = (callback) => {
    setTimeout(()=>{
        callback();
    },500);
}

//async function that calls back after a delay
lib.get_async_error = (callback) => {
    setTimeout(()=>{
        var err = new Error("test")
        callback(err);
    },500);
}

lib.get_async_json = (callback) => {
    setTimeout(()=>{
        var json = {
            string : "hello",
            number : 3,
            fn : ()=>{},
            boolean: true,
            array: [],
            err: new Error("test")
        };
        callback(undefined, json);
    },500);
}

module.exports = lib;