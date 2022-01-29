import newUserInput from "../../utils/newUserInput";
import userInputGenerator from "../../utils/userInputGenerator";

const { email, name, password } = userInputGenerator();

const userComplimentsTests = new newUserInput(name, email, password);

export default userComplimentsTests;
