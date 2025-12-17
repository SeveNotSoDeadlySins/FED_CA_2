import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/config/api";
import { useNavigate } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreateDiagnose() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Validation schema
  const formSchema = z.object({
    condition: z.string().min(1, "Condition is required"),
    diagnosis_date: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
    patient_id: z.string().regex(/^\d+$/, "Patient ID must be a number"),
  });

  // Use a single `form` object like the login form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: "",
      diagnosis_date: "",
      patient_id: "",
    },
    mode: "onChange",
  });

  // Submit function
  const submitForm = async (data) => {
    try {
      const response = await axios.post(
        "/diagnoses",
        {
          condition: data.condition,
          diagnosis_date: data.diagnosis_date,
          patient_id: parseInt(data.patient_id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Diagnose "${response.data.condition}" created successfully`);
      navigate("/diagnoses");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create diagnose");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <CardTitle>Create Diagnose</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="condition"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Condition</FieldLabel>
                  <Input {...field} placeholder="Condition" />
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
                  <Input {...field} placeholder="Patient Number" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          {/* Button now submits the form */}
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
