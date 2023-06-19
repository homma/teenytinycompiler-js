import { Lexer, TokenType } from "./lexer.mjs";
import { Parser } from "./parser.mjs";
import fs from "fs";

const main = () => {
  console.log("Teeny Tiny Compiler");

  if (process.argv.length != 3) {
    console.error("Error: Compiler needs source file as argument.");
    process.exit(1);
  }

  const source = fs.readFileSync(process.argv[2], { encoding: "utf8" });

  const lexer = new Lexer(source);
  const parser = new Parser(lexer);

  parser.program();
  console.log("Parsing completed.");
};

main();
