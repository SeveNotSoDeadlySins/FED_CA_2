import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ShowCard from "@/components/showcard";
import { IconCalendarClock  } from "@tabler/icons-react";
import { formatDateDMY } from "@/components/DateFormat";


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
        <div className="flex justify-center">
            <ShowCard
                icon={IconCalendarClock}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                title="Appointment Details"
            >
                <p className="text-lg font-semibold">
                    {formatDateDMY(appointment.appointment_date)}
                </p>

                <p>
                    <span className="font-semibold">Doctor ID:</span>{" "}
                    {appointment.doctor_id}
                </p>

                <p>
                    <span className="font-semibold">Patient ID:</span>{" "}
                    {appointment.patient_id}
                </p>
            </ShowCard>
        </div>
    );

}
