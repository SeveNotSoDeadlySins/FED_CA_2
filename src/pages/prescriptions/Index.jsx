// this is where all prescription
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
  const [prescriptions, setPrescription] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();

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


  useEffect(() => {
    const fetchPrescriptions = async () => {
      const options = {
        method: "GET",
        url: "/prescriptions",
        headers: {
          Authorization: `Bearer ${token}`,
        },

      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPrescription(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPrescriptions();


    console.log("Hi");

  }, []);

  const onDeleteCallback = (id) => {
    toast.success("prescription deleted successfully");
    setDoctors(prescriptions.filter(prescription => prescription.id !== id));

  }

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link size="sm" to="/prescriptions/create">
            Create a new Prescription
          </Link>
        </Button>)}

      <Table>
        <TableCaption>A list of your recent prescriptions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient name</TableHead>
            <TableHead>doctor name</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>End date</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>{prescription.patient_id}</TableCell>
              <TableCell>{prescription.doctor_id}</TableCell>
              <TableCell>{prescription.diagnosis_id}</TableCell>
              <TableCell>{prescription.medication}</TableCell>
              <TableCell>{prescription.dosage}</TableCell>
              <TableCell>{formatDateDMY(prescription.start_date)}</TableCell>
              <TableCell>{formatDateDMY(prescription.end_date)}</TableCell>
              {token && <TableCell>
                <div className="flex gap-2">
                  <Button className="cursor-pointer hover:bg-blue-500" variant="outline" size="icon" onClick={() => navigate(`/prescriptions/${prescription.id}`)}><Eye /></Button>
                  <Button className="cursor-pointer hover:bg-green-500" variant="outline" size="icon" onClick={() => navigate(`/prescriptions/${prescription.id}/edit`)}><Pen /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="prescriptions" id={prescription.id} />
                </div>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
