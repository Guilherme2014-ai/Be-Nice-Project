import IUserCreateRequest from "../../src/interfaces/IUserCreateRequest";

const randomIntNum = () => Math.trunc(Math.random() * 1000);
export default (): IUserCreateRequest => ({
  name: `Guilherme ${randomIntNum()}`,
  email: `guigui${randomIntNum()}@gmail.com`,
  password: `${randomIntNum()}${randomIntNum()}`,
});
