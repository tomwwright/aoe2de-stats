import * as fs from "fs";

export type EmpiresStrings = ReturnType<typeof parseStrings>;

export function parseStrings(inputFilename: string) {
  const lines = fs
    .readFileSync(inputFilename)
    .toString()
    .split("\n");

  const strings: { [id: string]: string } = {};

  for (const line of lines) {
    const match = line.match(/(\d+) "(.*)"/);
    if (match) {
      strings[match[1]] = match[2];
    }
  }

  return {
    description: "Strings parsed from Age of Empires 2: Definitive Edition strings txt",
    stats: {
      inputFilename,
      linesLoaded: lines.length,
      stringsParsed: Object.keys(strings).length
    },
    strings
  };
}

// main
if (require.main === module) {
  console.log("== Age of Empires 2: Definitive Edition strings parser ==");
  const inputFilename = process.argv[2] || "dat/key-value-strings-utf8.txt";
  const outputFilename = process.argv[3] || "dat/empires-strings.json";

  console.log(`Input: ${inputFilename}\nOutput: ${outputFilename}`);

  const parsed = parseStrings(inputFilename);

  console.log(parsed.stats);

  const samples = [0, 1000, 1001, 1002, 2000, 2001, 2002, 3000, 3001, 3002].map(i => Object.entries(parsed.strings)[i]);
  console.log(samples);

  fs.writeFileSync(outputFilename, JSON.stringify(parsed));
}
