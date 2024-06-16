export function errorHandler( error, req, res, next ){
	console.log(`This is an error ${ error }`);
	res.status(500).json({ message: "Something went wrong" });
}

export function notFoundHandler( req, res, next ){
	res.status(404).json({ message: "Resource not found" });
}