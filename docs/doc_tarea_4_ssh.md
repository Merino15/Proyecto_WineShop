# Tarea 4: Conexión entre GitHub y el Servidor mediante SSH

**Asignatura:** Despliegue de Aplicaciones Web (2º DAW)  
**Proyecto:** WineShop  
**Usuario de servicio:** `deploy`  

---

## 1. Explicación Teórica: Diferencia entre Clave Pública y Clave Privada

La autenticación SSH utilizada entre el servidor de despliegue y GitHub se basa en la **criptografía asimétrica** o de clave pública. Este sistema utiliza un par de claves matemáticamente vinculadas:

* **Clave Privada (`id_ed25519`):** 
  * Permanence guardada exclusivamente en el servidor Linux, dentro del directorio `/home/deploy/.ssh/`.
  * Posee permisos restringidos (`600`) para garantizar que ningún otro usuario del sistema pueda leerla.
  * Sirve para firmar digitalmente las solicitudes de conexión enviadas a GitHub.
  * **Nunca debe compartirse ni exponerse.**

* **Clave Pública (`id_ed25519.pub`):** 
  * Se registra libremente en GitHub dentro de las *Deploy Keys* del repositorio.
  * Permite a GitHub cifrar un mensaje de prueba (*desafío*) que solo puede ser descifrado por el servidor que posee la clave privada correspondiente.

---

## 2. Justificación de los Permisos de Solo Lectura

Al configurar la *Deploy Key* en GitHub, se mantuvo la opción **"Allow write access" desactivada** (solo lectura).

**Justificación:**
Siguiendo el **principio de menor privilegio**, el servidor solo necesita consultar y descargar el código actualizado del repositorio (`git pull` / `git fetch`). No requiere permisos para realizar `git push` o modificar ramas en GitHub. En caso de que el servidor sufra un compromiso de seguridad, la clave filtrada no permitiría a un atacante inyectar código malicioso ni alterar el repositorio remoto.

---

## 3. Procedimiento Paso a Paso

### Paso 1: Generación de la pareja de claves en el servidor

Estando autenticados con el usuario `deploy`, se generó la clave con el algoritmo moderno **Ed25519**:

```bash
su - deploy
ssh-keygen -t ed25519 -C "deploy@wineshop"
```

*Nota: Se presionó `Enter` en los prompts de passphrase para permitir la automatización de futuras tareas de despliegue sin intervención manual.*

---

### Paso 2: Registro de la clave pública en GitHub

Se visualizó y copió el contenido de la clave pública:

```bash
cat ~/.ssh/id_ed25519.pub
```

Posteriormente, en el repositorio `Merino15/Proyecto_WineShop` en GitHub:
1. Se accedió a **Settings > Deploy keys > Add deploy key**.
2. **Title:** `Servidor Apache Deploy`.
3. **Key:** Se pegó el contenido completo de `id_ed25519.pub`.
4. **Allow write access:** *Desmarcado (Read-only)*.

---

### Paso 3: Verificación de la conexión SSH

Se comprobó la comunicación segura ejecutando:

```bash
ssh -T git@github.com
```

**Resultado obtenido:**
```text
Hi Merino15/Proyecto_WineShop! You've successfully authenticated, but GitHub does not provide shell access.
```

---

### Paso 4: Configuración del repositorio local

Se cambió el origen remoto del repositorio en `/var/www/wineshop` de HTTPS a SSH:

```bash
cd /var/www/wineshop
git remote set-url origin git@github.com:Merino15/Proyecto_WineShop.git
git pull origin main
```

**Resultado:** El proyecto se actualizó respondiendo `Already up to date.` sin solicitar usuario ni contraseña.