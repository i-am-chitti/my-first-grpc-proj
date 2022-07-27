const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef); // load package Todo

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

server.bind("localhost:40000", grpc.ServerCredentials.createInsecure());

server.addService(todoPackage.Todo.service, {
	"createTodo": createTodo,
	"readTodos": readTodo,
	"readTodosStream": readTodosStream
});

server.start();

const todos = [];

function createTodo(call, callback) {
	const todo = {
		"id": todos.length+1,
		"text": call.request.text
	};

	todos.push(todo);
	callback(null, todo);

}

function readTodo(call, callback) {
	callback(null, {"items": todos});
}

// server streams to client
function readTodosStream(call, callback) {
	todos.forEach(t => call.write(t));
	call.end();
}
