## Cómo obtener el `STRIPE_WEBHOOK_SECRET` y añadirlo a `.env.local`

Opciones para obtener el signing secret (`whsec_...`) y guardarlo localmente.

1) Usando Stripe Dashboard (recomendado si no tienes CLI)

- Entra en https://dashboard.stripe.com
- Activa **View test data** (arriba a la derecha) si estás probando.
- Menú izquierdo → **Developers** → **Webhooks** o abre directamente:
  - Test: https://dashboard.stripe.com/test/webhooks
  - Live: https://dashboard.stripe.com/webhooks
- Crea un endpoint con la URL de tu app (ej: `https://tu-app.test/api/webhooks/stripe` o `http://localhost:3000/api/webhooks/stripe` si pruebas con ngrok/Stripe CLI).
- Al crear el endpoint, haz clic en él y selecciona **Reveal signing secret**. Copia el valor que empieza por `whsec_`.

2) Usando Stripe CLI (local)

- Instala Stripe CLI si no la tienes: https://stripe.com/docs/stripe-cli
- Inicia sesión (si no lo has hecho):
  ```powershell
  stripe login
  ```
- Ejecuta el listener que reenvía a tu servidor local:
  ```powershell
  stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
  ```
- El CLI imprimirá algo como `Webhooks signing secret: whsec_...` — copia ese valor.

3) Añadir a `.env.local`

- Abre o crea el archivo `.env.local` en la raíz del proyecto y añade la línea:

```
STRIPE_WEBHOOK_SECRET=whsec_tu_valor_aqui
```

4) Comprobar que la app recibe eventos (modo test)

- Con `stripe listen` activo, en otra terminal puedes disparar eventos de prueba:
  ```powershell
  stripe trigger checkout.session.completed
  ```
- Observa que tu endpoint `POST /api/webhooks/stripe` reciba la petición y que tu app procese la actualización del `proposal`.

Seguridad: no subas `.env.local` a git ni compartas el `whsec_...` públicamente.
