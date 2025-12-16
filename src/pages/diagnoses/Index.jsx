// this is where all diagnose
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
  const [diagnoses, setDiagnoses] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();


  useEffect(() => {
    const fetchDiagnoses = async () => {
      const options = {
        method: "GET",
        url: "/diagnoses",
        
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDiagnoses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDiagnoses();
    

    console.log("Hi");

  }, []);

  const onDeleteCallback = (id) => {
    toast.success ("diagnose deleted successfully");
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
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialisation</TableHead>
            { token && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnoses.map((diagnose) => (
            <TableRow key={diagnose.id}>
              <TableCell>{diagnose.first_name}</TableCell>
              <TableCell>{diagnose.last_name}</TableCell>
              <TableCell>{diagnose.email}</TableCell>
              <TableCell>{diagnose.phone}</TableCell>
              <TableCell>{diagnose.specialisation}</TableCell>
              { token && <TableCell>
                <div className="flex gap-2">
                  <Button className="cursor-pointer hover:bg-blue-500" variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnose.id}`)}><Eye /></Button>
                  <Button className="cursor-pointer hover:bg-green-500" variant="outline" size="icon" onClick={() => navigate(`/diagnoses/${diagnose.id}/edit`)}><Pen /></Button>
                  <DeleteBtn onDeleteCallback={onDeleteCallback} resource="diagnoses" id={diagnose.id} />
                </div>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
