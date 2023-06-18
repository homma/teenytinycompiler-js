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
    this.abort(
      `Expected ${kind.description}, got ${this.curToken.kind.description}`
    );
  }
  this.nextToken();
};

p.prototype.nextToken = function (kind) {
  this.curToken = this.peekToken;
  this.peekToken = this.lexer.getToken();
};

p.prototype.abort = function (message) {
  console.error(`Error. ${message}`);
  process.exit(1);
};

p.prototype.program = function () {
  console.log("PROGRAM");

  while (!this.checkToken(TokenType.NEWLINE)) {
    this.nextToken();
  }

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
  } else if (this.checkToken(TokenType.IF)) {
    console.log("STATEMENT-IF");

    this.nextToken();
    this.comparison();

    this.match(TokenType.THEN);
    this.nl();

    while (!this.checkToken(TokenType.ENDIF)) {
      this.statement();
    }

    this.match(TokenType.ENDIF);
  } else if (this.checkToken(TokenType.WHILE)) {
    console.log("STATEMENT-WHILE");

    this.nextToken();
    this.comparison();

    this.match(TokenType.REPEAT);
    This.nl();

    while (!this.checkToken(TokenType.ENDWHILE)) {
      this.statement();
    }

    this.match(TokenType.ENDWHILE);
  } else if (this.checkToken(TokenType.LABEL)) {
    console.log("STATEMENT-LABEL");

    this.nextToken();
    this.match(TokenType.IDENT);
  } else if (this.checkToken(TokenType.GOTO)) {
    console.log("STATEMENT-GOTO");

    this.nextToken();
    this.match(TokenType.IDENT);
  } else if (this.checkToken(TokenType.LET)) {
    console.log("STATEMENT-LET");

    this.nextToken();
    this.match(TokenType.IDENT);
    this.match(TokenType.EQ);
    this.expression();
  } else if (this.checkToken(TokenType.INPUT)) {
    console.log("STATEMENT-INPUT");

    this.nextToken();
    this.match(TokenType.IDENT);
  } else {
    this.abort(
      `Invalid statement at ${this.curToken.text} ( ${this.curToken.kind.description} )`
    );
  }

  this.nl();
};

p.prototype.nl = function () {
  console.log("NEWLINE");

  this.match(TokenType.NEWLINE);
  while (this.checkToken(TokenType.NEWLINE)) {
    this.nextToken();
  }
};
