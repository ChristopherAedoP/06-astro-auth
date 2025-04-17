/** @format */

import { firebase } from '@/firebase';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const loginWithGoogle = defineAction({
	accept: 'json',
	input: z.any(),
	handler: async (credentials) => {
		const credential = GoogleAuthProvider.credentialFromResult(credentials);

		if (!credential) {
            throw new Error('google signin fallo ')
		}

		await signInWithCredential(firebase.auth, credential);

        return {ok: true}
	},
});
