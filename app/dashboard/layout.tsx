import SideNav from '@/app/ui/dashboard/sidenav';
/*Importa un componente (otro archivo) llamado sideNav
este archivo tiene el codigo del menu lareral*/


export default function Layout({ children }: { children: React.ReactNode }) {
/*Crea una funcion Layout que recibe una propiedad llamada children
en React Children significa : el contenido que va dentro del layout (las paginas hijas)*/  
    

    return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
    {/*Esto crea un div (una caja en HTML)*/}
1 div 
        {/* Barra lateral SideNav | digamos donde esta el menu*/}
        <div className="w-full flex-none md:w-64">
         2 div  holaaaaaaaaaaaaaa
        <SideNav /> {/*Aqui se muestra el menu lateral*/} 
        </div>

        {/* Área donde se muestra el contenido de la página el contenido principal */}
        <div className="grow p-20 md:overflow-y-auto md:p-12">
        hola soy un div, lo que pongas aqui saldra en las paginas hijos (Dsshboard, customers, invoices,etc)
        {children} {/*Aqui se mostrara la pagina actual(or ejemplo: Dashboard, Customers,etc)*/}

          </div>
    </div>
  );
}

/*Entonces layout muestra el menu lateral + la pagina correspondiente*/

/*SideNav es un componente (otro archivo con codigo) que muestra el menu lateral*/ 
/*Layout es una FUNCION que recibi children */
/*El layout envuelve todas las paginas dentro de el */