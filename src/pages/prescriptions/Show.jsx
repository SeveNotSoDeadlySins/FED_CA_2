import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Show() {
  const [prescription, setDoctor] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();


  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/prescriptions/${id}`,
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

    fetchDoctor();

    console.log("Hi");
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{prescription.diagnosis_id} {prescription.doctor_id}</CardTitle>
        <CardDescription>
          {prescription.dosage}
          <br />
          {prescription.end_date}
                    <br />

          {prescription.medication}
          {prescription.patient_id}
          {prescription.start_date}



        </CardDescription>
      </CardHeader>
    </Card>
  );
}
