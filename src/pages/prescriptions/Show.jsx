import { useEffect, useState } from "react";
import axios from "@/config/api";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatDateDMY } from "@/components/DateFormat";
import ShowCard from "@/components/ShowCard";

import {
  IconNotes
} from "@tabler/icons-react";

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
    <div className="flex justify-center">
      <ShowCard
        icon={IconNotes}
        iconBg="bg-yellow-100"
        iconColor="text-yellow-600"
        title="Prescription Details"
      >
        <p className="text-lg font-semibold">
          {prescription.medication}
        </p>

        <p>
          <span className="font-semibold">Dosage:</span>{" "}
          {prescription.dosage}
        </p>

        <p>
          <span className="font-semibold">Patient ID:</span>{" "}
          {prescription.patient_id}
        </p>

        <p>
          <span className="font-semibold">Doctor ID:</span>{" "}
          {prescription.doctor_id}
        </p>

        <p className="text-sm text-gray-500">
          {formatDateDMY(prescription.start_date)} →{" "}
          {formatDateDMY(prescription.end_date)}
        </p>
      </ShowCard>
    </div>
  );
}
