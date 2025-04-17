import { firebase } from '@/firebase';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';

export const loginUser = defineAction({
	accept: 'form',
	input: z.object({
		email: z.string().email(),
		password: z.string().min(6),
		remember_me: z.boolean().optional(),
	}),
	handler: async (input, context) => {
		const { email, password, remember_me } = input;
		const { cookies } = context;

		if (remember_me) {
			cookies.set('email', email, {
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //1 año
				path: '/',
			});
		} else {
			cookies.delete('email', {
				path: '/',
			});
		}

		try {
			const user = await signInWithEmailAndPassword(
				firebase.auth,
				email,
				password
			);

            console.log('user', user);
			//actualizar nombre

			//verificar correo electronico

			//return user;
			return { ok: true, msg: 'Usuario ok' };
		} catch (error) {
			console.log(error);

			const firebaseError = error as AuthError;
			if (firebaseError.code === 'auth/invalid-credential') {
				throw new Error('Credenciales invalidas.');
			}

			throw new Error('Error en ingreso del usuario.');
		}
	},
});
