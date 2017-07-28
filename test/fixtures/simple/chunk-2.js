module.exports = function chunk2() {
  // small change
  const a = function() {};
  function foo() {
    const a = 10;
    function test2() {
      return function g2() {};
    }
    return "124";
  }
};
