// auth.config.ts archivo de configuración de autenticación

import type { NextAuthConfig } from 'next-auth';

//authConfig, este objeto contendra las opciones de configuración para NextAuth
export const authConfig = {
  pages: { signIn: '/login' },
// Definimos los callbacks para manejar la autorización y redirección
//Anadimos la logica para proteger las rutas 
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//La authorizeddevolución de llamada se utiliza para verificar si la solicitud
//está autorizada a acceder a una página con el proxy de Next.js.
      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      return true;
    },
  },
  providers: [], // por ahora vacío, más adelante se agregan proveedores
} satisfies NextAuthConfig;



   //if (isOnDashboard) {
        //if (isLoggedIn) return true;
        //return false; // Redirige a login si no está autenticado
      //} else if (isLoggedIn) {
        //return Response.redirect(new URL('/dashboard', nextUrl));
      //}
      //return true;
    //},