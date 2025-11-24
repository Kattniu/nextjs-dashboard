/*proxy.ts actúa como un punto central que intercepta las solicitudes 
antes de que se renderice la página.
Se usa para proteger rutas y manejar la autenticación 
de manera automática, evitando que usuarios no autenticados puedan
acceder a ciertas páginas (como /dashboard*/

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// Importamos la configuración de autenticación desde auth.config.ts

// Exportamos el middleware de autenticación con la configuración proporcionada 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  //matcher: Es un patrón que indica qué rutas quieres proteger con el Proxy.
};