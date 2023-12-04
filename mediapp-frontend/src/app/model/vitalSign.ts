import { Patient } from "./patient";

export class VitalSign{
    idSign: number;
    patient: Patient;
    temperature: string;
    pulse: string;
    respiratoryRate: string;
    vitalSignDate: string;
}
