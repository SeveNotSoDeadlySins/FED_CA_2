import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Show() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  const { id } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPatientData = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const patientResquest = await axios.get(`/patients/${id}`, { headers });
        setPatient(patientResquest.data);

        const appointmentsResquest = await axios.get(`/appointments`, { headers });
        const patientAppointments = appointmentsResquest.data.filter(
          (i) => String(i.patient_id) === String(id)
        );
        setAppointments(patientAppointments);

        const doctorIds = patientAppointments.map((i) => i.doctor_id);
        const doctorsResquest = await axios.get(`/doctors`, { headers });
        const patientDoctors = doctorsResquest.data.filter((d) => doctorIds.includes(d.id));
        setDoctors(patientDoctors);

        const prescriptionsResquest = await axios.get(`/prescriptions`, { headers });
        setPrescriptions(
          prescriptionsResquest.data.filter((p) => String(p.patient_id) === String(id))
        );

        const diagnosesResquest = await axios.get(`/diagnoses`, { headers });
        setDiagnoses(
          diagnosesResquest.data.filter((d) => String(d.patient_id) === String(id))
        );
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };

    fetchPatientData();
  }, [id, token]);

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Info */}
      <Card className="bg-white shadow-lg rounded-xl border border-gray-200 w-full max-w-3xl mx-auto">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">
            {patient.first_name} {patient.last_name}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Email: {patient.email} <br />
            Phone: {patient.phone} <br />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Patient ID: {patient.id}
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Doctors Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            {doctors.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {doctors.map((d) => (
                  <li key={d.id} className="font-medium text-gray-700">
                    {d.first_name} {d.last_name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No doctors found</p>
            )}
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <ul className="space-y-2">
                {appointments.map((a) => {
                  const doctor = doctors.find((d) => d.id === a.doctor_id);
                  return (
                    <li key={a.id} className="text-gray-700">
                      <span className="font-semibold">{a.appointment_date}</span> with{" "}
                      <span className="text-blue-600">
                        {doctor ? `${doctor.first_name} ${doctor.last_name}` : "Unknown Doctor"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No appointments found</p>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions Section */}
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {prescriptions.length > 0 ? (
              <ul className="space-y-1">
                {prescriptions.map((p) => (
                  <li key={p.id} className="text-gray-700">
                    <span className="font-semibold">{p.condition}</span> - Prescribed {p.medication}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No prescriptions found</p>
            )}
          </CardContent>
        </Card>

        {/* Diagnoses Section */}
        <Card className="bg-white shadow-md rounded-lg border border-gray-200">
          <CardHeader>
            <CardTitle>Diagnoses</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnoses.length > 0 ? (
              <ul className="space-y-1">
                {diagnoses.map((d) => (
                  <li key={d.id} className="text-gray-700">
                    <span className="font-semibold">{d.condition}</span> - {d.diagnosis_date}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No diagnoses found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
