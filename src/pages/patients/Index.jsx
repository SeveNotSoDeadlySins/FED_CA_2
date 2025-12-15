// this is where all patient
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

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

export default function Index() {
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();

  const formatDateDMY = (value) => {
    if (!value) return "";
    // create a Date object from the input
    // if the value is a number we assume it's a unix timestamp (seconds),
    // so multiply by 1000 to convert to milliseconds    let date;
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
    const fetchPatients = async () => {
      const options = {
        method: "GET",
        url: "/patients",

      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();

    console.log("Hi");

  }, []);

  const onDeleteCallback = (id) => {
    toast.success("patient deleted successfully");
    setPatients(patients.filter(patient => patient.id !== id));

  }

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link size="sm" to="/patients/create">
            Create a new Doctor
          </Link>
        </Button>

      )}


      <Table>
        <TableCaption>A list of your recent patients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Address</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.first_name}</TableCell>
              <TableCell>{patient.last_name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{formatDateDMY(patient.date_of_birth)}</TableCell>
              <TableCell>{patient.address}</TableCell>
              {token && <TableCell>
                <div className="flex gap-2">
                  <Button className="cursor-pointer hover:bg-blue-500" variant="outline" size="icon" onClick={() => navigate(`/patients/${patient.id}`)}><Eye /></Button>
                  <Button className="cursor-pointer hover:bg-green-500" variant="outline" size="icon" onClick={() => navigate(`/patients/${patient.id}/edit`)}><Pen /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="patients" id={patient.id} />
                </div>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
