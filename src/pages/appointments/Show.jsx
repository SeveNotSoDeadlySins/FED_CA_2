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
    const [appointment, setAppointment] = useState([]);
    const { id } = useParams();
    const { token } = useAuth();


    useEffect(() => {
        const fetchAppointment = async () => {
            const options = {
                method: "GET",
                url: `/appointments/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setAppointment(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointment();

        console.log("Hi");
    }, []);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{appointment.appointment_date}</CardTitle>
                <CardDescription>
                    {appointment.doctor_id}
                    <br />

                    {appointment.patient_id}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
