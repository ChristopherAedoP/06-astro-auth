/** @format */

import { firebase } from '@/firebase';
import type { MiddlewareNext } from 'astro';
import { defineMiddleware } from 'astro:middleware';

const privateRoutes = ['/protected'];
const notAuthenticatedRoutes = ['/login','/register'];

export const onRequest = defineMiddleware((context, next) => {
	console.log('Ejecutado en el Middleware');
	//console.log(context)
	 const { url, request, locals, redirect } = context;
	// const authHeaders = request.headers.get('authorization') ?? '';

	// if (privateRoutes.includes(url.pathname)) {
	// 	return checkLocalAuth(authHeaders, next);
	// }

	const isLoggedIn = !!firebase.auth.currentUser;
	const user= firebase.auth.currentUser;

	locals.isLoggedIn = isLoggedIn;
	if (user) {
		locals.user= {
			name: user.displayName!,
			email:user.email!,
			avatar: user.photoURL ?? '',
			emailVerified: user.emailVerified
		}
	}

	if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
		return redirect('/');
	}
	
	if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
		return redirect('/');
	}


	return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
	if (authHeaders) {
		const authValues = authHeaders.split(' ').at(-1) ?? 'user:pass';
		const decodedValue = atob(authValues).split(':');
		const [user, password] = decodedValue;

		if (user === 'admin' && password === 'admin') {
			return next();
		}
	}

	return new Response('Auth Necesaria', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic real="Secure Area"',
		},
	});
};
