import fs from "node:fs";

const files = [
  "public/send.php",
  "public/send.config.php",
  "public/send.config.php.example",
  "public/send.php.example",
  "public/pay.php",
  "public/pay.config.php",
  "public/pay.config.php.example",
  "public/tbank-notify.php",
  "public/lib/tbank.php",
  "out/send.php",
  "out/send.config.php",
  "out/send.config.php.example",
  "out/pay.php",
  "out/pay.config.php",
  "out/pay.config.php.example",
  "out/tbank-notify.php",
  "out/lib/tbank.php",
];

const result = {};
for (const file of files) {
  if (!fs.existsSync(file)) {
    result[file] = "missing";
    continue;
  }

  const source = fs.readFileSync(file, "utf8");
  result[file] = {
    exists: true,
    hasPlaceholder: /YOUR_|ВАШ-|REPLACE|TODO/i.test(source),
    hasLikelyBotToken: /\b\d{8,}:[A-Za-z0-9_-]{20,}\b/.test(source),
  };
}

console.log(JSON.stringify(result, null, 2));
