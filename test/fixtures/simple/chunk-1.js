module.exports = function chunk1() {
  const a = 20;
  function foo() {
    const a = 10;
    function test1() {
      return function g1() {};
    }
    return "124";
  }
};
