import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/config/api";
import { useNavigate } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreatePrescription() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Zod validation schema
  const formSchema = z.object({
    diagnosis_id: z.string().regex(/^\d+$/, "Diagnosis ID must be a number"),
    doctor_id: z.string().regex(/^\d+$/, "Doctor ID must be a number"),
    patient_id: z.string().regex(/^\d+$/, "Patient ID must be a number"),
    medication: z.string().min(1, "Medication is required"),
    dosage: z.string().min(1, "Dosage is required"),
    start_date: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Start date must be in DD/MM/YYYY format"),
    end_date: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "End date must be in DD/MM/YYYY format"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosis_id: "",
      doctor_id: "",
      patient_id: "",
      medication: "",
      dosage: "",
      start_date: "",
      end_date: "",
    },
    mode: "onChange",
  });

  const submitForm = async (data) => {
    try {
      const response = await axios.post(
        "/prescriptions",
        {
          diagnosis_id: parseInt(data.diagnosis_id),
          doctor_id: parseInt(data.doctor_id),
          patient_id: parseInt(data.patient_id),
          medication: data.medication,
          dosage: data.dosage,
          start_date: data.start_date,
          end_date: data.end_date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Prescription "${response.data.medication}" starting at ${response.data.start_date} created successfully`
      );
      navigate("/prescriptions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create prescription");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <CardTitle>Create Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="diagnosis_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Diagnosis ID</FieldLabel>
                  <Input {...field} placeholder="Diagnosis ID" type="number" />
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
                  <Input {...field} placeholder="Doctor ID" type="number" />
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
                  <Input {...field} placeholder="Patient ID" type="number" />
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
                  <Input {...field} placeholder="Medication" />
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
                  <Input {...field} placeholder="Dosage" />
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
          </div>
          <div className="mt-4">
            <Button type="submit" variant="outline" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}