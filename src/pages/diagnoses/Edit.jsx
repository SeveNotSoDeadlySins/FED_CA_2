import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";


export default function Edit() {
  const [form, setForm] = useState({
    condition: "",
    diagnosis_date: "",
    patient_id: "",

  });
  const { token } = useAuth();


  useEffect(() => {
    const fetchDiagnose = async () => {
      const options = {
        method: "GET",
        url: `/diagnoses/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);

        let diagnose = response.data;

        setForm({condition: diagnose.condition,
                 diagnosis_date: diagnose.diagnosis_date,
                 patient_id: diagnose.patient_id
                });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDiagnose();

    console.log("Hi");
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateDiagnose = async () => {
    const options = {
      method: "PATCH",
      url: `/diagnoses/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/diagnoses");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateDiagnose();
  };

  return (
    <>
      Update a Diagnose
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Condition"
          name="condition"
          value={form.condition}
          onChange={handleChange}
        />
        <Input
          className="mt-3"
          type="text"
          placeholder="diagnosis date"
          name="diagnosis_date"
          value={form.diagnosis_date}
          onChange={handleChange}
        />

        <Input
          className="mt-3"
          type="number"
          placeholder="patient_id"
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
        />
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
