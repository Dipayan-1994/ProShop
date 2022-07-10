
const dotenv = require("dotenv");
const bootstrap =require('./bootstrap');

dotenv.config();


// const PORT = process.env.PORT || 5000;

// app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// );

const main = async () => {
  try {
    await bootstrap.preloader();
    const app= await bootstrap.initApplication();
   
    await bootstrap.loadConfiguration(app);
    
    await bootstrap.loadDatabase(app);

    await bootstrap.listen(app);
  } catch (e) {
    process.exit(1);
  }
};

main();
