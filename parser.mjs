import { Lexer, TokenType } from "./lexer.mjs";
export { Parser };

class Parser {
  curToken = null;
  peekToken = null;

  constructor(lexer) {
    this.lexer = lexer;

    this.nextToken();
    this.nextToken();
  }
}

const p = Parser;

p.prototype.checkToken = function (kind) {
  return kind == this.curToken.kind;
};

p.prototype.checkPeek = function (kind) {
  return kind == this.peekToken.kind;
};

p.prototype.match = function (kind) {
  if (!this.checkToken(kind)) {
    this.abort(`Expected ${kind.name}, got ${this.curToken.kind.name}`);
  }
  this.nextToken();
};

p.prototype.nextToken = function (kind) {
  this.curToken = this.peekToken;
  this.peekToken = this.lexer.getToken();
};

p.prototype.abort = function (message) {
  //
};

p.prototype.program = function () {
  console.log("PROGRAM");

  while (!this.checkToken(TokenType.EOF)) {
    this.statement();
  }
};

p.prototype.statement = function () {
  if (this.checkToken(TokenType.PRINT)) {
    console.log("STATEMENT-PRINT");
    this.nextToken();

    if (this.checkToken(TokenType.STRING)) {
      this.nextToken();
    } else {
      this.expression();
    }

    this.nl();
  }
};

p.prototype.nl = function () {
  console.log("NEWLINE");

  this.match(TokenType.NEWLINE);
  while (this.checkToken(TokenType.NEWLINE)) {
    this.nextToken();
  }
};
