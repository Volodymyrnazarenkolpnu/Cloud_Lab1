const express = require("express");
	const bodyParser = require("body-parser");
	const multer = require("multer");
	const cors = require("cors");
    const path = require("path");
	const controller = require("./src/controller/item.controller");

	const app = express();

const PORT = process.env.PORT || 5050;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/api/getall", controller.findAll);
app.get("/api/get/:id", controller.findOneByID)
app.get("/api", (req, res) => {res.send("<p>hi</p>")})
app.post("/api/cart", controller.addToCart)
app.get("/api/cart", controller.getCart)
app.put("/api/cart/:id", controller.editCart)
app.delete("/api/cart/:id", controller.removeCart)
app.delete("/api/cart/clear/:user", controller.clearCart)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});


// app.post("/create", controller.create);

// app.delete("/delete/:id", controller.delete);

// app.put("/update/:id", controller.update);

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
});
