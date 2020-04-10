import app from './app';

// kill $(lsof -t -i:3333)
app.listen(3333);
