const express = require("express");
const path = require("path");

const app = express();
const PORT = 8000;

// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});