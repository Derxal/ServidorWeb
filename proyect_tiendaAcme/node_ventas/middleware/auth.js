const jwt = require('jsonwebtoken');

// El secret está en Base64; JJWT lo decodifica igual → misma clave de firma
const SECRET = Buffer.from(process.env.JWT_SECRET, 'base64');

/**
 * Verifica el JWT en el header Authorization: Bearer <token>
 * Adjunta el payload decodificado a req.user
 *   req.user.sub      → email
 *   req.user.userId   → id numérico del usuario
 *   req.user.name     → nombre
 *   req.user.lastName → apellido
 *   req.user.role     → "ADMIN" | "USER"
 */
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    try {
        req.user = jwt.verify(authHeader.substring(7), SECRET, { algorithms: ['HS256'] });
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

/**
 * Restringe el acceso a uno o más roles.
 * Uso: router.post('/', authenticate, requireRole('ADMIN'), handler)
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        next();
    };
}

module.exports = { authenticate, requireRole };
