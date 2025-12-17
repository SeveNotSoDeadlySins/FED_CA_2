// this is where all prescriptions
import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Eye, Pen } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";
import { formatDateDMY } from "@/components/DateFormat";

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
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [patients, setPatients] = useState({});
  const [diagnoses, setDiagnoses] = useState({});

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get("/prescriptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchLookups = async () => {
      try {
        const [doctorRes, patientRes, diagnosisRes] = await Promise.all([
          axios.get("/doctors", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/patients", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/diagnoses", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setDoctors(Object.fromEntries(doctorRes.data.map(d => [d.id, d])));
        setPatients(Object.fromEntries(patientRes.data.map(p => [p.id, p])));
        setDiagnoses(Object.fromEntries(diagnosisRes.data.map(d => [d.id, d])));
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescriptions();
    fetchLookups();
  }, []);

  const onDeleteCallback = (id) => {
    toast.success("Prescription deleted successfully");
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link to="/prescriptions/create">
            Create a new Prescription
          </Link>
        </Button>
      )}

      <Table>
        <TableCaption>A list of your recent prescriptions.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {prescriptions.map((prescription) => {
            const patient = patients[prescription.patient_id];
            const doctor = doctors[prescription.doctor_id];
            const diagnosis = diagnoses[prescription.diagnosis_id];

            return (
              <TableRow key={prescription.id}>
                <TableCell>
                  {patient
                    ? `${patient.first_name} ${patient.last_name}`
                    : prescription.patient_id}
                </TableCell>

                <TableCell>
                  {doctor
                    ? `${doctor.first_name} ${doctor.last_name}`
                    : prescription.doctor_id}
                </TableCell>

                <TableCell>
                  {diagnosis
                    ? diagnosis.condition
                    : prescription.diagnosis_id}
                </TableCell>

                <TableCell>{prescription.medication}</TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>{formatDateDMY(prescription.start_date)}</TableCell>
                <TableCell>{formatDateDMY(prescription.end_date)}</TableCell>

                {token && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigate(`/prescriptions/${prescription.id}`)
                        }
                      >
                        <Eye />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigate(`/prescriptions/${prescription.id}/edit`)
                        }
                      >
                        <Pen />
                      </Button>

                      <DeleteBtn
                        resource="prescriptions"
                        id={prescription.id}
                        onDeleteCallback={onDeleteCallback}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
