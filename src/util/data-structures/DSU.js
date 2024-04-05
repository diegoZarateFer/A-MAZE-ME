export default class DSU {
  constructor() {
    this.parents = [];
  }
  find(x) {
    if (typeof this.parents[x] != "undefined") {
      if (this.parents[x] < 0) {
        return x;
      } else {
        return this.find(this.parents[x]);
      }
    } else {
      this.parents[x] = -1;
      return x;
    }
  }
  union(x, y) {
    var xpar = this.find(x);
    var ypar = this.find(y);
    if (xpar != ypar) {
      this.parents[xpar] += this.parents[ypar];
      this.parents[ypar] = xpar;
      return false;
    } else {
      return true;
    }
  }
}
