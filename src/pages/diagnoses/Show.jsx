import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatDateDMY } from "@/components/DateFormat";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Show() {
    const [diagnose, setDiagnose] = useState([]);
    const [patient, setPatient] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();


    useEffect(() => {
        const fetchDiagnoseAndPatient = async () => {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            try {
                // get diagnose first
                const diagnoseRes = await axios.get(`/diagnoses/${id}`, { headers });
                const diagnoseData = diagnoseRes.data;
                setDiagnose(diagnoseData);

                // then get the patient so i can display their name
                const patientRes = await axios.get(`/patients/${diagnoseData.patient_id}`,{ headers });
                setPatient(patientRes.data);

            } catch (err) {
                console.error(err);
            }
        };

        if (token) {
            fetchDiagnoseAndPatient();
        }

        console.log("Hi");

    }, [id, token]);



return (
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle>{diagnose.condition}</CardTitle>
            <CardDescription>
                {formatDateDMY(diagnose.diagnosis_date)}
                <br />

                {patient.first_name} {patient.last_name}
            </CardDescription>
        </CardHeader>
    </Card>
);
}
