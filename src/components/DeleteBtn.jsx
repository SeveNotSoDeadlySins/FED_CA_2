import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


export default function DeleteBtn({ resource, id, onDeleteCallback }) {
  const [isDeleting, setIsDeleting] = useState(false); // Track if the user clicked delete
  const { token } = useAuth(); // Get authorization token

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  const deleteDoctor = async () => {
    // Get all appointments for this doctor
    const appointmentRequest = await axios.get("/appointments", { headers });
    const doctorAppointments = appointmentRequest.data.filter(
      (i) => String(i.doctor_id) === String(id)
    );


    if (doctorAppointments.length > 0) {
      await Promise.all(
        doctorAppointments.map((i) =>
          axios.delete(`/appointments/${i.id}`, { headers })
        )
      );
    }

    // Get all prescriptions for this doctor
    const prescriptionsResquest = await axios.get("/prescriptions", { headers });
    const doctorPrescriptions = prescriptionsResquest.data.filter(
      (i) => String(i.doctor_id) === String(id)
    );

    if (doctorPrescriptions.length > 0) {
      await Promise.all(
        doctorPrescriptions.map((i) =>
          axios.delete(`/prescriptions/${i.id}`, { headers })
        )
      );
    }

    await axios.delete(`/doctors/${id}`, { headers });
  };

  const onDelete = async () => {
    try {
      if (resource === "doctors") {
        await deleteDoctor();
      }

      if (resource === "patients") {
         // Delete related appointments, prescriptions, diagnoses first
        const appointmentsResquest = await axios.get("/appointments", { headers });
        const patientAppointments = appointmentsResquest.data.filter(
          (i) => String(i.patient_id) === String(id)
        );

        await Promise.all(
          patientAppointments.map((i) =>
            axios.delete(`/appointments/${i.id}`, { headers })
          )
        );

        const prescriptionsResquest = await axios.get("/prescriptions", { headers });
        const patientPrescriptions = prescriptionsResquest.data.filter(
          (i) => String(i.patient_id) === String(id)
        );

        await Promise.all(
          patientPrescriptions.map((i) =>
            axios.delete(`/prescriptions/${i.id}`, { headers })
          )
        );

        const diagnosesResquest = await axios.get("/diagnoses", { headers });
        const patientDiagnoses = diagnosesResquest.data.filter(
          (i) => String(i.patient_id) === String(id)
        );

        await Promise.all(
          patientDiagnoses.map((i) =>
            axios.delete(`/diagnoses/${i.id}`, { headers })
          )
        );

        await axios.delete(`/patients/${id}`, { headers });
      }

      if (resource === "appointments") {
        // Delete related prescriptions first
        const prescriptionsResquest = await axios.get("/prescriptions", { headers });
        const appointmentPrescriptions = prescriptionsResquest.data.filter(
          (i) => String(i.appointment_id) === String(id)
        );

        await Promise.all(
          appointmentPrescriptions.map((i) =>
            axios.delete(`/prescriptions/${i.id}`, { headers })
          )
        );

        await axios.delete(`/appointments/${id}`, { headers });
      }

      // Call callback to update parent component state
      if (onDeleteCallback) onDeleteCallback(id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false); // Reset delete confirmation
    }
  };

  return !isDeleting ? (
    <Button
      className="cursor-pointer hover:bg-red-500"
      variant="outline"
      size="icon"
      onClick={() => setIsDeleting(true)}
    >
      <Trash />
    </Button>
  ) : (
    <>
      <p>Are you sure?</p>
      <Button
        onClick={onDelete}
        variant="outline"
        size="sm"
        className="text-red-500 border-red-500 hover:border-red-500 hover:bg-red-500"
      > Yes</Button>
      <Button
        onClick={() => setIsDeleting(false)} 
        variant="outline"
        size="sm"
        className="text-slate-500 border-slate-500 hover:border-slate-500 hover:bg-slate-500"
      > No</Button>
    </>
  );
}