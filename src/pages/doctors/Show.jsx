import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import ShowCard from "@/components/showcard";
import {
  IconStethoscope,
  IconCalendarClock,
  IconNotes,
  IconTheater,
} from "@tabler/icons-react";

import { formatDateDMY } from "@/components/DateFormat";


export default function Show() {
  const [doctor, setDoctor] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);


  const { id } = useParams();
  const { token } = useAuth();


  const fetchDoctor = async () => {
    const options = {
      method: "GET",
      url: `/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      setDoctor(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPrescriptions = async () => {
    const options = {
      method: "GET",
      url: `https://ca2-med-api.vercel.app/prescriptions`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);

      console.log(typeof response.data[0].doctor_id)
      console.log(typeof id)

      setPrescriptions(response.data.filter(prescription => prescription.doctor_id == id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppointments = async () => {
    const options = {
      method: "GET",
      url: `https://ca2-med-api.vercel.app/appointments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      setAppointments(response.data.filter(appointment => appointment.doctor_id == id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const options = {
        method: "GET",
        url: `https://ca2-med-api.vercel.app/patients`,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.request(options);

      const patientsMap = {};
      response.data.forEach(patient => {
        patientsMap[patient.id] = patient;
      });
      setPatients(patientsMap);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoctor();
      await fetchAppointments();
      await fetchPrescriptions();
      await fetchPatients();
    };
    fetchData();
  }, []);

  if (!doctor) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }


  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10 px-4">

      {doctor && (
        <ShowCard
          icon={IconStethoscope}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          title={`${doctor.first_name} ${doctor.last_name}`}
          hover={false}
        >
          <p className="text-gray-700 font-medium">
            {doctor.specialisation}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {doctor.email}
          </p>

          <p>
            <span className="font-semibold">Phone:</span> {doctor.phone}
          </p>
        </ShowCard>
      )}

      {/* Appointments */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b pb-2">
          Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-lg">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const patient = patients[appointment.patient_id];

              return (
                <ShowCard
                  key={appointment.id}
                  icon={IconCalendarClock}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                >
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDateDMY(appointment.appointment_date)}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Patient:</span>
                    <IconTheater className="w-4 h-4 text-green-600" />
                    {patient
                      ? `${patient.first_name} ${patient.last_name}`
                      : appointment.patient_id}
                  </p>
                </ShowCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescriptions */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 border-b pb-2">
          Prescriptions
        </h2>

        {prescriptions.length === 0 ? (
          <p className="text-gray-500 text-lg">No prescriptions found.</p>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const patient = patients[prescription.patient_id];

              return (
                <ShowCard
                  key={prescription.id}
                  icon={IconNotes}
                  iconBg="bg-yellow-100"
                  iconColor="text-yellow-600"
                >
                  <p>
                    <span className="font-semibold">Medication:</span>{" "}
                    {prescription.medication}
                  </p>

                  <p>
                    <span className="font-semibold">Dosage:</span>{" "}
                    {prescription.dosage}
                  </p>

                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Patient:</span>
                    <IconTheater className="w-4 h-4 text-green-600" />
                    {patient
                      ? `${patient.first_name} ${patient.last_name}`
                      : prescription.patient_id}
                  </p>

                  <p className="text-sm text-gray-500">
                    {prescription.start_date} → {prescription.end_date}
                  </p>
                </ShowCard>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}