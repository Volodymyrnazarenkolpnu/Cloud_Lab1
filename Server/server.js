const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const controller = require("./src/controller/item.controller");
const { error } = require("console");

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10
});

var GetKey = (h, callback) => {
	client.getSigningKey(h.kid, (e, key) => {
		if (e) {
			return callback(e, null)
		}
		const Skey = key.getPublicKey()
		callback(null, Skey)
	})
}

const middleware = (req, res, next) => {
	const headers = req.headers.authorization
	if (!headers) {
		return res.status(401).json({
			error: "Unauthorized",
			message: "No token"
		})
	}
	const token = headers.split(" ")[1]
	jwt.verify(token, GetKey, {
		audience: [CLIENT_ID, `api://${CLIENT_ID}`],
		issuer: [
			`https://login.microsoftonline.com/${TENANT_ID}/v2.0`
		],
		algorithms: ["RS256"]
	}),
	(e, result) => {
		if (e) {
		return res.status(401).json({
			error: "Unauthorized",
			message: `invalid token`
		});
		}
		req.user = result;
		next();
	}
}

const app = express();

const PORT = process.env.PORT || 5050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/getall", middleware, controller.findAll);
app.get("/api/get/:id",middleware, controller.findOneByID)
app.get("/api", middleware, (req, res) => {res.send("<p>hi</p>")})
app.post("/api/cart", middleware, controller.addToCart)
app.get("/api/cart", middleware, controller.getCart)
app.put("/api/cart/:id", middleware, controller.editCart)
app.delete("/api/cart/:id", middleware, controller.removeCart)
app.delete("/api/cart/clear/:user", middleware, controller.clearCart)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});


// app.post("/create", controller.create);

// app.delete("/delete/:id", controller.delete);

// app.put("/update/:id", controller.update);

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
});
