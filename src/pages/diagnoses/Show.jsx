import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatDateDMY } from "@/components/DateFormat";
import ShowCard from "@/components/ShowCard";
import { IconPillFilled } from "@tabler/icons-react";


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
                const patientRes = await axios.get(`/patients/${diagnoseData.patient_id}`, { headers });
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

    if (!diagnose || !patient) {
        return <p className="text-center py-20 text-gray-500">Loading...</p>;
    }


    return (
        <div className="flex justify-center">
            <ShowCard
                icon={IconPillFilled}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                title="Diagnosis Details"
            >
                <p className="text-lg font-semibold">
                    {diagnose.condition}
                </p>

                <p>
                    <span className="font-semibold">Diagnosed on:</span>{" "}
                    {formatDateDMY(diagnose.diagnosis_date)}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    Patient: {patient.first_name} {patient.last_name}
                </p>
            </ShowCard>
        </div>
    );
}
