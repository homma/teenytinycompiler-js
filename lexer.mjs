export { Lexer, TokenType };

class Lexer {
  curChar = "";
  curPos = -1;
  constructor(source) {
    this.source = source + "\n";
    this.nextChar();
  }
}

const l = Lexer;

l.prototype.nextChar = function () {
  this.curPos += 1;
  if (this.curPos >= this.source.length) {
    this.curChar = "\0";
  } else {
    this.curChar = this.source[this.curPos];
  }
};

l.prototype.peek = function () {
  if (this.curPos + 1 >= this.source.length) {
    return "\0";
  }
  return this.source[this.curPos + 1];
};

l.prototype.abort = function (message) {
  console.error(`Lexing error. ${message}`);
  process.exit(1);
};

l.prototype.skipWhitespace = function () {
  while (this.curChar == " " || this.curChar == "\t" || this.curChar == "\r") {
    this.nextChar();
  }
};

l.prototype.skipComment = function () {
  if (this.curChar == "#") {
    while (this.curChar != "\n") this.nextChar();
  }
};

l.prototype.getToken = function () {
  this.skipWhitespace();
  this.skipComment();

  let token = null;

  const isDigit = (c) => /\d/.test(c);
  const isAlpha = (c) => /[a-zA-Z]/.test(c);
  const isAlNum = (c) => /[a-zA-Z0-9]/.test(c);

  if (this.curChar == "+") {
    token = new Token(this.curChar, TokenType.PLUS);
  } else if (this.curChar == "-") {
    token = new Token(this.curChar, TokenType.MINUS);
  } else if (this.curChar == "*") {
    token = new Token(this.curChar, TokenType.ASTERISK);
  } else if (this.curChar == "/") {
    token = new Token(this.curChar, TokenType.SLASH);
  } else if (this.curChar == "=") {
    if (this.peek() == "=") {
      const lastChar = this.curChar;
      this.nextChar;
      token = new Token(lastChar + this.curChar, TokenType.EQEQ);
    } else {
      token = new Token(this.curChar, TokenType.EQ);
    }
  } else if (this.curChar == ">") {
    if (this.peek() == "=") {
      const lastChar = this.curChar;
      this.nextChar();
      token = new Token(lastChar + this.curChar, TokenType.GTEQ);
    } else {
      token = new Token(this.curChar, TokenType.GT);
    }
  } else if (this.curChar == "<") {
    if (this.peek() == "=") {
      const lastChar = this.curChar;
      this.nextChar();
      token = new Token(lastChar + this.curChar, TokenType.LTEQ);
    } else {
      token = new Token(this.curChar, TokenType.LT);
    }
  } else if (this.curChar == "!") {
    if (this.peek() == "=") {
      const lastChar = this.curChar;
      this.nextChar();
      token = new Token(lastChar + this.curChar, TokenType.NOTEQ);
    } else {
      this.abort(`Expected !=, got !${this.peek()}`);
    }
  } else if (this.curChar == '"') {
    this.nextChar();
    const startPos = this.curPos;

    while (this.curChar != '"') {
      if (
        this.curChar == "\r" ||
        this.curChar == "\n" ||
        this.curChar == "\t" ||
        this.curChar == "\\" ||
        this.curChar == "%"
      ) {
        this.abort("Illegal character in string.");
      }
      this.nextChar();
    }

    const tokText = this.source.substring(startPos, this.curPos);
    token = new Token(tokText, TokenType.STRING);
  } else if (isDigit(this.curChar)) {
    const startPos = this.curPos;
    while (isDigit(this.peek())) {
      this.nextChar();
    }
    if (this.peek() == ".") {
      this.nextChar();

      if (!isDigit(this.peek())) {
        this.abort("Illegal character in number.");
      }
      while (isDigit(this.peek())) {
        this.nextChar();
      }
    }

    const tokText = this.source.substring(startPos, this.curPos + 1);
    token = new Token(tokText, TokenType.NUMBER);
  } else if (isAlpha(this.curChar)) {
    const startPos = this.curPos;
    while (isAlNum(this.peek())) {
      this.nextChar();
    }

    const tokText = this.source.substring(startPos, this.curPos + 1);
    const keyword = Token.checkIfKeyword(tokText);
    if (keyword == false) {
      token = new Token(tokText, TokenType.IDENT);
    } else {
      token = new Token(tokText, keyword);
    }
  } else if (this.curChar == "\n") {
    token = new Token(this.curChar, TokenType.NEWLINE);
  } else if (this.curChar == "\0") {
    token = new Token("", TokenType.EOF);
  } else {
    this.abort(`Unknown token : ${this.curChar}`);
  }
  this.nextChar();

  return token;
};

class Token {
  constructor(tokenText, tokenKind) {
    this.text = tokenText;
    this.kind = tokenKind;
  }
}

Token.checkIfKeyword = (s) => {
  if (keywords.includes(s)) {
    return TokenType[s];
  }
  return false;
};

const keywords = [
  "LABEL",
  "GOTO",
  "PRINT",
  "INPUT",
  "LET",
  "IF",
  "THEN",
  "ENDIF",
  "WHILE",
  "REPEAT",
  "ENDWHILE",
];

const operators = [
  "EQ",
  "PLUS",
  "MINUS",
  "ASTERISK",
  "SLASH",
  "NOTEQ",
  "LT",
  "LTEQ",
  "GT",
  "GTEQ",
];

const tokenTypes = ["EOF", "NEWLINE", "NUMBER", "IDENT", "STRING"].concat(
  keywords,
  operators
);

const makeEnum = (arr) => {
  let ret = {};
  arr.forEach((val) => (ret[val] = Symbol(val)));
  return ret;
};

const TokenType = makeEnum(tokenTypes);
