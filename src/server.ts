import app from 'app';
import { config } from 'config/config';

const startServer = () => {
  const PORT = config.PORT || 3000;

  app.listen(PORT, () => {
    console.log(` 🌐 Server listening on PORT ${PORT} 🚀 `);
  });
};

startServer();
