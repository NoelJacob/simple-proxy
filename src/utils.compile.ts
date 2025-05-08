export const num_chars = compileTime(() => {
	const url = process.env.CLOUDFLARE_WORKERS_URL;
	const MY_URL = url ?? 'http://localhost:5173/';
	const length = MY_URL.length;
	return length;
});
