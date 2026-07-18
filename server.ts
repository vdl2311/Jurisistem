import app from './api/index';
import path from 'path';
import express from 'express';
import fs from 'fs';

const PORT = process.env.PORT || 4000;

// Em produção, se a pasta dist existir, serve os arquivos estáticos compilados pelo Vite
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log(`[Backend] Serving static files from ${distPath}`);
  app.use(express.static(distPath));
  
  // Qualquer rota que não seja da API será direcionada para o index.html (suporte para client-side router)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Backend] Full-stack Express server running on port ${PORT}`);
});
