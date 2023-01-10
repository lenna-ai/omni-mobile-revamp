import Echo from "laravel-echo/dist/echo";
import io from "socket.io-client";

export default (echo = new Echo({
  client: io,
  broadcaster: "socket.io",
  // host: 'https://dev.lenna.ai:3000',
  // host: 'https://staging.lenna.ai:3000',
  host: "https://app.lenna.ai:3000"
}));
