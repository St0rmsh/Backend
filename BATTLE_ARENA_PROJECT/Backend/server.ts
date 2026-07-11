import app from "./src/app.js";
import config from "./src/config/config.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`
====================================================

🚀 Battle Arena Server Running

URL   : http://localhost:${PORT}

Health: http://localhost:${PORT}/api/health

Battle: POST http://localhost:${PORT}/api/battle

====================================================
`);
});