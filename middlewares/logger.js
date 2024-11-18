const fs = require("fs");
const path = require("path");

function loggerFile(req, res) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const logDir = path.join(__dirname, "log");
  const logFile = path.join(logDir, `${today}.txt`);
  const logMessage = `${req.method} ${res.statusCode} - ${
    req.originalUrl
  } - ${now.toISOString()} \n`;

  try {
    // Vérifier si le répertoire de logs existe, sinon le créer
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // Vérifier si le fichier de log existe, sinon le créer
    if (fs.existsSync(logFile)) {
      fs.appendFileSync(logFile, logMessage);
    } else {
      fs.writeFileSync(logFile, logMessage);
    }
  } catch (error) {
    console.error("Erreur lors de l'écriture du log :", error);
  }
}

module.exports = loggerFile;
