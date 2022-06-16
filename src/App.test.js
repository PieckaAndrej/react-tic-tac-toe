const App = require("./App");

test("x of id 2 is equal to 2", () => {
	expect(App.getX(2)).toBe(2);
})
