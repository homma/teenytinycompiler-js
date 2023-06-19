import { Lexer, TokenType } from "./lexer.mjs";
export { Parser };

class Parser {
  curToken = null;
  peekToken = null;

  constructor(lexer, emitter) {
    this.lexer = lexer;
    this.emitter = emitter;

    this.symbols = new Set();
    this.labelsDeclared = new Set();
    this.labelsGotoed = new Set();

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
  this.emitter.headerLine("#include <stdio.h>");
  this.emitter.headerLine("int main(void){");

  while (this.checkToken(TokenType.NEWLINE)) {
    this.nextToken();
  }

  while (!this.checkToken(TokenType.EOF)) {
    this.statement();
  }

  this.emitter.emitLine("return 0;");
  this.emitter.emitLine("}");

  for (let label of this.labelsGotoed) {
    if (!this.labelsDeclared.has(label)) {
      this.abort(`Attempting to GOTO to undeclared label: ${label}`);
    }
  }
};

p.prototype.statement = function () {
  if (this.checkToken(TokenType.PRINT)) {
    this.nextToken();

    if (this.checkToken(TokenType.STRING)) {
      this.emitter.emitLine(`printf("${this.curToken.text}\\n");`);
      this.nextToken();
    } else {
      this.emitter.emit(`printf("%.2f\\n", (float(`);
      this.expression();
      this.emitter.emitLine("));");
    }
  } else if (this.checkToken(TokenType.IF)) {
    this.nextToken();
    this.comparison();

    this.match(TokenType.THEN);
    this.nl();

    while (!this.checkToken(TokenType.ENDIF)) {
      this.statement();
    }

    this.match(TokenType.ENDIF);
  } else if (this.checkToken(TokenType.WHILE)) {
    this.nextToken();
    this.comparison();

    this.match(TokenType.REPEAT);
    this.nl();

    while (!this.checkToken(TokenType.ENDWHILE)) {
      this.statement();
    }

    this.match(TokenType.ENDWHILE);
  } else if (this.checkToken(TokenType.LABEL)) {
    this.nextToken();

    if (this.labelsDeclared.has(this.curToken.text)) {
      this.abort(`Label already exists; ${this.curToken.text}`);
    }
    this.labelsDeclared.add(this.curToken.text);

    this.match(TokenType.IDENT);
  } else if (this.checkToken(TokenType.GOTO)) {
    this.nextToken();
    this.labelsGotoed.add(this.curToken.text);
    this.match(TokenType.IDENT);
  } else if (this.checkToken(TokenType.LET)) {
    this.nextToken();

    if (!this.symbols.has(this.curToken.text)) {
      this.symbols.add(this.curToken.text);
    }

    this.match(TokenType.IDENT);
    this.match(TokenType.EQ);
    this.expression();
  } else if (this.checkToken(TokenType.INPUT)) {
    this.nextToken();

    if (!this.symbols.has(this.curToken.text)) {
      this.symbols.add(this.curToken.text);
    }

    this.match(TokenType.IDENT);
  } else {
    this.abort(
      `Invalid statement at ${this.curToken.text} ( ${this.curToken.kind.description} )`
    );
  }

  this.nl();
};

p.prototype.nl = function () {
  this.match(TokenType.NEWLINE);
  while (this.checkToken(TokenType.NEWLINE)) {
    this.nextToken();
  }
};

p.prototype.comparison = function () {
  this.expression();

  if (this.isComparisonOperator()) {
    this.nextToken();
    this.expression();
  } else {
    this.abort(`Expected comparison operator at: ${this.curToken.text}`);
  }

  while (this.isComparisonOperator()) {
    this.nextToken();
    this.expression();
  }
};

p.prototype.isComparisonOperator = function () {
  return (
    this.checkToken(TokenType.GT) ||
    this.checkToken(TokenType.GTEQ) ||
    this.checkToken(TokenType.LT) ||
    this.checkToken(TokenType.LTEQ) ||
    this.checkToken(TokenType.EQEQ) ||
    this.checkToken(TokenType.NOTEQ)
  );
};

p.prototype.expression = function () {
  this.term();

  while (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
    this.nextToken();
    this.term();
  }
};

p.prototype.term = function () {
  this.unary();

  while (
    this.checkToken(TokenType.ASTERISK) ||
    this.checkToken(TokenType.SLASH)
  ) {
    this.nextToken();
    this.unary();
  }
};

p.prototype.unary = function () {
  if (this.checkToken(TokenType.PLUS) || this.checkToken(TokenType.MINUS)) {
    this.nextToken();
  }

  this.primary();
};

p.prototype.primary = function () {
  if (this.checkToken(TokenType.NUMBER)) {
    this.nextToken();
  } else if (this.checkToken(TokenType.IDENT)) {
    if (!this.symbols.has(this.curToken.text)) {
      this.abort(
        `Referencing variable before assignments: ${this.curToken.text}`
      );
    }
    this.nextToken();
  } else {
    this.abort(`Unexpected token at ${this.curToken.text}`);
  }
};
