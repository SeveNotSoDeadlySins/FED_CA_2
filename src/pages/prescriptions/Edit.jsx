import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import FormCard from "@/components/formcard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formatDateDMY } from "@/components/DateFormat";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

// Define Zod schema for validation
const prescriptionSchema = z.object({
  patient_id: z.string().regex(/^\d+$/, "Patient ID must be a number"),
  doctor_id: z.string().regex(/^\d+$/, "Doctor ID must be a number"),
  diagnosis_id: z.string().regex(/^\d+$/, "Diagnosis ID must be a number"),
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  start_date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Start Date must be in DD/MM/YYYY format"),
  end_date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "End Date must be in DD/MM/YYYY format"),
});

export default function EditPrescription() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      diagnosis_id: "",
      medication: "",
      dosage: "",
      start_date: "",
      end_date: "",
    },
    mode: "onChange",
  });

  // Fetch existing prescription data
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`/prescriptions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        // Reset form with fetched data
        form.reset({
          patient_id: String(data.patient_id),
          doctor_id: String(data.doctor_id),
          diagnosis_id: String(data.diagnosis_id),
          medication: data.medication,
          dosage: data.dosage,
          start_date: formatDateDMY(data.start_date),
          end_date: formatDateDMY(data.end_date),
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load prescription");
      }
    };

    fetchPrescription();
  }, [id, token]);

  // Submit handler
  const submitForm = async (data) => {
    try {
      const response = await axios.patch(
        `/prescriptions/${id}`,
        {
          patient_id: parseInt(data.patient_id),
          doctor_id: parseInt(data.doctor_id),
          diagnosis_id: parseInt(data.diagnosis_id),
          medication: data.medication,
          dosage: data.dosage,
          start_date: data.start_date,
          end_date: data.end_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Prescription updated successfully");
      navigate("/prescriptions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update prescription");
    }
  };

  return (
    <>
      <Toaster />
      <FormCard
        title="Edit Prescription"
        onSubmit={form.handleSubmit(submitForm)}
        submitText="Save Prescription"
      >
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

        <Controller
          name="doctor_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Doctor ID</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="diagnosis_id"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Diagnosis ID</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="medication"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Medication</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="dosage"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Dosage</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="start_date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Start Date</FieldLabel>
              <Input {...field} placeholder="DD/MM/YYYY" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="end_date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>End Date</FieldLabel>
              <Input {...field} placeholder="DD/MM/YYYY" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormCard>
    </>
  );
}
