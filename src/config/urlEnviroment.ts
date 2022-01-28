const localhost = "http://localhost";

const urls = {
  test: localhost,
  development: localhost,
  production: "",
};

const env = process.env.NODE_ENV;

export default urls[`${env}`];
