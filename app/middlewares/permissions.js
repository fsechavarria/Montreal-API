// Middleware para permisos en base a roles
function permit (role) {
	return (req, res, next) => {
		if (!role) {
			next() // Solo por ahora hasta definir el acceso de los roles!!
		} else if (req.user && req.user.DESC_ROL === role) {
			next()
		} else {
			res.status(403).json({ error: true, data: { message: 'Forbidden' } })
		}
	}
}

export default permit
