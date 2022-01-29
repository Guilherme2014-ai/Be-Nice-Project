import userInputGenerator from "../../utils/userInputGenerator";
import newUserInput from "../../utils/newUserInput";

const { name, email, password } = userInputGenerator();
const userTest = new newUserInput(name, email, password);

export default userTest;
