export { Emitter };
import fs from "fs";

class Emitter {
  header = "";
  code = "";

  constructor(fullPath) {
    this.fullPath = fullPath;
  }
}

const e = Emitter;

e.prototype.emit = function (code) {
  this.code += code;
};

e.prototype.emitLine = function (code) {
  this.code += code + "\n";
};

e.prototype.headerLine = function (code) {
  this.header += code + "\n";
};

e.prototype.writeFile = function () {
  const fd = fs.openSync(this.fullPath, "w");
  fs.writeSync(fd, `${this.header}${this.code}`, null, { encoding: "utf8" });
};
