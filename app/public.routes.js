import routesInicio from './_inicio/routes'
import routesAutenticacion from './autenticacion/public.routes'
import routesContacto from './models/contacto/public.routes'
import routesPais from './models/pais/public.routes'
import routesCiudad from './models/ciudad/public.routes'

const routes = [
  routesInicio,
  routesAutenticacion,
  routesContacto,
  routesPais,
  routesCiudad
]

export default routes
