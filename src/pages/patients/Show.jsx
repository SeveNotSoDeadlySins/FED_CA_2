import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

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
    const [patient, setPatient] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();


    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setPatient(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatient();

        console.log("Hi");
    }, []);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
                <CardDescription>
                    {patient.email}
                    <br />
                    {patient.phone}
                    <br />

                    {patient.specialisation}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
