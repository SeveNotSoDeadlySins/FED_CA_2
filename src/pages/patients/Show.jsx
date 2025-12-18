import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ShowCard from "@/components/ShowCard";

import {
  IconStethoscope,
  IconTheater,
  IconCalendarClock,
  IconNotes,
  IconPillFilled,
} from "@tabler/icons-react";
import { formatDateDMY } from "@/components/DateFormat";

export default function Show() {
  // State to store patient and all the other data
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);

  const { id } = useParams(); // Get patient ID from URL
  const { token } = useAuth(); // Get auth token

  // Fetch all patient-related data when component mounts
  useEffect(() => {
    const fetchPatientData = async () => {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch patient info
        const patientResquest = await axios.get(`/patients/${id}`, { headers });
        setPatient(patientResquest.data);

        // Fetch all appointments and filter for this patient
        const appointmentsResquest = await axios.get(`/appointments`, { headers });
        const patientAppointments = appointmentsResquest.data.filter(
          (i) => String(i.patient_id) === String(id)
        );
        setAppointments(patientAppointments);

        // Get unique doctor IDs from patient's appointments
        const doctorIds = patientAppointments.map((i) => i.doctor_id);
        const doctorsResquest = await axios.get(`/doctors`, { headers });
        const patientDoctors = doctorsResquest.data.filter((d) => doctorIds.includes(d.id));
        setDoctors(patientDoctors);

        // Fetch prescriptions for this patient
        const prescriptionsResquest = await axios.get(`/prescriptions`, { headers });
        setPrescriptions(
          prescriptionsResquest.data.filter((p) => String(p.patient_id) === String(id))
        );

        // Fetch diagnoses for this patient
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

  // Show loading message if patient data hasn't loaded yet
  if (!patient) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10 px-4">

      {/* Patient Info */}
      <ShowCard
        icon={IconTheater}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        title={`${patient.first_name} ${patient.last_name}`}
        hover={false}
      >
        <p><span className="font-semibold">Email:</span> {patient.email}</p>
        <p><span className="font-semibold">Phone:</span> {patient.phone}</p>
        <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
      </ShowCard>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Doctors */}
        <ShowCard
          icon={IconStethoscope}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          title="Doctors"
        >
          {doctors.length ? (
            doctors.map((d) => (
              <p key={d.id}>
                {d.first_name} {d.last_name}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No doctors found</p>
          )}
        </ShowCard>

        {/* Appointments */}
        <ShowCard
          icon={IconCalendarClock}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Appointments"
        >
          {appointments.length ? (
            appointments.map((a) => {
              const doctor = doctors.find((d) => d.id === a.doctor_id);
              return (
                <p key={a.id}>
                  <span className="font-semibold">
                    {formatDateDMY(a.appointment_date)}
                  </span>{" "}
                  with{" "}
                  {doctor
                    ? `${doctor.first_name} ${doctor.last_name}`
                    : "Unknown Doctor"}
                </p>
              );
            })
          ) : (
            <p className="text-gray-500">No appointments found</p>
          )}
        </ShowCard>

        {/* Prescriptions */}
        <ShowCard
          icon={IconNotes}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Prescriptions"
        >
          {prescriptions.length ? (
            prescriptions.map((p) => (
              <p key={p.id}>
                <span className="font-semibold">{p.medication}</span> — {p.dosage}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No prescriptions found</p>
          )}
        </ShowCard>

        {/* Diagnoses */}
        <ShowCard
          icon={IconPillFilled}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          title="Diagnoses"
        >
          {diagnoses.length ? (
            diagnoses.map((d) => (
              <p key={d.id}>
                <span className="font-semibold">
                  {formatDateDMY(d.diagnosis_date)}
                </span>{" "}
                — {d.condition}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No diagnoses found</p>
          )}
        </ShowCard>

      </div>
    </div>
  );
}