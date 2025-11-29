require("dotenv").config();
const app = require("./app");
const bulkImportRoutes = require("./modules/bulkimport/bulkimport.routes");
const PORT = process.env.PORT || 3000;
app.use("/api/bulkimport", bulkImportRoutes);
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


