import "./scss/styles.scss";
import { WebLarek } from "./components/presenter/WebLarek";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new WebLarek();
  await app.init();
});
