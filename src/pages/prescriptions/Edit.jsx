import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";


export default function Edit() {
    const [form, setForm] = useState({
        patient_id: "",
        doctor_id: "",
        diagnosis_id: "",
        medication: "",
        dosage: "",
        start_date: "",
        end_date: ""


    });
    const { token } = useAuth();


    useEffect(() => {
        const fetchPrescriptions = async () => {
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

                let prescription = response.data;

                setForm({
                    patient_id: prescription.patient_id,
                    doctor_id: prescription.doctor_id,
                    diagnosis_id: prescription.diagnosis_id,
                    medication: prescription.medication,
                    dosage: prescription.dosage,
                    start_date: prescription.start_date,
                    end_date: prescription.end_date
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchPrescriptions();

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

    const updatePrescriptions = async () => {
        const options = {
            method: "PATCH",
            url: `/prescriptions/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: form,
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/prescriptions");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        updatePrescriptions();
    };

    return (
        <>
            Update a Prescriptions
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="diagnosis_id"
                    name="diagnosis_id"
                    value={form.diagnosis_id}
                    onChange={handleChange}
                />
                <Input
                    className="mt-3"
                    type="text"
                    placeholder="medication"
                    name="medication"
                    value={form.medication}
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

                <Input
                    className="mt-3"
                    type="number"
                    placeholder="dosage"
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                />

                <Input
                    className="mt-3"
                    type="number"
                    placeholder="start_date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                />

                <Input
                    className="mt-3"
                    type="number"
                    placeholder="end_date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                />
                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
                    Submit
                </Button>
            </form>
        </>
    );
}
