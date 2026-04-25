import net from "node:net";
import { setDefaultResultOrder } from "node:dns";

// Forzar IPv4 en SSR local: hosts con AAAA (Cloudflare, etc.) fallan el fetch
// cuando el entorno no puede rutar IPv6 (WSL sin IPv6, algunos CI).
// - setDefaultResultOrder: pone IPv4 primero en lookups DNS.
// - setDefaultAutoSelectFamily(false): desactiva Happy Eyeballs v2 para que
//   Node no corra IPv4 + IPv6 en paralelo — un ENETUNREACH del IPv6 aborta
//   también el intento IPv4 vía AggregateError, aunque IPv4 sí sería alcanzable.
setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamily(false);
