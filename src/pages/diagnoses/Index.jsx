// this is where all diagnose
import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";


import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Pen } from "lucide-react";
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
  const [diagnoses, setDiagnoses] = useState([]);
  const [patients, setPatients] = useState({}); 

  const navigate = useNavigate();
  const { token } = useAuth();


  useEffect(() => {
    const fetchDiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDiagnoses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("/patients", { headers: { Authorization: `Bearer ${token}` } });
        const patientsData = {};
        response.data.forEach(patient => {
          patientsData[patient.id] = patient;
        });
        setPatients(patientsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDiagnoses();
    fetchPatients();

    console.log("Hi");

  }, []);




  const onDeleteCallback = (id) => {
    toast.success("diagnose deleted successfully");
    setDiagnoses(diagnoses.filter(diagnose => diagnose.id !== id));

  }

  return (
    <>
      {token && (
        <Button asChild variant="outline" className="mb-4 mr-auto block">
          <Link size="sm" to="/diagnoses/create">
            Create a new Diagnose
          </Link>
        </Button>)}

      <Table>
        <TableCaption>A list of your recent diagnoses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Diagnosis date</TableHead>
            {token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.map(diagnose => {
            const patient = patients[diagnose.patient_id];

            return (
              <TableRow key={diagnose.id}>
                <TableCell>
                  {patient ? `${patient.first_name} ${patient.last_name}` : diagnose.patient_id}
                </TableCell>
                <TableCell>{diagnose.condition}</TableCell>
                <TableCell>{formatDateDMY(diagnose.diagnosis_date)}</TableCell>
                {token && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnose.id}`)}>
                        <Eye />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnose.id}/edit`)}>
                        <Pen />
                      </Button>
                      <DeleteBtn resource="diagnoses" id={diagnose.id} onDeleteCallback={onDeleteCallback} />
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
