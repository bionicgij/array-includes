module.exports = function (includes, t) {
	var sparseish = { length: 5, 0: 'a', 1: 'b' };
	var overfullarrayish = { length: 2, 0: 'a', 1: 'b', 2: 'c' };
	var thrower = { valueOf: function () { throw new RangeError('whoa'); } };
	var numberish = { valueOf: function () { return 2; } };

	t.test('exceptions', function (et) {
		et.test('bad array/this value', function (st) {
			st.throws(function () { return includes(undefined, 'a'); }, TypeError, 'undefined is not an object');
			st.throws(function () { return includes(null, 'a'); }, TypeError, 'null is not an object');
			st.end();
		});

		et.test('fromIndex conversion', function (st) {
			st.throws(function () { return includes([0], 0, thrower); }, RangeError, 'fromIndex conversion throws');
			st.end();
		});

		et.test('ToLength', function (st) {
			st.throws(function () { return includes({ length: thrower, 0: true }, true); }, RangeError, 'ToLength conversion throws');
			st.end();
		});

		et.end();
	});

	t.test('arraylike', function (st) {
		st.equal(true, includes(sparseish, 'a'), 'sparse array-like object includes "a"');
		st.equal(false, includes(sparseish, 'c'), 'sparse array-like object does not include "c"');

		st.equal(true, includes(overfullarrayish, 'b'), 'sparse array-like object includes "b"');
		st.equal(false, includes(overfullarrayish, 'c'), 'sparse array-like object does not include "c"');
		st.end();
	});

	t.test('fromIndex', function (ft) {
		ft.equal(true, includes([1], 1, NaN), 'NaN fromIndex -> 0 fromIndex');

		ft.test('number coercion', function (st) {
			st.equal(false, includes(['a', 'b', 'c'], 'a', numberish), 'does not find "a" with object fromIndex coercing to 2');
			st.equal(false, includes(['a', 'b', 'c'], 'a', '2'), 'does not find "a" with string fromIndex coercing to 2');
			st.equal(true, includes(['a', 'b', 'c'], 'c', numberish), 'finds "c" with object fromIndex coercing to 2');
			st.equal(true, includes(['a', 'b', 'c'], 'c', '2'), 'finds "c" with string fromIndex coercing to 2');
			st.end();
		});

		ft.test('fromIndex greater than length', function (st) {
			st.equal(false, includes([1], 1, 2), 'array of length 1 is not searched if fromIndex is > 1');
			st.equal(false, includes([1], 1, 1), 'array of length 1 is not searched if fromIndex is >= 1');
			st.equal(false, includes([1], 1, 1.1), 'array of length 1 is not searched if fromIndex is 1.1');
			st.equal(false, includes([1], 1, Infinity), 'array of length 1 is not searched if fromIndex is Infinity');
			st.end();
		});

		ft.test('negative fromIndex', function (st) {
			st.equal(true, includes([1, 3], 1, -4), 'computed length would be negative; fromIndex is thus 0');
			st.equal(true, includes([1, 3], 3, -4), 'computed length would be negative; fromIndex is thus 0');
			st.equal(true, includes([1, 3], 1, -Infinity), 'computed length would be negative; fromIndex is thus 0');

			st.equal(true, includes([12, 13], 13, -1), 'finds -1st item with -1 fromIndex');
			st.equal(false, includes([12, 13], 12, -1), 'does not find -2nd item with -1 fromIndex');
			st.equal(true, includes([12, 13], 13, -2), 'finds -2nd item with -2 fromIndex');

			st.equal(true, includes(sparseish, 'b', -4), 'finds -4th item with -4 fromIndex');
			st.equal(false, includes(sparseish, 'a', -4), 'does not find -5th item with -4 fromIndex');
			st.equal(true, includes(sparseish, 'a', -5), 'finds -5th item with -5 fromIndex');
			st.end();
		});

		ft.end();
	});
};
