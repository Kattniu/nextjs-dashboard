import NextAuth from 'next-auth'; //importa la biblioteca NextAuth para manejar la autenticación
import Credentials from 'next-auth/providers/credentials'; //importa el proveedor de credenciales para autenticación basada en usuario y contraseña
import { authConfig } from './auth.config';//importa la configuración de autenticación desde auth.config.ts (paginas, callbacks, proveedores, etc.)
import { z } from 'zod';//importa zod para validación y análisis de esquemas de datos
import type { User } from '@/app/lib/definitions';//importa el tipo User desde definiciones comunes
import bcrypt from 'bcrypt';//Importa bcrypt para comparar contraseñas de forma segura
import postgres from 'postgres';//Importa cliente de PostgreSQL para consultar la base de datos
 

// Configura la conexión a la base de datos PostgreSQL utilizando la URL proporcionada en las variables de entorno
// { ssl: 'require' } asegura que la conexión sea segura
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
// Función que busca un usuario en la base de datos por su email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
//providersEs una matriz que enumera diferentes opciones de inicio de sesión, como Google o GitHub.
//El proveedor de credenciales permite a los usuarios iniciar sesión con un nombre de usuario y una contraseña.
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

           if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});