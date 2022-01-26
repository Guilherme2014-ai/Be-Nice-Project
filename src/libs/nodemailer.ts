import { createTransport } from "nodemailer";
import emailTransporterConfig from "../config/emailTransporterConfig";

export default createTransport(emailTransporterConfig);
