import { Lexer, TokenType } from "./lexer.mjs";

// Test code

const test1 = () => {
  const source = "LET foobar = 123";
  const lexer = new Lexer(source);

  while (lexer.peek() != "\0") {
    console.log(lexer.curChar);
    lexer.nextChar();
  }
};

const test2 = () => {
  const source = "+- */";
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

const test3 = () => {
  const source = "+- */>>= = !=";
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

const test4 = () => {
  const source = "+- # This is a comment!\n */";
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

const test5 = () => {
  const source = '+- "This is a string" # This is a comment!\n */';
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

const test6 = () => {
  const source = "+- 123 9.8654 */";
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

const test7 = () => {
  const source = "IF+-123 foo*THEN/";
  const lexer = new Lexer(source);

  let token = lexer.getToken();
  while (token.kind != TokenType.EOF) {
    console.log(token.kind);
    token = lexer.getToken();
  }
};

// main

const main = () => {
  test7();
};
main();
