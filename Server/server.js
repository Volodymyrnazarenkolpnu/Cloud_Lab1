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

app.get("/getall", controller.findAll);
app.get("/get/:id", controller.findOneByID)
app.get("/", (req, res) => {res.send("<p>hi</p>")})
app.post("/cart", controller.addToCart)
app.get("/cart", controller.getCart)
app.put("/cart/:id", controller.editCart)
app.delete("/cart/:id", controller.removeCart)
app.delete("/cart/clear/:user", controller.clearCart)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});


// app.post("/create", controller.create);

// app.delete("/delete/:id", controller.delete);

// app.put("/update/:id", controller.update);

app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
});
