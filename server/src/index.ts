import { initServer } from './app/index.js';
import * as dotenv from 'dotenv';
dotenv.config();
 async function start() {
    const app = await initServer();

    app.listen(8000, () => {
        console.log(`Server is running on http://localhost:8000/graphql`);
    });
}

start();