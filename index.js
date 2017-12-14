import express from 'express';

const app = express();
const port = process.env.PORT || 8080;

app.get('/', function(req, res){
  console.log("request to / with req:", req);
});

app.listen(port, () => {
  console.log('LambdaMailman is ready to deliver via port:', port);
});
