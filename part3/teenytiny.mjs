import { Lexer } from "./lexer.mjs";
import { Emitter } from "./emitter.mjs";
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
  const emitter = new Emitter("out.c");
  const parser = new Parser(lexer, emitter);

  parser.program();
  emitter.writeFile();
  console.log("Compiling completed.");
};

main();
