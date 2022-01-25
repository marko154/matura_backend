import express, { ErrorRequestHandler } from "express";
import createError from "http-errors";
import cors from "cors";
import compression from "compression";
import routes from "./routes";

const app = express();

// middleware
app.use(cors());
app.use(compression());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api", routes);

app.use((req, res, next) => {
	next(createError(404));
});

app.use(((err, req, res, next) => {
	res.status(err.status || 500).json({
		status: false,
		message: err.message,
	});
}) as ErrorRequestHandler);

app.listen(port, () => {
	// tslint:disable-next-line no-console
	return console.log(`Express is listening at http://localhost:${port}`);
});
