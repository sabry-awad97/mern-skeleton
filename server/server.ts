import config from "./../config/config";
import app from "./app";

const { port } = config;

app.listen(port, () => {
    console.info(`Server is running at http://localhost:${port}`);
});
