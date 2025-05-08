export const num_chars = compileTime(() => {
	const MY_URL = 'http://localhost:5173/';
	const length = MY_URL.length;
	return length;
});
