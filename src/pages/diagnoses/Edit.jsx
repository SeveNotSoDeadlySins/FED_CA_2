import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import FormCard from "@/components/formcard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { formatDateDMY } from "@/components/DateFormat";

// Define Zod schema for validation
const diagnosisSchema = z.object({
  condition: z.string().min(1, "Condition is required"),
  diagnosis_date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
  patient_id: z.string().regex(/^\d+$/, "Patient ID must be a number"),
});

export default function EditDiagnosis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      condition: "",
      diagnosis_date: "",
      patient_id: "",
    },
    mode: "onChange",
  });

  // Fetch existing diagnosis data
  useEffect(() => {
    const fetchDiagnose = async () => {
      try {
        const response = await axios.get(`/diagnoses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Reset form with fetched data
        form.reset({
          condition: data.condition,
          diagnosis_date: formatDateDMY(data.diagnosis_date),
          patient_id: String(data.patient_id),
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load diagnosis");
      }
    };

    fetchDiagnose();
  }, [id, token]);

  // Submit handler
  const submitForm = async (data) => {
    try {
      const response = await axios.patch(
        `/diagnoses/${id}`,
        {
          condition: data.condition,
          diagnosis_date: data.diagnosis_date,
          patient_id: parseInt(data.patient_id),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Diagnosis updated successfully");
      navigate("/diagnoses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update diagnosis");
    }
  };

  return (
    <>
      <Toaster />
      <FormCard
        title="Edit Diagnosis"
        onSubmit={form.handleSubmit(submitForm)}
        submitText="Save Diagnosis"
      >
        <Controller
          name="condition"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Condition</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="diagnosis_date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Diagnosis Date</FieldLabel>
              <Input {...field} placeholder="DD/MM/YYYY" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="patient_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Patient ID</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormCard>
    </>
  );
}
