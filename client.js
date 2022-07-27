const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef); // load package Todo

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

// client.createTodo({
// 	"id": -1,
// 	"text": "laundry"
// }, (error, response) => {
// 	console.log('received from server', JSON.stringify(response));
// });

// client.readTodos({}, (error, response) => {
// 	console.log('All todos', JSON.stringify(response));
// })

const call = client.readTodosStream();
call.on("data", item => {
	console.log('received item from server', JSON.stringify(item));
});

call.on("end", e => console.log("server done"));
