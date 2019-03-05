/*
* Includes all unit tests
*/

const assert = require('assert');
const http = require('http');
const lib = require('../app/lib');

//make a http request
var make_http_request = (path, method, headers, json_payload, callback)=>{

    var body = typeof(json_payload) == "object" && json_payload !=null ? JSON.stringify(json_payload) : false;
    var request_options = {
        protocol: "http:",
        host: "localhost",
        port: 3000,
        path: path,
        method: method,
        headers : {
            "Content-Type" : "application/json"
        }
    }
    if(typeof(headers) == "object" && headers != null){
        for(var h in headers){
            if(headers.hasOwnProperty(h)){
                request_options.headers[h] = headers[h];
            }
        }
    }
    if(body) request_options.headers["Content-Length"] = Buffer.byteLength(body);
    var called_back = false;
    var req = http.request(request_options, (res)=>{
        var chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            //getting response body
            var body = Buffer.concat(chunks).toString();
            var json_resp = JSON.parse(body);
            if(!called_back){
                callback(null, res.statusCode, json_resp);
                called_back = true;
            }
            
        });
    });
    req.on('error',(e)=>{
        if(!called_back){
            called_back = true;
            callback(e);
        }
    });

    if(body) req.write(body);
    req.end();
}

//put all requests in this array
var unit = [];

//we will start off with testing some sync functions

unit.push({
    name: "Get a string",
    fn: (done)=>{
        var str = lib.get_string();
        assert.equal(typeof(str),"string");
        done();
    }
});

unit.push({
    name: "Get an error",
    fn: (done)=>{
        assert.throws(lib.get_error, Error);
        done();
    }
});

unit.push({
    name: "Get reference error",
    fn: (done)=>{
        assert.throws(lib.get_reference_error, ReferenceError);
        done();
    }
});

unit.push({
    name: "Get type instance - string",
    fn: (done)=>{
        var instance = lib.get_type_instance("string");
        assert.equal(typeof(instance),"string");
        done();
    }
});

unit.push({
    name: "Get type instance - number",
    fn: (done)=>{
        var instance = lib.get_type_instance("number");
        assert.equal(typeof(instance),"number");
        assert.deepEqual(instance,3);
        done();
    }
});

unit.push({
    name: "Get type instance - boolean",
    fn: (done)=>{
        var instance = lib.get_type_instance("boolean");
        assert.equal(typeof(instance),"boolean");
        done();
    }
});

unit.push({
    name: "Get type instance - boolean (false)",
    fn: (done)=>{
        var instance = lib.get_type_instance("boolean");
        assert.equal(typeof(instance),"boolean");
        assert.deepEqual(instance, false);
        done();
    }
});

unit.push({
    name: "Get type instance - function",
    fn: (done)=>{
        var instance = lib.get_type_instance("function");
        assert.equal(typeof(instance),"function");
        assert.doesNotThrow(instance, Error);
        done();
    }
});

unit.push({
    name: "Round off to nearest 10 for 13",
    fn: (done)=>{
        var instance = lib.round_off_to_nearest_10(13);
        assert.equal(typeof(instance),"number");
        assert.deepEqual(instance, 10);
        done();
    }
});

unit.push({
    name: "Round off to nearest 10 for 66",
    fn: (done)=>{
        var instance = lib.round_off_to_nearest_10(66);
        assert.equal(typeof(instance),"number");
        assert.deepEqual(instance, 70);
        done();
    }
});

unit.push({
    name: "Round off to nearest 10 for a string",
    fn: (done)=>{
        var instance = lib.round_off_to_nearest_10("Dfdf");
        assert.equal(typeof(instance),"number");
        //instance should not be a number
        assert.ok(isNaN(instance));
        done();
    }
});

unit.push({
    name: "Check for palindrome - noon",
    fn: (done)=>{
        var instance = lib.check_palindrome("noon");
        assert.ok(instance);
        done();
    }
});

unit.push({
    name: "Check for palindrome - racecar",
    fn: (done)=>{
        var instance = lib.check_palindrome("racecar");
        assert.ok(instance);
        done();
    }
});

unit.push({
    name: "Check for palindrome - wrongnowr",
    fn: (done)=>{
        var instance = lib.check_palindrome("wrongnowr");
        assert.ok(instance);
        done();
    }
});


//let us now test some async functions
unit.push({
    name: "Call simple async function",
    fn: (done)=>{
        lib.simple_async_function((ret)=>{
            assert.deepEqual(ret, undefined);
            done();
        });
    }
});

unit.push({
    name: "Call delayed async function",
    fn: (done)=>{
        lib.delayed_async_function((ret)=>{
            assert.deepEqual(ret, undefined);
            done();
        });
    }
});

unit.push({
    name: "Call async function that returns error",
    fn: (done)=>{
        lib.get_async_error((ret)=>{
            assert.equal(typeof(ret),"object");
            assert.ok(ret instanceof Error);
            done();
        });
    }
});

unit.push({
    name: "Call async function that returns json",
    fn: (done)=>{
        lib.get_async_json((err, json)=>{
            assert.equal(typeof(err),"undefined");
            assert.equal(typeof(json),"object");
            assert.equal(typeof(json.string),"string");
            assert.equal(typeof(json.number),"number");
            assert.equal(typeof(json.fn),"function");
            assert.equal(typeof(json.boolean),"boolean");
            assert.ok(json.boolean);
            assert.equal(typeof(json.array),"object");
            assert.ok(json.array instanceof Array);
            assert.equal(typeof(json.err),"object");
            assert.ok(json.err instanceof Error);
            done();
        });
    }
});

module.exports = unit;