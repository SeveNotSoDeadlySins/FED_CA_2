// this is where all appointment
import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";


import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Pen } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";


export default function Index() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState({});
    const [patients, setPatients] = useState({});

    const navigate = useNavigate();
    const { token } = useAuth();


    useEffect(() => {
        const fetchAppointments = async () => {
            const options = {
                method: "GET",
                url: "/appointments",
                headers: {
                    Authorization: `Bearer ${token}`
                },


            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                setAppointments(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointments();
        const fetchDoctorsAndPatients = async () => {
            try {
                // Promise all sends 2 requests to the api at the same time which is faster then doing it 1 by one
                const [doctorRes, patientRes] = await Promise.all([
                    axios.request({ method: "GET", url: "/doctors", headers: { Authorization: `Bearer ${token}` } }),
                    axios.request({ method: "GET", url: "/patients", headers: { Authorization: `Bearer ${token}` } }),
                ]);


                const doctorsData = {};
                doctorRes.data.forEach(doctor => {
                    doctorsData[doctor.id] = doctor;
                });
                setDoctors(doctorsData);

                const patientsData = {};
                patientRes.data.forEach(patient => {
                    patientsData[patient.id] = patient;
                });
                setPatients(patientsData);

            } catch (error) {
                console.log(error)
            }
        };


        fetchDoctorsAndPatients();

        console.log("Hi");

    }, []);

    const formatDateDMY = (value) => {
        if (!value) return "";
        // create a Date object from the input
        // if the value is a number we assume it's a unix timestamp (seconds),
        // so multiply by 1000 to convert to milliseconds
        let date;
        if (typeof value === "number") {
            date = new Date(value * 1000);
        } else {
            // otherwise try to parse the value as an ISO/date string
            date = new Date(value);
        }
        // if parsing failed (invalid date), return the original value as a fallback
        if (isNaN(date)) return String(value);
        // extract day, month, year and pad day/month to 2 digits
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        // return formatted string in dd/mm/yyyy format
        return `${dd}/${mm}/${yyyy}`;
    };

    const onDeleteCallback = (id) => {
        toast.success("Appointment deleted successfully");
        setAppointments(appointments.filter(appointment => appointment.id !== id));

    }

    return (
        <>
            {token && (
                <Button asChild variant="outline" className="mb-4 mr-auto block">
                    <Link size="sm" to="/appointments/create">
                        Create a new Appointment
                    </Link>
                </Button>
            )}

            <Table>
                <TableCaption>A list of your recent appointments.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Appoitment Date</TableHead>
                        <TableHead>Doctor id</TableHead>
                        <TableHead>Patient id</TableHead>
                        {token && <TableHead></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment) => {
                        const doctor = doctors[String(appointment.doctor_id)];
                        const patient = patients[String(appointment.patient_id)];
                        return (
                            <TableRow key={appointment.id}>
                                <TableCell>{formatDateDMY(appointment.appointment_date)}</TableCell>
                                <TableCell>{doctor ? `${doctor.first_name} ${doctor.last_name}` : appointment.doctor_id}</TableCell>
                                <TableCell>{patient ? `${patient.first_name} ${patient.last_name}` : appointment.patient_id}</TableCell>
                                {token && <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="cursor-pointer hover:bg-blue-500" variant="outline" size="icon" onClick={() => navigate(`/appointments/${appointment.id}`)}><Eye /></Button>
                                        <Button className="cursor-pointer hover:bg-green-500" variant="outline" size="icon" onClick={() => navigate(`/appointments/${appointment.id}/edit`)}><Pen /></Button>
                                        <DeleteBtn onDeleteCallback={onDeleteCallback} resource="appointments" id={appointment.id} />
                                    </div>
                                </TableCell>}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    );
}
