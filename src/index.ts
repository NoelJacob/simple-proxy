import { DurableObject } from 'cloudflare:workers';
import { num_chars } from './utils.compile';

export class MyDurableObject extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async durableFetch(req: Request): Promise<Response> {
		if (req.method === 'OPTIONS') {
			const headers = new Headers();
			headers.set('Access-Control-Allow-Origin', '*'); // req.headers.get("Origin")
			headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
			const access = req.headers.get('Access-Control-Request-Headers') || '*';
			headers.set('Access-Control-Allow-Headers', access);
			headers.set('Access-Control-Max-Age', '86400');
			return new Response(null, { headers: headers });
		}
		let headers = req.headers;
		console.log(headers);
		const url = 'https://' + req.url.slice(num_chars);
		const urlObj = new URL(url);
		headers.set('Host', urlObj.hostname);
		headers.delete('cf-connecting-ip');
		headers.delete('cf-ipcountry');
		headers.delete('cf-ray');
		headers.delete('cf-visitor');
		headers.delete('x-forwarded-proto');
		headers.delete('x-real-ip');
		headers.delete('x-forwarded-host');

		const method = req.method;
		const body = req.body;
		const access = req.headers.get('Access-Control-Request-Headers') || '*';

		const res = await fetch(url, {
			headers,
			method,
			body,
		});

		headers = new Headers(res.headers);
		headers.set('Access-Control-Allow-Origin', '*'); // req.headers.get("Origin")
		headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS, PATCH');
		headers.set('Access-Control-Allow-Headers', access);
		headers.set('Access-Control-Max-Age', '86400');

		return new Response(res.body, {
			headers,
			status: res.status,
			statusText: res.statusText,
		});
	}
}

export default {
	async fetch(req, env, ctx): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.jurisdiction('fedramp').idFromName('us');
		const stub = env.MY_DURABLE_OBJECT.get(id);
		return stub.durableFetch(req);
	},
} satisfies ExportedHandler<Env>;
