import routesInicio from './_inicio/routes'
import routesAutenticacion from './autenticacion/public.routes'
import routesContacto from './models/contacto/public.routes'
import routesPais from './models/pais/public.routes'
import routesCiudad from './models/ciudad/public.routes'
import routesDireccion from './models/direccion/public.routes'
import routesRol from './models/rol/public.routes'
import routesUsuario from './models/usuario/public.routes'
import routesFamilia from './models/familia/public.routes'
import routesCem from './models/cem/public.routes'
import routesCel from './models/cel/public.routes'
import routesAlumno from './models/alumno/public.routes'
import routesPrograma from './models/programa_estudio/public.routes'
import routesPostulacion from './models/postulacion/public.routes'
import routesSeguro from './models/seguro/public.routes'

const routes = [
  routesInicio,
  routesAutenticacion,
  routesContacto,
  routesPais,
  routesCiudad,
  routesDireccion,
  routesRol,
  routesUsuario,
  routesFamilia,
  routesCem,
  routesCel,
  routesAlumno,
  routesPrograma,
  routesPostulacion,
  routesSeguro
]

export default routes
