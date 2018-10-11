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
import routesCurso from './models/curso/public.routes'
import routesCalificacion from './models/calificacion/public.routes'
import routesPersona from './models/persona/public.routes'
import routesInscripcion from './models/inscripcion_alumno/public.routes'
import routesAntecedente from './models/antecedente/public.routes'
import routesCorreo from './models/email/public.routes'

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
  routesSeguro,
  routesCurso,
  routesCalificacion,
  routesPersona,
  routesInscripcion,
  routesAntecedente,
  routesCorreo
]

export default routes
