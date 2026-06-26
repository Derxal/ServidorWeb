# Stack Local con SSL y Nginx Gateway

Entorno de desarrollo local con múltiples dominios HTTPS, certificados generados con **mkcert** y un gateway **nginx** que enruta el tráfico hacia los distintos proyectos Node.js y estáticos.

---

## Estructura del proyecto

```
nginx/
├── ssl/                        # Generador de certificados SSL
│   ├── docker-compose.yml
│   └── certificados/           # Certs generados (copiar a nginx/certificados/)
│
├── proyect_tiendaAcme/         # Proyecto tienda-acme.com
│   ├── docker-compose.yml
│   ├── node_rrhh/              # API RRHH  -> rrhh.tienda-acme.com
│   └── node_ventas/            # API Ventas -> ventas.tienda-acme.com
│
├── proyect_nurcito/            # Proyecto nurcito.com
│   ├── docker-compose.yml
│   └── src/                    # Sitio estático HTML vanilla
│
└── nginx/                      # Gateway HTTPS (último en levantar)
    ├── docker-compose.yml
    ├── conf/                   # Virtual hosts (.conf por dominio)
    │   ├── tienda-acme.conf
    │   └── nurcito.conf
    └── certificados/           # Certificados que usa nginx
        ├── rootCA.pem
        ├── tienda-acme/
        └── nurcito/
```

---

## Dominios disponibles

| Dominio | Proyecto | Contenedor |
|---|---|---|
| `https://rrhh.tienda-acme.com` | proyect_tiendaAcme | `module-rrhh` |
| `https://ventas.tienda-acme.com` | proyect_tiendaAcme | `module-ventas` |
| `https://nurcito.com` | proyect_nurcito | `module-nurcito` |

---

## Paso 1 — Configurar el archivo `hosts` de Windows

> Solo se hace una vez. Requiere abrir **PowerShell como Administrador**.

```powershell
Add-Content "$env:windir\System32\drivers\etc\hosts" @"

127.0.0.1 tienda-acme.com
127.0.0.1 www.tienda-acme.com
127.0.0.1 rrhh.tienda-acme.com
127.0.0.1 ventas.tienda-acme.com
127.0.0.1 nurcito.com
127.0.0.1 www.nurcito.com
"@

ipconfig /flushdns
```

---

## Paso 2 — Generar los certificados SSL

Los certificados se generan con **mkcert** dentro de contenedores Docker y quedan en `ssl/certificados/`.

```powershell
cd ./ssl
docker compose up
```

> Los servicios corren de forma **secuencial** gracias a `depends_on`: primero `ssl-tienda-acme` (crea la rootCA), luego `ssl-nurcito` (la reutiliza).

### Resultado esperado

```
ssl/certificados/
├── rootCA.pem
├── rootCA-key.pem
├── tienda-acme/
│   ├── tienda-acme.com+4.pem
│   └── tienda-acme.com+4-key.pem
└── nurcito/
    ├── nurcito.com+1.pem
    └── nurcito.com+1-key.pem
```

---

## Paso 3 — Copiar los certificados al gateway

Los certs generados en `ssl/certificados/` deben copiarse manualmente a `nginx/certificados/` para que el gateway los use.

```
ssl/certificados/tienda-acme/  →  nginx/certificados/tienda-acme/
ssl/certificados/nurcito/      →  nginx/certificados/nurcito/
ssl/certificados/rootCA.pem    →  nginx/certificados/rootCA.pem
```

---

## Paso 4 — Instalar la rootCA en el navegador *(opcional)*

> Sin este paso el sitio funciona igual, pero el navegador mostrará **"No seguro"**.
> Instalando la rootCA una sola vez, Chrome y Edge mostrarán el candado verde para todos los dominios del stack.

### Opción A — Interfaz gráfica de Windows (recomendada)

1. Ve a la carpeta `nginx/certificados/`, renombra `rootCA.pem` → `rootCA.crt`.
2. Doble clic sobre `rootCA.crt` y sigue el asistente:
   - **Instalar certificado** → **Equipo local** → **Siguiente**
   - **Colocar todos los certificados en el siguiente almacén** → **Examinar** → **Entidades de certificación raíz de confianza** → **Aceptar**
   - **Siguiente** → **Finalizar** → **Sí** en el aviso de seguridad.

### Opción B — PowerShell como Administrador

```powershell
certutil -addstore -f "ROOT" ".\nginx\certificados\rootCA.pem"
```

---

> Después de instalar por cualquiera de las dos opciones, **cierra completamente el navegador** (todas las ventanas) y vuelve a abrirlo para que tome efecto.

---

## Paso 5 — Levantar los proyectos

> ⚠️ **El gateway nginx debe levantarse SIEMPRE de último** porque necesita que las redes Docker de cada proyecto ya existan.

### 5.1 — Proyecto tienda-acme

```powershell
cd ./proyect_tiendaAcme
docker compose up -d --build
```

Levanta: `module-rrhh` y `module-ventas` en la red `tienda-acme-net`.

### 5.2 — Proyecto nurcito

```powershell
cd ./proyect_nurcito
docker compose up -d --build
```

Levanta: `module-nurcito` en la red `nurcito-net`.

### 5.3 — Gateway nginx (ÚLTIMO)

```powershell
cd ./nginx
docker compose up -d
```

Levanta: `gateway` conectado a `tienda-acme-net` y `nurcito-net`.

---

## Verificar que todo está corriendo

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"
```

Deberías ver:

```
NAMES             STATUS        NETWORKS
gateway           Up            tienda-acme-net, nurcito-net
module-rrhh       Up            tienda-acme-net
module-ventas     Up            tienda-acme-net
module-nurcito    Up            nurcito-net
```

---

## Comandos útiles

### Ver logs de un contenedor

```powershell
docker logs gateway
docker logs module-rrhh
docker logs module-ventas
docker logs module-nurcito
```

### Reiniciar el gateway (después de cambiar un .conf)

```powershell
cd ./nginx
docker compose restart
```

### Reconstruir un proyecto tras cambios en el código

```powershell
cd ./proyect_tiendaAcme
docker compose up -d --build

cd ./proyect_nurcito
docker compose up -d --build
```

### Apagar todo

```powershell
# Desde cada carpeta de proyecto:
docker compose down

# O apagar todos los contenedores de una vez:
docker stop gateway module-rrhh module-ventas module-nurcito
```

### Regenerar certificados (si expiran o necesitas recrearlos)

```powershell
cd ./ssl

# Eliminar los certs anteriores (la rootCA puede quedarse)
Remove-Item -Recurse -Force .\certificados\tienda-acme, .\certificados\nurcito -ErrorAction SilentlyContinue

# Regenerar ambos en secuencia
docker compose up
```

